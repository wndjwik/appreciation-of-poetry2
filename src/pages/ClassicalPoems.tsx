import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ClassicalPoemFilters, CategoryStats } from '../types/database'
import PoemService from '../services/poemService'
import PoemCard from '../components/PoemCard'

const PageContainer = styled.div`
  min-height: calc(100vh - 120px);
  padding: ${props => props.theme.spacing.xl} 0;
  background: ${props => props.theme.colors.background};
`

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  padding: 0 ${props => props.theme.spacing.md};
`

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const PageSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`

const FilterSection = styled.section`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  margin: 0 ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
`

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  max-width: 1000px;
  margin: 0 auto;
`

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const FilterLabel = styled.label`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const FilterSelect = styled.select`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`

const SearchInput = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.lg};
  padding-top: ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border};
`

const FilterTag = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`

const ClearFiltersButton = styled.button`
  background: ${props => props.theme.colors.error};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.error}dd;
  }
`

const PoemsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const PoemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.xl};
`

const PageButton = styled.button<{ $active?: boolean }>`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.background};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const LoadingContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.text.secondary};
`

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.error};
`

const EmptyContainer = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.text.secondary};
`

const ClassicalPoems: React.FC = () => {
  const [filters, setFilters] = useState<ClassicalPoemFilters>({
    page: 1,
    pageSize: 12,
    sortBy: 'popular'
  })
  const [categoryStats, setCategoryStats] = useState<CategoryStats>({
    dynasty: {},
    genre: {},
    total: 0
  })
  const [poems, setPoems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  // 获取分类统计信息
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const stats = await PoemService.getCategoryStats()
        setCategoryStats(stats)
      } catch (err) {
        console.error('获取分类统计失败:', err)
      }
    }
    fetchCategoryStats()
  }, [])

  // 获取诗词数据
  useEffect(() => {
    const fetchPoems = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await PoemService.getClassicalPoems(filters)
        setPoems(response.poems)
        setTotalPages(response.totalPages)
        
      } catch (err) {
        setError('获取经典诗词失败，请稍后重试')
        console.error('Error fetching classical poems:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPoems()
  }, [filters])

  // 处理筛选变化
  const handleFilterChange = (key: keyof ClassicalPoemFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // 重置到第一页
    }))
  }

  // 清除所有筛选
  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 12,
      sortBy: 'popular'
    })
  }

  // 分页处理
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 获取活跃的筛选条件
  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => 
      value !== undefined && 
      value !== '' && 
      !['page', 'pageSize'].includes(key) &&
      value !== 'popular' // 排除默认排序
    )

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>经典诗词鉴赏</PageTitle>
        <PageSubtitle>
          探索中华诗词的千年瑰宝，从唐诗宋词到元曲明清诗，感受传统文化的魅力
        </PageSubtitle>
      </PageHeader>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>朝代筛选</FilterLabel>
            <FilterSelect
              value={filters.dynasty || ''}
              onChange={(e) => handleFilterChange('dynasty', e.target.value || undefined)}
            >
              <option value="">全部朝代</option>
              {Object.keys(categoryStats.dynasty).map(dynasty => (
                <option key={dynasty} value={dynasty}>
                  {dynasty} ({categoryStats.dynasty[dynasty]})
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>流派分类</FilterLabel>
            <FilterSelect
              value={filters.genre || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value || undefined)}
            >
              <option value="">全部流派</option>
              {Object.keys(categoryStats.genre).map(genre => (
                <option key={genre} value={genre}>
                  {genre} ({categoryStats.genre[genre]})
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>排序方式</FilterLabel>
            <FilterSelect
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="popular">按热度</option>
              <option value="time">按时间</option>
              <option value="length">按长度</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>搜索诗词</FilterLabel>
            <SearchInput
              type="text"
              placeholder="输入诗词标题或内容..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value || undefined)}
            />
          </FilterGroup>
        </FilterGrid>

        {activeFilters.length > 0 && (
          <ActiveFilters>
            <span>当前筛选：</span>
            {activeFilters.map(([key, value]) => (
              <FilterTag key={key}>
                {key === 'dynasty' ? '朝代' : 
                 key === 'genre' ? '流派' : 
                 key === 'sortBy' ? '排序' : 
                 key === 'search' ? '搜索' : key}: {value}
              </FilterTag>
            ))}
            <ClearFiltersButton onClick={handleClearFilters}>
              清除筛选
            </ClearFiltersButton>
          </ActiveFilters>
        )}
      </FilterSection>

      <PoemsSection>
        {loading ? (
          <LoadingContainer>加载中...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>{error}</ErrorContainer>
        ) : poems.length > 0 ? (
          <>
            <PoemsGrid>
              {poems.map(poem => (
                <PoemCard 
                  key={poem.id} 
                  poem={{
                    id: poem.id,
                    title: poem.title,
                    author: poem.authors?.name || '未知作者',
                    dynasty: poem.dynasty,
                    content: poem.content
                  }} 
                />
              ))}
            </PoemsGrid>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  disabled={filters.page === 1}
                  onClick={() => handlePageChange(filters.page! - 1)}
                >
                  上一页
                </PageButton>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <PageButton
                      key={pageNum}
                      $active={filters.page === pageNum}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </PageButton>
                  )
                })}

                <PageButton
                  disabled={filters.page === totalPages}
                  onClick={() => handlePageChange(filters.page! + 1)}
                >
                  下一页
                </PageButton>
              </Pagination>
            )}
          </>
        ) : (
          <EmptyContainer>暂无符合条件的诗词</EmptyContainer>
        )}
      </PoemsSection>
    </PageContainer>
  )
}

export default ClassicalPoems