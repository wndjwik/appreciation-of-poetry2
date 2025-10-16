import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { AuthorFilters, AuthorStats } from '../types/database'
import PoemService from '../services/poemService'

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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  max-width: 800px;
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

const AuthorsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const AuthorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
`

const AuthorCard = styled(Link)`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const AuthorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const AuthorAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  color: white;
  font-weight: ${props => props.theme.typography.fontWeight.bold};
`

const AuthorInfo = styled.div`
  flex: 1;
`

const AuthorName = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const AuthorDynasty = styled.span`
  background: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`

const AuthorIntroduction = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
  font-size: ${props => props.theme.typography.fontSize.sm};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const AuthorStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`

const PoemCount = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const ViewButton = styled.span`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
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

const Authors: React.FC = () => {
  const [filters, setFilters] = useState<AuthorFilters>({
    page: 1,
    pageSize: 12,
    sortBy: 'name'
  })
  const [authorStats, setAuthorStats] = useState<AuthorStats>({
    dynasty: {},
    total: 0
  })
  const [authors, setAuthors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  // 获取诗人统计信息
  useEffect(() => {
    const fetchAuthorStats = async () => {
      try {
        const stats = await PoemService.getAuthorStats()
        setAuthorStats(stats)
      } catch (err) {
        console.error('获取诗人统计失败:', err)
      }
    }
    fetchAuthorStats()
  }, [])

  // 获取诗人数据
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await PoemService.getAuthors(filters)
        setAuthors(response.authors)
        setTotalPages(response.totalPages)
        
      } catch (err) {
        setError('获取诗人列表失败，请稍后重试')
        console.error('Error fetching authors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [filters])

  // 处理筛选变化
  const handleFilterChange = (key: keyof AuthorFilters, value: any) => {
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
      sortBy: 'name'
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
      value !== 'name' // 排除默认排序
    )

  // 获取姓氏首字母
  const getFirstCharacter = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>诗人介绍</PageTitle>
        <PageSubtitle>
          探索历代诗人的生平事迹、创作风格和代表作品，了解中华文化的璀璨瑰宝
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
              {Object.keys(authorStats.dynasty).map(dynasty => (
                <option key={dynasty} value={dynasty}>
                  {dynasty} ({authorStats.dynasty[dynasty]})
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
              <option value="name">按姓名</option>
              <option value="dynasty">按朝代</option>
              <option value="popular">按热度</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>搜索诗人</FilterLabel>
            <SearchInput
              type="text"
              placeholder="输入诗人姓名..."
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

      <AuthorsSection>
        {loading ? (
          <LoadingContainer>加载中...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>{error}</ErrorContainer>
        ) : authors.length > 0 ? (
          <>
            <AuthorsGrid>
              {authors.map(author => (
                <AuthorCard key={author.id} to={`/author/${author.id}`} state={{ from: window.location.pathname }}>
                  <AuthorHeader>
                    <AuthorAvatar>
                      {getFirstCharacter(author.name)}
                    </AuthorAvatar>
                    <AuthorInfo>
                      <AuthorName>{author.name}</AuthorName>
                      <AuthorDynasty>{author.dynasty}</AuthorDynasty>
                    </AuthorInfo>
                  </AuthorHeader>
                  
                  <AuthorIntroduction>
                    {author.introduction || '暂无诗人介绍'}
                  </AuthorIntroduction>
                  
                  <AuthorStatsContainer>
                    <PoemCount>作品数量: {author.poemCount || 0}</PoemCount>
                    <ViewButton>查看详情 →</ViewButton>
                  </AuthorStatsContainer>
                </AuthorCard>
              ))}
            </AuthorsGrid>

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
          <EmptyContainer>暂无符合条件的诗人</EmptyContainer>
        )}
      </AuthorsSection>
    </PageContainer>
  )
}

export default Authors