import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'

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

const PoemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'annotation' | 'translation' | 'appreciation'>('annotation')
  const [poem, setPoem] = useState<any>(null)

  useEffect(() => {
    // 模拟获取诗词详情
    const mockPoem = {
      id: parseInt(id || '1'),
      title: '静夜思',
      author: '李白',
      dynasty: '唐代',
      content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      annotation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。',
      translation: 'Bright moonlight before my bed,\nI suspect it is frost on the ground.\nI raise my head to view the bright moon,\nThen lower it, thinking of my hometown.',
      appreciation: '《静夜思》是唐代诗人李白所作的一首五言古诗。此诗描写了秋日夜晚，旅居在外的诗人于屋内抬头望月而思念家乡的感受。'
    }
    setPoem(mockPoem)
  }, [id])

  if (!poem) {
    return <div>加载中...</div>
  }

  return (
    <DetailContainer>
      <PoemDetailCard>
        <PoemHeader>
          <PoemTitle>{poem.title}</PoemTitle>
          <PoemAuthor>{poem.author}</PoemAuthor>
          <PoemDynasty>{poem.dynasty}</PoemDynasty>
        </PoemHeader>
        
        <PoemContent>
          <PoemText>{poem.content}</PoemText>
          
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
            {activeTab === 'annotation' && poem.annotation}
            {activeTab === 'translation' && poem.translation}
            {activeTab === 'appreciation' && poem.appreciation}
          </TabContent>
          
          <BackLink to="/search">
            ← 返回搜索结果
          </BackLink>
        </PoemContent>
      </PoemDetailCard>
    </DetailContainer>
  )
}

export default PoemDetail