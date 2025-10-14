# 诗鉴API文档

## 基础信息
- 基础URL: `http://localhost:8000`
- 请求格式: JSON
- 响应格式: JSON

## 接口列表

### 1. 健康检查
- **URL**: `/api/health`
- **方法**: GET
- **描述**: 检查服务状态
- **响应**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-14T10:00:00Z"
}
```

### 2. 获取朝代列表
- **URL**: `/api/dynasties`
- **方法**: GET
- **描述**: 获取支持的朝代列表
- **响应**:
```json
{
  "code": 200,
  "data": ["唐", "宋", "元", "明", "清"]
}
```

### 3. 获取题材列表
- **URL**: `/api/subjects/{dynasty}`
- **方法**: GET
- **参数**: 
  - `dynasty`: 朝代（路径参数）
- **描述**: 获取指定朝代支持的题材列表
- **响应**:
```json
{
  "code": 200,
  "data": ["边塞", "田园", "送别", "咏物"]
}
```

### 4. 搜索诗词
- **URL**: `/api/search`
- **方法**: POST
- **请求体**:
```json
{
  "dynasty": "唐",
  "subject": "边塞"
}
```
- **响应**:
```json
{
  "code": 200,
  "data": {
    "dynasty": "唐",
    "subject": "边塞",
    "poems": [
      {
        "title": "静夜思",
        "author": "李白",
        "dynasty": "唐",
        "content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
        "annotation": "霜：这里指月光像霜一样洁白；举头：抬头"
      }
    ]
  }
}
```

### 5. AI诗词分析
- **URL**: `/api/ai/analysis`
- **方法**: POST
- **请求体**:
```json
{
  "poem_title": "静夜思",
  "poem_author": "李白",
  "poem_content": "床前明月光，疑是地上霜。举头望明月，低头思故乡。"
}
```
- **响应**:
```json
{
  "code": 200,
  "data": {
    "analysis": "AI分析内容...",
    "model": "spark-lite-3.0",
    "cached": false
  }
}
```

## 错误码说明
- `200`: 成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `429`: 请求频率限制
- `500`: 服务器内部错误