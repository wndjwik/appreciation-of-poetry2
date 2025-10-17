import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ChatMessage } from '../types/chat'

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f8f9fa;
`

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  margin-bottom: 16px;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.isUser ? '#667eea' : 'white'};
  color: ${props => props.isUser ? 'white' : '#333'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-left: ${props => props.isUser ? 'auto' : '0'};
  margin-right: ${props => props.isUser ? '0' : 'auto'};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const MessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`

const LoadingDots = styled.div`
  display: inline-block;
  
  &::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60% { content: '...'; }
    80%, 100% { content: ''; }
  }
`

const Timestamp = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  text-align: right;
`

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <MessagesContainer>
      {messages.map((message) => (
        <MessageContainer key={message.id || message.timestamp} isUser={message.role === 'user'}>
          <MessageBubble isUser={message.role === 'user'}>
            <div>{message.content}</div>
            <Timestamp>{formatTime(message.timestamp)}</Timestamp>
          </MessageBubble>
        </MessageContainer>
      ))}
      
      {isLoading && (
        <MessageContainer isUser={false}>
          <MessageBubble isUser={false}>
            <LoadingDots>AI正在思考</LoadingDots>
          </MessageBubble>
        </MessageContainer>
      )}
      
      <div ref={messagesEndRef} />
    </MessagesContainer>
  )
}

export default MessageList