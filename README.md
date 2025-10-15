# 诗词鉴赏应用

基于React + TypeScript + Supabase开发的诗词鉴赏平台，提供诗词查询、赏析和用户管理功能。

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **样式**: Styled Components
- **路由**: React Router 6
- **后端**: Supabase (PostgreSQL + Auth + Storage)
- **部署**: Vercel

## 功能特性

### 已实现功能
- ✅ 诗词搜索（标题、作者、内容）
- ✅ 诗词详情展示
- ✅ 作者信息
- ✅ 诗词赏析
- ✅ 响应式设计

### 待开发功能
- 🔄 用户注册登录
- 🔄 收藏功能
- 🔄 评论系统
- 🔄 个性化推荐

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn
- Supabase 账户

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd appreciation-of-poetry
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的Supabase配置
VITE_SUPABASE_URL=你的项目URL
VITE_SUPABASE_ANON_KEY=你的anon key
```

4. **设置Supabase项目**
   - 在 [Supabase官网](https://supabase.com) 创建新项目
   - 获取项目URL和anon key
   - 在项目SQL编辑器中执行 `scripts/init-database.sql`

5. **导入样本数据**
```bash
# 初始化数据库和导入数据
npm run db:init
```

6. **启动开发服务器**
```bash
npm run dev
```

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── Header.tsx       # 顶部导航
│   ├── PoemCard.tsx     # 诗词卡片
│   └── SearchBar.tsx    # 搜索框
├── pages/               # 页面组件
│   ├── Home.tsx        # 首页
│   ├── Login.tsx       # 登录页
│   ├── Register.tsx    # 注册页
│   ├── Search.tsx      # 搜索页
│   └── PoemDetail.tsx  # 诗词详情页
├── services/            # 服务层
│   └── poemService.ts  # 诗词数据服务
├── lib/                 # 工具库
│   └── supabase.ts     # Supabase客户端
├── types/              # 类型定义
│   └── database.ts     # 数据库类型
└── styles/             # 样式文件
    ├── GlobalStyle.ts  # 全局样式
    └── theme.ts        # 主题配置

scripts/
├── init-database.sql    # 数据库初始化脚本
├── generate-sample-data.ts # 样本数据生成
└── import-data.ts      # 数据导入工具
```

## 数据库设计

### 核心表结构

**authors (作者表)**
- id (UUID) - 主键
- name (TEXT) - 作者姓名
- dynasty (TEXT) - 朝代
- introduction (TEXT) - 简介
- birth_year (INTEGER) - 出生年份
- death_year (INTEGER) - 逝世年份

**poems (诗词表)**
- id (UUID) - 主键
- title (TEXT) - 标题
- content (TEXT) - 内容
- dynasty (TEXT) - 朝代
- author_id (UUID) - 作者外键
- type (TEXT) - 类型（诗、词等）
- themes (TEXT[]) - 主题标签数组

**appreciations (赏析表)**
- id (UUID) - 主键
- poem_id (UUID) - 诗词外键
- content (TEXT) - 赏析内容
- source (TEXT) - 来源

## 开发指南

### 添加新的诗词数据

1. **通过脚本添加**
```bash
npm run db:generate
```

2. **手动添加数据**
```typescript
import { supabase } from './lib/supabase'

// 添加作者
const { data: author } = await supabase
  .from('authors')
  .insert([{
    name: '作者名',
    dynasty: '朝代',
    introduction: '简介'
  }])
  .select()

// 添加诗词
const { data: poem } = await supabase
  .from('poems')
  .insert([{
    title: '标题',
    content: '内容',
    dynasty: '朝代',
    author_id: author.id,
    type: '诗',
    themes: ['主题1', '主题2']
  }])
  .select()
```

### 自定义搜索功能

```typescript
import PoemService from './services/poemService'

// 基础搜索
const results = await PoemService.searchPoems({
  query: '李白',
  page: 1,
  limit: 10
})

// 高级搜索
const results = await PoemService.searchPoems({
  query: '月亮',
  dynasty: '唐',
  type: '诗'
})

// 全文搜索
const results = await PoemService.fullTextSearch('静夜思')
```

## 部署指南

### Vercel 部署

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量
4. 部署完成

### 环境变量配置

在Vercel项目设置中配置：
- `VITE_SUPABASE_URL` - Supabase项目URL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件

---

**享受诗词之美，传承中华文化** 📚✨