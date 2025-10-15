import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import PoemService from '../services/poemService'

const DetailContainer = styled.div`
  min-height: calc(100vh - 120px);
  padding: ${props => props.theme.spacing['2xl']} 0;
  background: ${props => props.theme.colors.background};
`

const PoemDetailCard = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
`

const PoemHeader = styled.div`
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: ${props => props.theme.spacing['2xl']};
  text-align: center;
`

const PoemTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.md};
`

const PoemAuthor = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl};
  opacity: 0.9;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const AuthorLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  
  &:hover {
    text-decoration: underline;
  }
`

const PoemDynasty = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  opacity: 0.8;
`

const PoemContent = styled.div`
  padding: ${props => props.theme.spacing['2xl']};
`

const PoemText = styled.div`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  line-height: 2;
  text-align: center;
  margin-bottom: ${props => props.theme.spacing['2xl']};
  white-space: pre-line;
`

const TabsContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Tab = styled.button<{ active: boolean }>`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

const TabContent = styled.div`
  line-height: 1.8;
  font-size: ${props => props.theme.typography.fontSize.lg};
  min-height: 100px;
`

const AuthorSection = styled.div`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  border: 1px solid ${props => props.theme.colors.border};
`

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
`

const AuthorInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.lg};
`

const AuthorText = styled.p`
  flex: 1;
  line-height: 1.6;
  color: ${props => props.theme.colors.text.secondary};
`

const ViewAuthorButton = styled(Link)`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
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

const PoemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'annotation' | 'translation' | 'appreciation'>('appreciation')
  const [poem, setPoem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoemData = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        
        const poemData = await PoemService.getPoemById(id)
        if (poemData) {
          setPoem(poemData)
        } else {
          setError('未找到该诗词信息')
        }
        
      } catch (err) {
        setError('获取诗词详情失败，请稍后重试')
        console.error('Error fetching poem data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPoemData()
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

  if (!poem) {
    return (
      <DetailContainer>
        <ErrorContainer>未找到该诗词信息</ErrorContainer>
      </DetailContainer>
    )
  }

  return (
    <DetailContainer>
      <PoemDetailCard>
        <PoemHeader>
          <PoemTitle>{poem.title}</PoemTitle>
          <PoemAuthor>
            作者: <AuthorLink to={`/author/${poem.author_id}`}>{poem.authors?.name}</AuthorLink>
          </PoemAuthor>
          <PoemDynasty>{poem.dynasty} • {poem.type}</PoemDynasty>
        </PoemHeader>
        
        <PoemContent>
          <PoemText>{poem.content}</PoemText>
          
          <AuthorSection>
            <SectionTitle>诗人简介</SectionTitle>
            <AuthorInfo>
              <AuthorText>
                {poem.authors?.introduction || '暂无详细介绍'}
              </AuthorText>
              <ViewAuthorButton to={`/author/${poem.author_id}`}>
                查看诗人详情
              </ViewAuthorButton>
            </AuthorInfo>
          </AuthorSection>
          
          <TabsContainer>
            <Tab 
              active={activeTab === 'annotation'} 
              onClick={() => setActiveTab('annotation')}
            >
              注释
            </Tab>
            <Tab 
              active={activeTab === 'translation'} 
              onClick={() => setActiveTab('translation')}
            >
              翻译
            </Tab>
            <Tab 
              active={activeTab === 'appreciation'} 
              onClick={() => setActiveTab('appreciation')}
            >
              赏析
            </Tab>
          </TabsContainer>
          
          <TabContent>
            {activeTab === 'annotation' && (
              <div>
                <p>注释功能正在开发中...</p>
                <p style={{ color: '#666', fontSize: '0.9em', marginTop: '10px' }}>
                  我们正在努力为您提供更详细的注释内容。
                </p>
              </div>
            )}
            {activeTab === 'translation' && (
              <div>
                <p>翻译功能正在开发中...</p>
                <p style={{ color: '#666', fontSize: '0.9em', marginTop: '10px' }}>
                  我们正在努力为您提供准确的翻译内容。
                </p>
              </div>
            )}
            {activeTab === 'appreciation' && (
              <div>
                {poem.appreciations && poem.appreciations.length > 0 ? (
                  poem.appreciations.map((appreciation: any) => (
                    <div key={appreciation.id} style={{ marginBottom: '20px' }}>
                      <p>{appreciation.content}</p>
                      {appreciation.source && (
                        <p style={{ color: '#666', fontSize: '0.9em', marginTop: '10px' }}>
                          来源: {appreciation.source}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p>暂无赏析内容</p>
                )}
              </div>
            )}
          </TabContent>
          
          <BackLink to="/search">
            ← 返回搜索页面
          </BackLink>
        </PoemContent>
      </PoemDetailCard>
    </DetailContainer>
  )
}

export default PoemDetail