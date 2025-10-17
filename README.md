# 诗词鉴赏应用 (Appreciation of Poetry)

一个现代化的诗词鉴赏Web应用，集成了AI聊天助手功能。

## 🌟 功能特性

### 核心功能
- **诗词浏览**：查看经典诗词作品
- **作者信息**：了解诗人背景和作品
- **智能搜索**：按标题、作者、内容搜索
- **AI助手**：专业的诗词鉴赏AI聊天机器人

### AI聊天功能
- 🤖 智能诗词赏析和创作建议
- 💬 实时流式对话体验
- 📱 响应式设计，支持移动端
- ⚡ 快速响应，逐字显示效果

## 🚀 技术栈

### 前端
- **React 18** + TypeScript
- **Vite** - 快速构建工具
- **Styled Components** - CSS-in-JS样式方案
- **Context API** - 状态管理

### AI服务
- **模拟AI服务** - 本地智能回复（当前）
- **讯飞星火API** - 真实AI集成（可选）
- **n8n工作流** - 自动化AI调用（规划中）

## 📦 项目结构

```
appreciation-of-poetry2/
├── src/
│   ├── components/          # React组件
│   │   ├── AIChatPanel.tsx # AI聊天面板
│   │   ├── MessageList.tsx  # 消息列表
│   │   └── MessageInput.tsx # 消息输入
│   ├── services/            # 服务层
│   │   ├── mockAIService.ts # 模拟AI服务
│   │   └── sparkAIService.ts # AI服务接口
│   ├── contexts/            # React上下文
│   │   └── AIChatContext.tsx # 聊天状态管理
│   └── types/               # TypeScript类型定义
├── server/                  # 后端服务（开发中）
└── scripts/                 # 数据导入脚本
```

## 🛠️ 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装和运行

1. **克隆项目**
```bash
git clone https://github.com/wndjwik/appreciation-of-poetry2.git
cd appreciation-of-poetry2
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
```bash
cp .env.example .env
# 编辑.env文件配置环境变量
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
打开浏览器访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
npm run preview
```

## 🔧 开发指南

### AI功能开发
项目支持两种AI实现方式：

1. **模拟AI服务**（当前默认）
   - 本地运行的智能回复系统
   - 无需外部API密钥
   - 适合开发和测试

2. **真实AI集成**（可选）
   - 基于讯飞星火大模型
   - 需要API密钥配置
   - 提供更智能的回复

### 添加新的AI服务
参考 `src/services/mockAIService.ts` 实现新的服务类，然后在 `sparkAIService.ts` 中切换使用。

## 📱 功能演示

### AI聊天界面
- 侧边栏式聊天面板
- 实时消息流式显示
- 快速操作按钮
- 点击外部区域关闭

### 响应式设计
- 桌面端：400px侧边栏
- 移动端：全屏显示
- 平滑动画过渡效果

## 🔄 部署选项

### Vercel部署（推荐）
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/wndjwik/appreciation-of-poetry2)

### 其他平台
- Netlify
- GitHub Pages
- 自有服务器

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 诗词数据来源：[...]
- UI设计灵感：[...]
- 技术栈支持：React、Vite、TypeScript等

---

**开发中功能**：真实AI集成、用户认证、数据持久化等。

如有问题请提交 [Issue](https://github.com/wndjwik/appreciation-of-poetry2/issues)。