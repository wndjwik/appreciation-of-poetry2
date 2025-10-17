import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { ChatMessage, AIChatState } from '../types/chat'
import sparkAIService from '../services/sparkAIService'

interface AIChatContextType extends AIChatState {
  openChat: () => void
  closeChat: () => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined)

export const useAIChat = () => {
  const context = useContext(AIChatContext)
  if (!context) {
    throw new Error('useAIChat must be used within an AIChatProvider')
  }
  return context
}

interface AIChatProviderProps {
  children: React.ReactNode
}

export const AIChatProvider: React.FC<AIChatProviderProps> = ({ children }) => {
  const [state, setState] = useState<AIChatState>({
    messages: [
      {
        role: 'assistant',
        content: '您好！我是AI诗词助手，可以帮您赏析诗词、解答疑问、提供创作建议。请问有什么可以帮您的？',
        timestamp: Date.now(),
        id: 'welcome'
      }
    ],
    isOpen: false,
    isLoading: false,
    error: null
  })

  // 用于跟踪当前正在流式回复的消息ID
  const streamingMessageIdRef = useRef<string | null>(null)

  const openChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }))
  }, [])

  const closeChat = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now()
    }
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }))
    return newMessage.id
  }, [])

  const updateMessageContent = useCallback((messageId: string, content: string) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === messageId ? { ...msg, content } : msg
      )
    }))
  }, [])

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    // 添加用户消息
    addMessage({
      role: 'user',
      content: content.trim()
    })

    // 设置加载状态
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    // 添加空的AI消息用于流式更新
    const aiMessageId = addMessage({
      role: 'assistant',
      content: ''
    })
    streamingMessageIdRef.current = aiMessageId || null

    try {
      // 使用WebSocket流式响应
      const ws = sparkAIService.createWebSocket()
      
      await new Promise<void>((resolve, reject) => {
        let fullResponse = ''
        
        ws.onMessage((chunk) => {
          fullResponse = chunk
          if (streamingMessageIdRef.current === aiMessageId) {
            updateMessageContent(aiMessageId, fullResponse)
          }
        })
        
        ws.onComplete(() => {
          resolve()
        })
        
        ws.onError((error) => {
          reject(error)
        })
        
        // 构建消息历史
        const messages: ChatMessage[] = [
          ...state.messages,
          { role: 'user', content: content.trim(), timestamp: Date.now(), id: Date.now().toString() }
        ]
        
        ws.connect().then(() => {
          ws.sendMessage(messages)
        }).catch(reject)
      })
      
      ws.close()
      
    } catch (error) {
      console.error('AI聊天错误:', error)
      if (streamingMessageIdRef.current === aiMessageId) {
        updateMessageContent(aiMessageId, '抱歉，我暂时无法处理您的请求。请稍后再试或检查网络连接。')
      }
      setState(prev => ({ ...prev, error: error instanceof Error ? error.message : '未知错误' }))
    } finally {
      streamingMessageIdRef.current = null
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [addMessage, updateMessageContent, state.messages])

  const clearMessages = useCallback(() => {
    streamingMessageIdRef.current = null
    setState(prev => ({
      ...prev,
      messages: [
        {
          role: 'assistant',
          content: '对话已清空。请问有什么可以帮您的？',
          timestamp: Date.now(),
          id: 'reset'
        }
      ]
    }))
  }, [])

  const contextValue: AIChatContextType = {
    ...state,
    openChat,
    closeChat,
    sendMessage,
    clearMessages
  }

  return (
    <AIChatContext.Provider value={contextValue}>
      {children}
    </AIChatContext.Provider>
  )
}

export default AIChatContext