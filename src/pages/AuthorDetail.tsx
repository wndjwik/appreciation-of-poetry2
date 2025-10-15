import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import PoemService from '../services/poemService'

const DetailContainer = styled.div`
  min-height: calc(100vh - 120px);
  padding: ${props => props.theme.spacing['2xl']} 0;
  background: ${props => props.theme.colors.background};
`

const AuthorDetailCard = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
`

const AuthorHeader = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
`

const AuthorName = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`

const AuthorDynasty = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const AuthorLifespan = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  opacity: 0.8;
`

const AuthorContent = styled.div`
  padding: ${props => props.theme.spacing['2xl']};
`

const IntroductionSection = styled.section`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.primary};
`

const IntroductionText = styled.p`
  line-height: 1.8;
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.text.secondary};
`

const PoemsSection = styled.section`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`

const PoemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-top: ${props => props.theme.spacing.lg};
`

const PoemCard = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`

const PoemTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
`

const PoemExcerpt = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  margin-top: ${props => props.theme.spacing.xl};

  &:hover {
    text-decoration: underline;
  }
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

const AuthorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [author, setAuthor] = useState<any>(null)
  const [poems, setPoems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        
        // 获取诗人信息
        const authorData = await PoemService.getAuthorById(id)
        setAuthor(authorData)
        
        // 获取诗人的诗词作品
        const poemsData = await PoemService.getPoemsByAuthor(id)
        setPoems(poemsData)
        
      } catch (err) {
        setError('获取诗人信息失败，请稍后重试')
        console.error('Error fetching author data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuthorData()
  }, [id])

  if (loading) {
    return (
      <DetailContainer>
        <LoadingContainer>加载中...</LoadingContainer>
      </DetailContainer>
    )
  }

  if (error) {
    return (
      <DetailContainer>
        <ErrorContainer>{error}</ErrorContainer>
      </DetailContainer>
    )
  }

  if (!author) {
    return (
      <DetailContainer>
        <ErrorContainer>未找到该诗人信息</ErrorContainer>
      </DetailContainer>
    )
  }

  return (
    <DetailContainer>
      <AuthorDetailCard>
        <AuthorHeader>
          <AuthorName>{author.name}</AuthorName>
          <AuthorDynasty>{author.dynasty}</AuthorDynasty>
          {author.birth_year && author.death_year && (
            <AuthorLifespan>
              {author.birth_year} - {author.death_year}
            </AuthorLifespan>
          )}
        </AuthorHeader>
        
        <AuthorContent>
          <IntroductionSection>
            <SectionTitle>诗人介绍</SectionTitle>
            <IntroductionText>
              {author.introduction || '暂无详细介绍'}
            </IntroductionText>
          </IntroductionSection>
          
          <PoemsSection>
            <SectionTitle>代表作品 ({poems.length} 首)</SectionTitle>
            {poems.length > 0 ? (
              <PoemsGrid>
                {poems.map(poem => (
                  <Link 
                    key={poem.id} 
                    to={`/poem/${poem.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <PoemCard>
                      <PoemTitle>{poem.title}</PoemTitle>
                      <PoemExcerpt>
                        {poem.content.split('\n')[0].substring(0, 50)}...
                      </PoemExcerpt>
                    </PoemCard>
                  </Link>
                ))}
              </PoemsGrid>
            ) : (
              <IntroductionText>暂无作品信息</IntroductionText>
            )}
          </PoemsSection>
          
          <BackLink to="/search">
            ← 返回搜索页面
          </BackLink>
        </AuthorContent>
      </AuthorDetailCard>
    </DetailContainer>
  )
}

export default AuthorDetail