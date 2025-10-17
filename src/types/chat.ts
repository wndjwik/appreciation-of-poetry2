// 聊天消息类型
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: number
  id?: string
}

// AI聊天状态
export interface AIChatState {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
  error: string | null
}

// AI服务配置
export interface AIConfig {
  model: string
  temperature: number
  maxTokens: number
  stream: boolean
}