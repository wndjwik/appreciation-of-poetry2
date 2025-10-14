<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ poem.title }}</text>
      <text class="author">{{ poem.author }} · {{ poem.dynasty }}</text>
    </view>
    
    <view class="content-section">
      <text class="content-title">诗词原文</text>
      <view class="poem-content">
        <text>{{ poem.content }}</text>
      </view>
    </view>
    
    <view class="annotation-section" v-if="poem.annotation">
      <text class="annotation-title">注释</text>
      <text class="annotation-content">{{ poem.annotation }}</text>
    </view>
    
    <view class="ai-section">
      <button class="ai-btn" @click="generateAnalysis" :disabled="isGenerating">
        {{ isGenerating ? '分析中...' : '生成AI分析（讯飞星火）' }}
      </button>
      
      <view class="analysis-result" v-if="analysisContent">
        <text class="result-title">AI分析结果</text>
        <text class="result-content">{{ analysisContent }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from 'vue'

const poem = ref({
  title: '',
  author: '',
  dynasty: '',
  content: '',
  annotation: ''
})

const analysisContent = ref('')
const isGenerating = ref(false)

onLoad((options) => {
  poem.value = {
    title: decodeURIComponent(options.title || ''),
    author: decodeURIComponent(options.author || ''),
    dynasty: decodeURIComponent(options.dynasty || ''),
    content: decodeURIComponent(options.content || ''),
    annotation: decodeURIComponent(options.annotation || '')
  }
})

// 生成AI分析
const generateAnalysis = async () => {
  if (!poem.value.title || !poem.value.content) {
    uni.showToast({
      title: '诗词信息不完整',
      icon: 'none'
    })
    return
  }
  
  isGenerating.value = true
  
  try {
    const response = await uni.request({
      url: 'http://localhost:8084/api/ai/analysis',
      method: 'POST',
      data: {
        poem_title: poem.value.title,
        poem_author: poem.value.author,
        poem_content: poem.value.content
      }
    })
    
    if (response[1].data.code === 200) {
      analysisContent.value = response[1].data.data.analysis
      uni.showToast({
        title: '分析生成成功',
        icon: 'success'
      })
    }
  } catch (error) {
    uni.showToast({
      title: '分析生成失败',
      icon: 'none'
    })
    console.error('AI分析错误:', error)
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
  padding: 40rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.author {
  display: block;
  font-size: 32rpx;
  color: #666;
}

.content-section, .annotation-section, .ai-section {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
}

.content-title, .annotation-title, .result-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}

.poem-content {
  font-size: 32rpx;
  line-height: 1.8;
  color: #333;
  text-align: center;
}

.annotation-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #666;
}

.ai-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 25rpx;
  font-size: 32rpx;
  font-weight: 500;
  width: 100%;
}

.ai-btn:disabled {
  background: #ccc;
  color: #999;
}

.analysis-result {
  margin-top: 40rpx;
  padding: 30rpx;
  background: #f8f9fa;
  border-radius: 10rpx;
}

.result-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
}
</style>