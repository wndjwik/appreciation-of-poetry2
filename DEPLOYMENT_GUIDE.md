# Netlify 部署指南

## 问题修复说明

已修复导致白屏的主要问题：

1. **SPA路由问题** - 创建了 `public/_redirects` 文件
2. **环境变量错误处理** - 改进了 `src/lib/supabase.ts` 的错误处理
3. **Netlify配置** - 创建了 `netlify.toml` 配置文件

## 部署步骤

### 1. 准备部署文件
确保以下文件已提交到Git仓库：
- `netlify.toml`
- `public/_redirects`
- 所有源代码文件

### 2. 在Netlify中配置环境变量

登录Netlify控制台，进入项目设置，在"Environment variables"部分添加以下变量：

```
VITE_SUPABASE_URL=https://dvqawbxfjczlyrhyqfjx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cWF3YnhmamN6bHlyaHlxZmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MDI1NDIsImV4cCI6MjA3NTk3ODU0Mn0.MkH7X3AAZDAjnb_dJRqf3NwtL4_qwmE1j32E509v-ao
VITE_SPARK_APP_ID=e3532dea
VITE_SPARK_API_KEY=59d89dca17cd2f2f53c76a971cdc4719
VITE_APP_TITLE=诗词鉴赏应用
```

### 3. 部署设置
- **构建命令**: `npm run build`
- **发布目录**: `dist`
- **Node版本**: 18 (已在netlify.toml中配置)

### 4. 触发部署
- 如果使用Git集成，推送代码到主分支
- 如果手动部署，上传dist文件夹内容

## 故障排除

### 如果仍然白屏：

1. **检查浏览器控制台**
   - 打开开发者工具(F12)
   - 查看Console标签页的错误信息

2. **检查网络请求**
   - 查看Network标签页
   - 确认静态资源是否正确加载

3. **验证环境变量**
   - 确认Netlify中的环境变量名称正确
   - 确认环境变量值正确

4. **检查构建日志**
   - 在Netlify的Deploy日志中查看构建过程
   - 确认构建成功完成

## 本地测试部署

在部署前，可以在本地测试构建：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 预览构建结果
npm run preview
```

如果本地预览正常，但Netlify部署后白屏，通常是环境变量或路由配置问题。