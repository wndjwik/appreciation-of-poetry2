import React, { useState } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  background: white;
`

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`

const TextArea = styled.textarea`
  flex: 1;
  min-height: 40px;
  max-height: 120px;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`

const SendButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 20px;
  background: ${props => props.disabled ? '#ccc' : '#667eea'};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`

const QuickActionButton = styled.button`
  padding: 6px 12px;
  background: #f0f2f5;
  border: 1px solid #ddd;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e4e6eb;
    border-color: #ccc;
  }
`

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const quickActions = [
    { text: '帮我赏析这首诗', prompt: '请帮我赏析这首诗的意境和修辞手法' },
    { text: '解释这个典故', prompt: '请解释这首诗中提到的典故和背景' },
    { text: '创作建议', prompt: '请给我一些诗词创作的建议和技巧' }
  ]

  const handleQuickAction = (prompt: string) => {
    onSendMessage(prompt)
  }

  return (
    <InputContainer>
      <QuickActions>
        {quickActions.map((action, index) => (
          <QuickActionButton
            key={index}
            type="button"
            onClick={() => handleQuickAction(action.prompt)}
            disabled={disabled}
          >
            {action.text}
          </QuickActionButton>
        ))}
      </QuickActions>
      
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            disabled={disabled}
            rows={1}
          />
          <SendButton type="submit" disabled={!message.trim() || disabled}>
            发送
          </SendButton>
        </InputWrapper>
      </form>
    </InputContainer>
  )
}

export default MessageInput