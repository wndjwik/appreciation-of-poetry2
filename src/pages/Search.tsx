import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import SearchBar from '../components/SearchBar'
import PoemCard from '../components/PoemCard'

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

const Search: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const query = searchParams.get('q') || ''

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setIsLoading(true)
    // 模拟搜索延迟
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: '静夜思',
          author: '李白',
          dynasty: '唐代',
          content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
        },
        {
          id: 2,
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐代',
          content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
        },
        {
          id: 3,
          title: '登鹳雀楼',
          author: '王之涣',
          dynasty: '唐代',
          content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。'
        }
      ].filter(poem => 
        poem.title.includes(searchTerm) ||
        poem.author.includes(searchTerm) ||
        poem.content.includes(searchTerm)
      )
      setSearchResults(mockResults)
      setIsLoading(false)
    }, 500)
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
          <FilterSelect>
            <option value="">所有朝代</option>
            <option value="唐代">唐代</option>
            <option value="宋代">宋代</option>
            <option value="元代">元代</option>
            <option value="明代">明代</option>
            <option value="清代">清代</option>
          </FilterSelect>
          <FilterSelect>
            <option value="">所有类型</option>
            <option value="诗">诗</option>
            <option value="词">词</option>
            <option value="曲">曲</option>
          </FilterSelect>
        </FiltersContainer>
      </SearchHeader>

      {isLoading ? (
        <NoResults>搜索中...</NoResults>
      ) : searchResults.length > 0 ? (
        <PoemsGrid>
          {searchResults.map(poem => (
            <PoemCard key={poem.id} poem={poem} />
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