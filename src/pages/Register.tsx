import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'
import AuthService from '../services/authService'

const RegisterContainer = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: ${props => props.theme.spacing['2xl']} 0;
`

const RegisterCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing['2xl']};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  width: 100%;
  max-width: 450px;
`

const RegisterTitle = styled.h2`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FormGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Label = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
`

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
  }
`

const RegisterButton = styled.button`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: ${props => props.theme.spacing.lg};

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-1px);
  }
`

const LoginLink = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};

  a {
    color: ${props => props.theme.colors.primary};
    font-weight: ${props => props.theme.typography.fontWeight.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`

const PasswordStrength = styled.div<{ $strength: 'weak' | 'medium' | 'strong' }>`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => {
    switch (props.$strength) {
      case 'weak': return props.theme.colors.error
      case 'medium': return props.theme.colors.warning
      case 'strong': return props.theme.colors.success
      default: return props.theme.colors.text.secondary
    }
  }};
`

const NicknameStatus = styled.div<{ $status: 'checking' | 'available' | 'unavailable' }>`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => {
    switch (props.$status) {
      case 'checking': return props.theme.colors.text.secondary
      case 'available': return props.theme.colors.success
      case 'unavailable': return props.theme.colors.error
      default: return props.theme.colors.text.secondary
    }
  }};
`

const ErrorMessage = styled.div`
  background: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.success}20;
  color: ${props => props.theme.colors.success};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, loading: authLoading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: ''
  })
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const [nicknameMessage, setNicknameMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 检查昵称可用性（防抖）
  useEffect(() => {
    const checkNickname = async () => {
      if (!formData.nickname || formData.nickname.length < 2) {
        setNicknameStatus('idle')
        setNicknameMessage('')
        return
      }

      setNicknameStatus('checking')
      setNicknameMessage('检查昵称可用性...')

      try {
        const result = await AuthService.checkNicknameAvailability(formData.nickname)
        setNicknameStatus(result.available ? 'available' : 'unavailable')
        setNicknameMessage(result.message)
      } catch (err) {
        setNicknameStatus('unavailable')
        setNicknameMessage('检查昵称时发生错误')
      }
    }

    const timeoutId = setTimeout(checkNickname, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.nickname])

  // 计算密码强度
  useEffect(() => {
    const calculateStrength = () => {
      if (formData.password.length === 0) {
        setPasswordStrength('weak')
        return
      }

      let strength = 0
      if (formData.password.length >= 8) strength++
      if (/[A-Za-z]/.test(formData.password)) strength++
      if (/\d/.test(formData.password)) strength++
      if (/[^A-Za-z0-9]/.test(formData.password)) strength++

      if (strength <= 2) setPasswordStrength('weak')
      else if (strength === 3) setPasswordStrength('medium')
      else setPasswordStrength('strong')
    }

    calculateStrength()
  }, [formData.password])

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await register(formData.email, formData.nickname, formData.password, formData.confirmPassword)
      setSuccess('注册成功！正在跳转到首页...')
      
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return '密码强度：弱'
      case 'medium': return '密码强度：中等'
      case 'strong': return '密码强度：强'
      default: return '密码长度至少8位，包含字母和数字'
    }
  }

  const isFormValid = () => {
    return (
      formData.email &&
      formData.nickname &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      nicknameStatus === 'available' &&
      passwordStrength !== 'weak'
    )
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>用户注册</RegisterTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              type="email"
              id="email"
              placeholder="请输入您的邮箱"
              value={formData.email}
              onChange={handleInputChange('email')}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="nickname">昵称</Label>
            <Input
              type="text"
              id="nickname"
              placeholder="请设置您的昵称（2-20个字符）"
              value={formData.nickname}
              onChange={handleInputChange('nickname')}
              required
            />
            {nicknameStatus !== 'idle' && (
              <NicknameStatus $status={nicknameStatus === 'checking' ? 'checking' : nicknameStatus === 'available' ? 'available' : 'unavailable'}>
                {nicknameMessage}
              </NicknameStatus>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">密码</Label>
            <Input
              type="password"
              id="password"
              placeholder="请设置您的密码"
              value={formData.password}
              onChange={handleInputChange('password')}
              required
            />
            <PasswordStrength $strength={passwordStrength}>
              {getPasswordStrengthText()}
            </PasswordStrength>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="请再次输入密码"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              required
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <NicknameStatus $status="unavailable">
                两次输入的密码不一致
              </NicknameStatus>
            )}
          </FormGroup>

          <RegisterButton 
            type="submit" 
            disabled={!isFormValid() || isLoading || authLoading}
          >
            {isLoading || authLoading ? '注册中...' : '注册'}
          </RegisterButton>
        </form>
        <LoginLink>
          已有账号？ <Link to="/login">立即登录</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default Register