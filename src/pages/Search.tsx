import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../components/SearchBar'
import PoemCard from '../components/PoemCard'
import PoemService from '../services/poemService'

const SearchContainer = styled.div`
  min-height: calc(100vh - 120px);
  padding: ${props => props.theme.spacing['2xl']} 0;
  background: ${props => props.theme.colors.background};
`

const SearchHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto ${props => props.theme.spacing['2xl']};
  padding: 0 ${props => props.theme.spacing.md};
`

const SearchTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  text-align: center;
`

const ResultsInfo = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FiltersContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: white;
  font-size: ${props => props.theme.typography.fontSize.base};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const PoemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const NoResults = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.xl};
`

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.text.secondary};
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['3xl']};
  color: ${props => props.theme.colors.error};
`

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dynastyFilter, setDynastyFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      performSearch(query, dynastyFilter, typeFilter)
    } else {
      setSearchResults([])
    }
  }, [query, dynastyFilter, typeFilter])

  const performSearch = async (searchTerm: string, dynasty: string, type: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await PoemService.searchPoems({
        query: searchTerm,
        dynasty: dynasty || undefined,
        type: type || undefined,
        page: 1,
        limit: 50
      })
      
      setSearchResults(response.poems)
      
    } catch (err) {
      setError('搜索失败，请稍后重试')
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDynastyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDynastyFilter(e.target.value)
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value)
  }

  if (error) {
    return (
      <SearchContainer>
        <ErrorContainer>{error}</ErrorContainer>
      </SearchContainer>
    )
  }

  return (
    <SearchContainer>
      <SearchHeader>
        <SearchTitle>诗词搜索</SearchTitle>
        <SearchBar />
        {query && (
          <ResultsInfo>
            搜索 "{query}" 的结果 ({searchResults.length} 首)
          </ResultsInfo>
        )}
        
        <FiltersContainer>
          <FilterSelect value={dynastyFilter} onChange={handleDynastyChange}>
            <option value="">所有朝代</option>
            <option value="唐">唐代</option>
            <option value="宋">宋代</option>
            <option value="元">元代</option>
            <option value="明">明代</option>
            <option value="清">清代</option>
            <option value="先秦">先秦</option>
            <option value="汉">汉代</option>
            <option value="魏晋">魏晋</option>
            <option value="南北朝">南北朝</option>
            <option value="隋">隋代</option>
            <option value="五代">五代</option>
            <option value="辽">辽代</option>
            <option value="金">金代</option>
            <option value="近代">近代</option>
          </FilterSelect>
          <FilterSelect value={typeFilter} onChange={handleTypeChange}>
            <option value="">所有类型</option>
            <option value="诗">诗</option>
            <option value="词">词</option>
            <option value="曲">曲</option>
            <option value="赋">赋</option>
            <option value="乐府">乐府</option>
          </FilterSelect>
        </FiltersContainer>
      </SearchHeader>

      {isLoading ? (
        <LoadingContainer>搜索中...</LoadingContainer>
      ) : searchResults.length > 0 ? (
        <PoemsGrid>
          {searchResults.map(poem => (
            <PoemCard 
              key={poem.id} 
              poem={{
                id: poem.id,
                title: poem.title,
                author: poem.author_name,
                dynasty: poem.dynasty,
                content: poem.content
              }} 
            />
          ))}
        </PoemsGrid>
      ) : query ? (
        <NoResults>未找到与 "{query}" 相关的诗词</NoResults>
      ) : (
        <NoResults>请输入关键词开始搜索</NoResults>
      )}
    </SearchContainer>
  )
}

export default Search