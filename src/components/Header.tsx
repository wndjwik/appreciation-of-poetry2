import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../hooks/useAuth'
import SearchBar from './SearchBar'

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: ${props => props.theme.spacing.md} 0;
  box-shadow: ${props => props.theme.shadows.md};
  position: sticky;
  top: 0;
  z-index: 1000;
`

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`

const Logo = styled(Link)`
  font-size: ${props => props.theme.typography.fontSize['3xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};

  &:hover {
    color: #ecf0f1;
  }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: ${props => props.theme.spacing.md};
  }
`

const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${props => props.$active ? '#ecf0f1' : 'white'};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? 'rgba(255,255,255,0.1)' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255,255,255,0.1);
    transform: translateY(-1px);
  }
`

const AuthButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`

const Button = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &.login {
    background: transparent;
    color: white;
    border: 2px solid white;

    &:hover {
      background: white;
      color: #2c3e50;
    }
  }

  &.register {
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
      transform: translateY(-1px);
    }
  }
`

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: white;
  font-weight: bold;
`

const LogoutButton = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  background: transparent;
  color: white;
  border: 2px solid white;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    color: #2c3e50;
    transform: translateY(-1px);
  }
`

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, loading, logout } = useAuth()
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  // 获取用户昵称的首字符作为头像
  const getAvatarText = (nickname: string) => {
    return nickname.charAt(0).toUpperCase()
  }

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          📚 诗词鉴赏
        </Logo>
        
        <NavLinks>
          <NavLink to="/" $active={location.pathname === '/'}>
            首页
          </NavLink>
          <NavLink to="/search" $active={location.pathname === '/search'}>
            诗词搜索
          </NavLink>
          <NavLink to="/classical-poems" $active={location.pathname === '/classical-poems'}>
            经典诗词
          </NavLink>
          <NavLink to="/authors" $active={location.pathname === '/authors'}>
            诗人介绍
          </NavLink>
        </NavLinks>

        {!loading && (
          <UserMenu>
            {user ? (
              <UserInfo>
                <UserAvatar>
                  {getAvatarText(user.nickname)}
                </UserAvatar>
                <span>{user.nickname}</span>
                <LogoutButton onClick={handleLogout}>
                  退出
                </LogoutButton>
              </UserInfo>
            ) : (
              <AuthButtons>
                <Button to="/login" className="login">
                  登录
                </Button>
                <Button to="/register" className="register">
                  注册
                </Button>
              </AuthButtons>
            )}
          </UserMenu>
        )}
      </Nav>

      {isSearchVisible && (
        <SearchBar onClose={() => setIsSearchVisible(false)} />
      )}
    </HeaderContainer>
  )
}

export default Header