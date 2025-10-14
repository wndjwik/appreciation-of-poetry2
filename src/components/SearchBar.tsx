import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.md};
  display: flex;
  justify-content: center;
`

const SearchForm = styled.form`
  display: flex;
  width: 100%;
  max-width: 600px;
  gap: ${props => props.theme.spacing.sm};
`

const SearchInput = styled.input`
  flex: 1;
  padding: ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.lg};
  background: white;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(44, 62, 80, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme.colors.text.light};
  }
`

const SearchButton = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.colors.secondary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

interface SearchBarProps {
  onClose?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      onClose?.()
    }
  }

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="搜索诗词、作者或诗句..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton type="submit">
          搜索
        </SearchButton>
      </SearchForm>
    </SearchContainer>
  )
}

export default SearchBar