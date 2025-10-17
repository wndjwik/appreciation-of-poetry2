import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ChatMessage } from '../types/chat'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

const Panel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-400px'};
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  transition: right 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100vw;
    right: ${props => props.isOpen ? '0' : '-100vw'};
  }
`

const Header = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    opacity: 0.8;
  }
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading
}) => {
  const panelRef = useRef<HTMLDivElement>(null)

  // 点击面板外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <Panel ref={panelRef} isOpen={isOpen}>
      <Header>
        <Title>🤖 AI诗词助手</Title>
        <CloseButton onClick={onClose} title="关闭">×</CloseButton>
      </Header>
      
      <Content>
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
      </Content>
    </Panel>
  )
}

export default AIChatPanel