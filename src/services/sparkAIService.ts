import { ChatMessage } from '../types/chat'
import { mockAIService } from './mockAIService'

// 模拟的讯飞星火API服务 - 使用本地模拟实现
class SparkAIWebSocket {
  private messageCallback: ((message: string) => void) | null = null
  private completeCallback: (() => void) | null = null
  private errorCallback: ((error: Error) => void) | null = null

  // 模拟连接
  async connect(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100))
    console.log('模拟AI服务连接成功')
  }

  // 发送消息
  async sendMessage(messages: ChatMessage[]) {
    try {
      const userMessage = messages[messages.length - 1]
      if (!userMessage || userMessage.role !== 'user') {
        throw new Error('无效的用户消息')
      }

      await mockAIService.chatStream(messages, (chunk) => {
        this.messageCallback?.(chunk)
      })
      
      this.completeCallback?.()
    } catch (error) {
      this.errorCallback?.(error as Error)
    }
  }

  // 设置回调函数
  onMessage(callback: (message: string) => void) {
    this.messageCallback = callback
  }

  onComplete(callback: () => void) {
    this.completeCallback = callback
  }

  onError(callback: (error: Error) => void) {
    this.errorCallback = callback
  }

  // 关闭连接
  close() {
    console.log('模拟AI服务连接关闭')
  }
}

// 模拟的HTTP服务
class SparkAIHTTPService {
  async chat(messages: ChatMessage[]): Promise<string> {
    return mockAIService.chat(messages)
  }
}

// 导出主要服务
export const sparkAIService = {
  // 创建WebSocket连接
  createWebSocket(): SparkAIWebSocket {
    return new SparkAIWebSocket()
  },

  // HTTP服务
  httpService: new SparkAIHTTPService(),

  // 简化的直接对话函数
  async simpleChat(message: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        content: `你是一位专业的诗词鉴赏助手。请用专业但易懂的语言回答用户问题。
        
用户问题：${message}`
      }
    ]

    try {
      return await this.httpService.chat(messages)
    } catch (error) {
      console.warn('AI服务暂时不可用:', error)
      throw new Error('抱歉，AI服务暂时无法处理您的请求。请稍后再试。')
    }
  }
}

export default sparkAIService