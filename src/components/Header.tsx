import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
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

const Header: React.FC = () => {
  const location = useLocation()
  const [isSearchVisible, setIsSearchVisible] = useState(false)

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
          <NavLink to="/#classical" $active={false}>
            经典诗词
          </NavLink>
          <NavLink to="/#authors" $active={false}>
            诗人介绍
          </NavLink>
        </NavLinks>

        <AuthButtons>
          <Button to="/login" className="login">
            登录
          </Button>
          <Button to="/register" className="register">
            注册
          </Button>
        </AuthButtons>
      </Nav>

      {isSearchVisible && (
        <SearchBar onClose={() => setIsSearchVisible(false)} />
      )}
    </HeaderContainer>
  )
}

export default Header