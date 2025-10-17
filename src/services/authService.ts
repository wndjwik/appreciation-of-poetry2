import { RegisterRequest, LoginRequest, AuthResponse, User } from '../types/database'
import { supabase } from '../lib/supabase'

class AuthService {
  // 检查昵称是否可用
  async checkNicknameAvailability(nickname: string): Promise<{ available: boolean; message: string }> {
    // 验证昵称格式
    if (!nickname || nickname.trim().length === 0) {
      return { available: false, message: '昵称不能为空' }
    }
    
    if (nickname.length < 2) {
      return { available: false, message: '昵称至少需要2个字符' }
    }
    
    if (nickname.length > 20) {
      return { available: false, message: '昵称不能超过20个字符' }
    }
    
    // 检查昵称是否包含非法字符
    const validPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/
    if (!validPattern.test(nickname)) {
      return { available: false, message: '昵称只能包含中文、英文、数字、下划线和连字符' }
    }
    
    try {
      // 检查昵称是否已存在 - 使用更安全的方式处理查询
      const { data, error } = await supabase
        .from('user_profiles')
        .select('nickname')
        .eq('nickname', nickname)
        .maybeSingle() // 使用maybeSingle而不是single，避免找不到记录时抛出错误
      
      if (error) {
        // 如果是表不存在的错误，说明还没有创建用户资料表
        if (error.code === '42P01') { // 42P01表示表不存在
          console.warn('用户资料表不存在，跳过昵称检查')
          return { available: true, message: '昵称可用' }
        }
        throw error
      }
      
      if (data) {
        return { available: false, message: '该昵称已被使用' }
      }
      
      return { available: true, message: '昵称可用' }
    } catch (error) {
      console.error('检查昵称时发生错误:', error)
      // 如果发生错误，暂时允许使用该昵称，避免阻塞用户注册
      return { available: true, message: '昵称检查暂时不可用，您可以继续使用该昵称' }
    }
  }

  // 用户注册
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    // 验证输入数据
    if (!userData.email || !userData.nickname || !userData.password) {
      throw new Error('请填写所有必填字段')
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userData.email)) {
      throw new Error('请输入有效的邮箱地址')
    }
    
    // 验证密码强度
    if (userData.password.length < 8) {
      throw new Error('密码长度至少需要8位')
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/
    if (!passwordRegex.test(userData.password)) {
      throw new Error('密码必须包含字母和数字')
    }
    
    // 验证密码确认
    if (userData.password !== userData.confirmPassword) {
      throw new Error('两次输入的密码不一致')
    }
    
    try {
      // 1. 使用Supabase Auth注册用户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })
      
      if (authError) {
        throw new Error(this.getAuthErrorMessage(authError))
      }
      
      if (!authData.user) {
        throw new Error('注册失败，请稍后重试')
      }
      
      // 2. 尝试创建用户资料记录
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            email: userData.email,
            nickname: userData.nickname,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as any) // 使用类型断言避免TypeScript错误
        
        if (profileError) {
          // 如果是表不存在的错误，继续注册流程（资料表可选）
          if (profileError.code === '42P01') {
            console.warn('用户资料表不存在，跳过资料创建')
            // 返回基本用户信息
            return {
              user: {
                id: authData.user.id,
                email: userData.email,
                nickname: userData.nickname,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              session: authData.session
            }
          }
          throw profileError
        }
      } catch (error) {
        console.error('创建用户资料时发生错误:', error)
        // 如果创建资料失败，但用户已注册成功，继续流程
        if (authData.user) {
          return {
            user: {
              id: authData.user.id,
              email: userData.email,
              nickname: userData.nickname,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            session: authData.session
          }
        }
        throw error
      }
      
      // 3. 获取完整的用户信息
      const userProfile = await this.getUserProfile(authData.user.id)
      
      return {
        user: userProfile,
        session: authData.session
      }
    } catch (error: any) {
      throw new Error(error.message || '注册失败，请稍后重试')
    }
  }

  // 用户登录
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    // 验证输入数据
    if (!loginData.email || !loginData.password) {
      throw new Error('请填写邮箱和密码')
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })
      
      if (error) {
        throw new Error(this.getAuthErrorMessage(error))
      }
      
      if (!data.user) {
        throw new Error('登录失败，请稍后重试')
      }
      
      // 获取用户资料
      const userProfile = await this.getUserProfile(data.user.id)
      
      return {
        user: userProfile,
        session: data.session
      }
    } catch (error: any) {
      throw new Error(error.message || '登录失败，请稍后重试')
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }
      
      return await this.getUserProfile(user.id)
    } catch (error) {
      console.error('获取当前用户信息失败:', error)
      return null
    }
  }

  // 退出登录
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('退出登录失败:', error)
      throw new Error('退出登录失败')
    }
  }

  // 获取用户资料
  private async getUserProfile(userId: string): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        // 如果是表不存在的错误，返回基本用户信息
        if (error.code === '42P01') {
          console.warn('用户资料表不存在，返回基本用户信息')
          // 获取当前会话用户信息
          const { data: { user } } = await supabase.auth.getUser()
          if (user && user.id === userId) {
            return {
              id: user.id,
              email: user.email || '',
              nickname: user.email?.split('@')[0] || '用户',
              created_at: user.created_at || new Date().toISOString(),
              updated_at: user.updated_at || new Date().toISOString()
            }
          }
        }
        throw error
      }
      
      if (!data) {
        throw new Error('用户资料不存在')
      }
      
      return data as User
    } catch (error) {
      console.error('获取用户资料失败:', error)
      // 如果无法获取资料，返回基本用户信息
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.id === userId) {
        return {
          id: user.id,
          email: user.email || '',
          nickname: user.email?.split('@')[0] || '用户',
          created_at: user.created_at || new Date().toISOString(),
          updated_at: user.updated_at || new Date().toISOString()
        }
      }
      throw new Error('无法获取用户信息')
    }
  }

  // 获取认证错误消息
  private getAuthErrorMessage(error: any): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return '邮箱或密码错误'
      case 'Email not confirmed':
        return '邮箱未验证，请先验证您的邮箱'
      case 'User already registered':
        return '该邮箱已被注册'
      case 'Weak password':
        return '密码强度不足，请使用更强的密码'
      case 'Invalid email':
        return '请输入有效的邮箱地址'
      default:
        return error.message || '认证失败，请稍后重试'
    }
  }
}

export default new AuthService()