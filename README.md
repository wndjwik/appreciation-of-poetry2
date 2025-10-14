# 诗鉴（Poetry Insight）AI驱动诗词赏析平台 - MVP版本

## 项目概述
"诗鉴"是一个轻量化跨端诗词工具，围绕"按类别找诗词、AI解诗词"核心需求，基于Uniapp适配微信小程序+H5，通过Python后端打通"分类别搜索TXT诗词资源-调用讯飞星火生成分析内容"链路。

## 核心功能
1. **分类别诗词搜索**：按"朝代（唐/宋/元/明/清）""题材（边塞/田园/送别/咏物）"分类，从本地TXT文本中快速定位诗词
2. **讯飞星火AI诗词分析**：调用讯飞星火大模型生成结构化分析（创作背景、意象解读、情感表达）

## 技术架构
- **前端**：Uniapp + Vue3 + Pinia + uView Plus
- **后端**：Python + FastAPI + 讯飞星火Python SDK
- **数据存储**：TXT文本文件 + Redis缓存 + Supabase记录存储

## 项目结构
```
Appreciation_of_Poetry/
├── README.md                   # 项目说明文档
├── backend/                    # Python后端代码
│   ├── app/
│   ├── requirements.txt
│   └── main.py
├── frontend/                   # Uniapp前端代码
│   ├── pages/
│   ├── static/
│   └── manifest.json
├── data/                       # 诗词数据文件
│   ├── 唐-边塞诗.txt
│   ├── 宋-田园诗.txt
│   └── ...
└── docs/                       # 项目文档
    ├── API文档.md
    └── 部署指南.md
```

## 快速开始

### 后端启动
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## 功能模块说明

### 1. 诗词分类搜索模块
- 支持按朝代和题材双维度分类搜索
- 从TXT文件中快速读取诗词数据
- Redis缓存高频访问数据

### 2. AI诗词分析模块
- 集成讯飞星火大模型API
- 生成结构化诗词分析内容
- 支持历史记录查看

## 开发进度
- [x] 项目架构设计
- [ ] 后端API开发
- [ ] 前端页面开发
- [ ] 诗词数据整理
- [ ] 讯飞星火API集成
- [ ] 联调测试

## 联系方式
如有问题请联系项目负责人。