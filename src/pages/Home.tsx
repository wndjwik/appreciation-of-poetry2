import React from 'react'
import styled from 'styled-components'
import SearchBar from '../components/SearchBar'
import PoemCard from '../components/PoemCard'

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

const Home: React.FC = () => {
  const featuredPoems = [
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
  ]

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
        <PoemsGrid>
          {featuredPoems.map(poem => (
            <PoemCard key={poem.id} poem={poem} />
          ))}
        </PoemsGrid>
      </PoemsSection>
    </HomeContainer>
  )
}

export default Home