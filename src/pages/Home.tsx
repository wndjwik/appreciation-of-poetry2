import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import SearchBar from '../components/SearchBar'
import PoemCard from '../components/PoemCard'
import PoemService from '../services/poemService'

const HomeContainer = styled.div`
  min-height: calc(100vh - 120px);
`

const HeroSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: ${props => props.theme.spacing['3xl']} 0;
  text-align: center;
`

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const HeroTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['5xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.2;
`

const HeroSubtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.xl};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  opacity: 0.9;
  line-height: 1.6;
`

const FeaturesSection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: ${props => props.theme.colors.background};
`

const SectionTitle = styled.h2`
  text-align: center;
  font-size: ${props => props.theme.typography.fontSize['4xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  margin-bottom: ${props => props.theme.spacing['2xl']};
  color: ${props => props.theme.colors.primary};
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
`

const FeatureCard = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const FeatureTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.primary};
`

const FeatureDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
`

const PoemsSection = styled.section`
  padding: ${props => props.theme.spacing['3xl']} 0;
  background: white;
`

const PoemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
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

const Home: React.FC = () => {
  const [featuredPoems, setFeaturedPoems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedPoems = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const poems = await PoemService.getPopularPoems(6) // 获取6首热门诗词
        setFeaturedPoems(poems)
        
      } catch (err) {
        setError('获取推荐诗词失败，请稍后重试')
        console.error('Error fetching featured poems:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedPoems()
  }, [])

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>品味中华诗词之美</HeroTitle>
          <HeroSubtitle>
            探索千年文化瑰宝，感受诗词韵律之美。从唐诗宋词到元曲明清诗，
            我们为您提供最全面的诗词鉴赏平台。
          </HeroSubtitle>
          <SearchBar />
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>平台特色</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>海量诗词库</FeatureTitle>
            <FeatureDescription>
              收录从先秦到近代的经典诗词作品，涵盖各个朝代和流派，
              满足不同层次的诗词爱好者需求。
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureTitle>智能搜索</FeatureTitle>
            <FeatureDescription>
              支持按标题、作者、诗句内容等多种方式搜索，
              快速找到您想了解的诗词作品。
            </FeatureDescription>
          </FeatureCard>
          <FeatureCard>
            <FeatureIcon>📖</FeatureIcon>
            <FeatureTitle>深度赏析</FeatureTitle>
            <FeatureDescription>
              每首诗词都配有专业的注释、翻译和赏析，
              帮助您更好地理解诗词的意境和内涵。
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <PoemsSection>
        <SectionTitle>经典诗词推荐</SectionTitle>
        
        {loading ? (
          <LoadingContainer>加载中...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>{error}</ErrorContainer>
        ) : featuredPoems.length > 0 ? (
          <PoemsGrid>
            {featuredPoems.map(poem => (
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
        ) : (
          <LoadingContainer>暂无推荐诗词</LoadingContainer>
        )}
      </PoemsSection>
    </HomeContainer>
  )
}

export default Home