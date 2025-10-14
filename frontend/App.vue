<script>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

export default {
  onLaunch: function() {
    console.log('诗鉴应用启动')
  },
  onShow: function() {
    console.log('诗鉴应用显示')
  },
  onHide: function() {
    console.log('诗鉴应用隐藏')
  }
}
</script>
</script>

<style>
/* 全局样式 */
page {
  background-color: #f8f9fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

.container {
  padding: 20rpx;
  min-height: 100vh;
}

/* 通用按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10rpx;
  padding: 20rpx 40rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.btn-primary:disabled {
  background: #ccc;
  color: #999;
}

/* 卡片样式 */
.card {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

/* 文本样式 */
.text-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.text-subtitle {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}
</style>