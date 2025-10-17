import { ChatMessage } from '../types/chat'

// 模拟AI服务 - 提供类似真实AI的体验
class MockAIService {
  private responseTemplates = {
    appreciation: [
      "这首诗通过{technique}手法，展现了{theme}的意境。作者运用{imagery}的意象，营造出{emotion}的氛围。",
      "这首{genre}诗以{subject}为主题，通过{structure}的结构安排，表达了{meaning}的深层含义。",
      "诗人巧妙地将{element1}与{element2}结合，创造出独特的艺术效果。诗中{feature}的特点尤为突出。"
    ],
    explanation: [
      "这个典故出自{source}，讲述的是{story}。在诗词中常用于表达{meaning}。",
      "{term}是{origin}时期的文学概念，指的是{definition}。在传统文化中具有{symbolism}的象征意义。",
      "这个修辞手法叫做{technique}，通过{method}的方式达到{effect}的艺术效果。"
    ],
    creation: [
      "诗词创作要注意{aspect1}和{aspect2}的平衡。建议从{approach}入手，注重{technique}的运用。",
      "好的诗词往往具有{quality1}和{quality2}。可以尝试{method}来提升创作水平。",
      "创作{genre}诗时，要特别注意{rule1}和{rule2}。多读{recommendation}会有帮助。"
    ],
    general: [
      "作为诗词鉴赏助手，我认为这个问题涉及到{aspect}。从文学角度看，{insight}。",
      "您提到的内容让我想到{connection}。在诗词鉴赏中，{perspective}是很重要的视角。",
      "这个问题很有深度。从{angle}分析，可以发现{discovery}。建议进一步探索{direction}。"
    ]
  }

  private vocabulary = {
    technique: ['比喻', '拟人', '夸张', '对偶', '排比', '借代', '象征'],
    theme: ['思乡', '爱国', '爱情', '人生', '自然', '时光'],
    imagery: ['明月', '流水', '落花', '秋风', '青山', '孤舟'],
    emotion: ['忧伤', '豪迈', '恬淡', '激昂', '惆怅', '宁静'],
    genre: ['七绝', '五律', '词', '古风', '现代诗'],
    subject: ['山水', '离别', '壮志', '闲适', '怀古'],
    structure: ['起承转合', '前后呼应', '层层递进'],
    meaning: ['人生哲理', '情感抒发', '社会批判'],
    element1: ['视觉', '听觉', '嗅觉'],
    element2: ['情感', '理性', '想象'],
    feature: ['语言精炼', '意境深远', '韵律优美'],
    source: ['《史记》', '《诗经》', '《论语》', '神话传说'],
    story: ['历史事件', '民间故事', '文学典故'],
    term: ['比兴', '赋比兴', '意境', '神韵'],
    origin: ['先秦', '唐代', '宋代', '明清'],
    definition: ['特定的表现手法', '传统的审美概念', '文学理论术语'],
    symbolism: ['高尚品格', '美好愿望', '深刻哲理'],
    method: ['对比', '衬托', '铺垫'],
    effect: ['突出主题', '增强感染力', '深化意境'],
    aspect1: ['形式', '内容'],
    aspect2: ['情感', '技巧'],
    approach: ['模仿经典', '观察生活', '积累词汇'],
    quality1: ['意境深远', '语言优美'],
    quality2: ['情感真挚', '结构严谨'],
    rule1: ['平仄', '对仗'],
    rule2: ['押韵', '意象'],
    recommendation: ['唐诗三百首', '宋词精选'],
    aspect: ['文学理论', '创作技巧', '鉴赏方法'],
    insight: ['值得深入探讨', '有多种解读角度'],
    connection: ['相关的文学流派', '类似的表现手法'],
    perspective: ['历史背景', '作者生平', '艺术特色'],
    angle: ['美学', '心理学', '社会学'],
    discovery: ['新的理解', '深层含义'],
    direction: ['相关作品', '理论著作']
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 随机选择数组元素
  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }

  // 填充模板变量
  private fillTemplate(template: string): string {
    return template.replace(/{(\w+)}/g, (_match, key) => {
      return this.randomChoice(this.vocabulary[key as keyof typeof this.vocabulary] || [key])
    })
  }

  // 生成响应内容
  private generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()
    
    let templateType: keyof typeof this.responseTemplates = 'general'
    
    if (message.includes('赏析') || message.includes('欣赏') || message.includes('分析')) {
      templateType = 'appreciation'
    } else if (message.includes('解释') || message.includes('典故') || message.includes('背景')) {
      templateType = 'explanation'
    } else if (message.includes('创作') || message.includes('写作') || message.includes('建议')) {
      templateType = 'creation'
    }

    const template = this.randomChoice(this.responseTemplates[templateType])
    let response = this.fillTemplate(template)

    // 添加个性化开头
    const openings = [
      '您好！关于您的问题，',
      '很高兴为您解答。',
      '作为诗词鉴赏助手，',
      '从专业角度分析，',
      '这个问题很有意思。'
    ]
    
    response = this.randomChoice(openings) + response

    // 确保回复长度合理
    if (response.length < 50) {
      response += ' 希望这个回答对您有帮助，如有其他问题欢迎继续咨询。'
    }

    return response
  }

  // 流式聊天接口
  async chatStream(messages: ChatMessage[], onChunk: (chunk: string) => void): Promise<void> {
    const userMessage = messages[messages.length - 1]
    
    if (!userMessage || userMessage.role !== 'user') {
      throw new Error('无效的用户消息')
    }

    // 模拟网络延迟（0.5-2秒）
    const delayTime = 500 + Math.random() * 1500
    await this.delay(delayTime)

    // 10%的概率模拟网络错误
    if (Math.random() < 0.1) {
      await this.delay(1000)
      throw new Error('网络连接超时，请稍后重试')
    }

    const fullResponse = this.generateResponse(userMessage.content)
    let displayedText = ''

    // 逐字显示效果
    for (let i = 0; i < fullResponse.length; i++) {
      // 随机延迟模拟打字效果
      const charDelay = 30 + Math.random() * 50
      await this.delay(charDelay)
      
      displayedText += fullResponse[i]
      onChunk(displayedText)
    }

    // 最终确保完整文本显示
    if (displayedText !== fullResponse) {
      onChunk(fullResponse)
    }
  }

  // 批量聊天接口（非流式）
  async chat(messages: ChatMessage[]): Promise<string> {
    return new Promise((resolve, reject) => {
      let fullResponse = ''
      
      this.chatStream(messages, (chunk) => {
        fullResponse = chunk
      })
        .then(() => resolve(fullResponse))
        .catch(reject)
    })
  }
}

// 导出单例实例
export const mockAIService = new MockAIService()
export default mockAIService