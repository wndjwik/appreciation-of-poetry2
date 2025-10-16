import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.div`
  background: white;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.theme.spacing.xl};
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`

const PoemTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`

const PoemAuthor = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`

const PoemContent = styled.div`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.8;
  margin-bottom: ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.lg};
`

const ReadMoreLink = styled(Link)`
  color: ${props => props.theme.colors.accent};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`

interface Poem {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
}

interface PoemCardProps {
  poem: Poem
}

const PoemCard: React.FC<PoemCardProps> = ({ poem }) => {
  return (
    <Card>
      <PoemTitle>{poem.title}</PoemTitle>
      <PoemAuthor>{poem.author} · {poem.dynasty}</PoemAuthor>
      <PoemContent>{poem.content}</PoemContent>
      <ReadMoreLink to={`/poem/${poem.id}`} state={{ from: window.location.pathname }}>
        查看详情 →
      </ReadMoreLink>
    </Card>
  )
}

export default PoemCard