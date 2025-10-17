import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthResponse } from '../types/database'
import AuthService from '../services/authService'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (email: string, nickname: string, password: string, confirmPassword: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 检查当前认证状态
  const checkAuth = async () => {
    try {
      setLoading(true)
      const currentUser = await AuthService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('检查认证状态失败:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // 用户登录
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await AuthService.login({ email, password })
      setUser(response.user)
      return response
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 用户注册
  const register = async (email: string, nickname: string, password: string, confirmPassword: string) => {
    try {
      setLoading(true)
      const response = await AuthService.register({ 
        email, 
        nickname, 
        password, 
        confirmPassword 
      })
      setUser(response.user)
      return response
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 用户退出
  const logout = async () => {
    try {
      setLoading(true)
      await AuthService.logout()
      setUser(null)
    } catch (error) {
      console.error('退出登录失败:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 组件挂载时检查认证状态
  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定义Hook使用AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用')
  }
  return context
}