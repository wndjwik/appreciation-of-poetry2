import React from 'react'
import styled from 'styled-components'

const ChatButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`

const NotificationDot = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4757;
  border: 2px solid white;
`

interface AIChatButtonProps {
  onClick: () => void
  hasNewMessage?: boolean
}

const AIChatButton: React.FC<AIChatButtonProps> = ({ 
  onClick, 
  hasNewMessage = false 
}) => {
  return (
    <ChatButton onClick={onClick} title="AI诗词助手">
      🤖
      {hasNewMessage && <NotificationDot />}
    </ChatButton>
  )
}

export default AIChatButton