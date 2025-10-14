import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

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

const PasswordStrength = styled.div`
  margin-top: ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`

const Register: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 注册逻辑将在后续实现
  }

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>用户注册</RegisterTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">邮箱地址</Label>
            <Input
              type="email"
              id="email"
              placeholder="请输入您的邮箱"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">密码</Label>
            <Input
              type="password"
              id="password"
              placeholder="请设置您的密码"
              required
            />
            <PasswordStrength>密码长度至少8位，包含字母和数字</PasswordStrength>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirmPassword">确认密码</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="请再次输入密码"
              required
            />
          </FormGroup>
          <RegisterButton type="submit">注册</RegisterButton>
        </form>
        <LoginLink>
          已有账号？ <Link to="/login">立即登录</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  )
}

export default Register