"""
诗鉴（Poetry Insight）后端主程序
基于FastAPI的诗词赏析平台后端服务
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
from datetime import timedelta
import os
from typing import List, Dict, Optional

# 导入配置模块
from config import settings, get_redis_url, validate_config
from spark_api import create_spark_client, SparkAPI

# 初始化FastAPI应用
app = FastAPI(
    title="诗鉴API",
    description="AI驱动诗词赏析平台后端服务",
    version="1.0.0"
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化Redis客户端（用于缓存）
try:
    redis_client = redis.Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        db=settings.redis_db,
        password=settings.redis_password,
        decode_responses=True
    )
    # 测试Redis连接
    redis_client.ping()
    print("✅ Redis连接成功")
except Exception as e:
    print(f"❌ Redis连接失败: {e}")
    redis_client = None

# 数据模型定义
class SearchRequest(BaseModel):
    """搜索请求模型"""
    dynasty: str  # 朝代
    subject: str  # 题材

class Poem(BaseModel):
    """诗词模型"""
    title: str      # 标题
    author: str     # 作者  
    dynasty: str    # 朝代
    content: str    # 原文
    annotation: str # 注释

class AIAnalysisRequest(BaseModel):
    """AI分析请求模型"""
    poem_title: str   # 诗词标题
    poem_author: str  # 诗词作者
    poem_content: str # 诗词原文

class AIAnalysisResponse(BaseModel):
    """AI分析响应模型"""
    analysis: str     # 分析内容
    model: str = "spark-lite-3.0"  # AI模型标识

def read_poetry_file(dynasty: str, subject: str) -> List[Poem]:
    """
    读取指定朝代和题材的诗词文件
    
    Args:
        dynasty: 朝代（唐/宋/元/明/清）
        subject: 题材（边塞/田园/送别/咏物）
        
    Returns:
        List[Poem]: 诗词列表
    """
    # 使用绝对路径确保文件位置正确
    filename = os.path.abspath(os.path.join(settings.data_dir, f"{dynasty}-{subject}诗.txt"))
    poems = []
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    parts = line.split('|')
                    if len(parts) >= 5:
                        poem = Poem(
                            title=parts[0],
                            author=parts[1],
                            dynasty=parts[2],
                            content=parts[3],
                            annotation=parts[4] if len(parts) > 4 else ""
                        )
                        poems.append(poem)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"诗词文件不存在: {filename}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"读取文件失败: {str(e)}")
    
    return poems

@app.get("/")
async def root():
    """根路径"""
    config_errors = validate_config()
    status = "healthy" if not config_errors else "config_errors"
    return {
        "message": "诗鉴API服务运行中", 
        "version": "1.0.0",
        "status": status,
        "config_errors": config_errors
    }

@app.get("/api/dynasties")
async def get_dynasties():
    """获取支持的朝代列表"""
    return {
        "code": 200,
        "data": ["唐", "宋", "元", "明", "清"]
    }

@app.get("/api/subjects/{dynasty}")
async def get_subjects(dynasty: str):
    """获取指定朝代支持的题材列表"""
    subjects_map = {
        "唐": ["边塞", "田园", "送别", "咏物"],
        "宋": ["田园", "送别", "咏物", "抒情"],
        "元": ["抒情", "咏物", "山水"],
        "明": ["抒情", "咏物", "山水"],
        "清": ["抒情", "咏物", "山水"]
    }
    
    if dynasty not in subjects_map:
        raise HTTPException(status_code=400, detail="不支持的朝代")
    
    return {
        "code": 200,
        "data": subjects_map[dynasty]
    }

@app.post("/api/search")
async def search_poems(request: SearchRequest):
    """
    根据朝代和题材搜索诗词
    
    Args:
        request: 搜索请求参数
        
    Returns:
        诗词列表
    """
    try:
        # 读取诗词文件
        poems = read_poetry_file(request.dynasty, request.subject)
        
        # 缓存结果（12小时，如果Redis可用）
        if redis_client:
            cache_key = f"search:{request.dynasty}:{request.subject}"
            redis_client.setex(cache_key, timedelta(hours=12), str(poems))
        
        return {
            "code": 200,
            "data": {
                "dynasty": request.dynasty,
                "subject": request.subject,
                "poems": [poem.dict() for poem in poems]
            }
        }
    except Exception as e:
        return {
            "code": 500,
            "message": f"搜索失败: {str(e)}",
            "data": None
        }

@app.post("/api/ai/analysis")
async def get_ai_analysis(request: AIAnalysisRequest):
    """
    获取AI诗词分析（讯飞星火）
    
    Args:
        request: AI分析请求参数
        
    Returns:
        AI分析内容
    """
    # 检查缓存
    cache_key = f"analysis:{request.poem_title}:{request.poem_author}"
    if redis_client:
        cached_analysis = redis_client.get(cache_key)
        if cached_analysis:
            return {
                "code": 200, 
                "data": {
                    "analysis": cached_analysis,
                    "model": "spark-lite-3.0",
                    "cached": True
                }
            }
    
    try:
        # 创建讯飞星火客户端
        spark_client = create_spark_client()
        
        # 调用讯飞星火API进行诗词分析
        analysis_content = spark_client.analyze_poem(
            poem_title=request.poem_title,
            poem_author=request.poem_author,
            poem_content=request.poem_content,
            temperature=0.3,
            max_tokens=500
        )
        
        # 缓存分析结果
        if redis_client:
            redis_client.setex(cache_key, timedelta(hours=settings.cache_ttl_hours), analysis_content)
        
        return {
            "code": 200,
            "data": {
                "analysis": analysis_content,
                "model": "spark-lite-3.0",
                "cached": False
            }
        }
        
    except Exception as e:
        # 如果API调用失败，返回模拟结果
        fallback_content = f"""
        【创作背景】这首{request.poem_title}是{request.poem_author}的代表作之一，创作于特定的历史时期。
        
        【意象解读】诗中运用了丰富的意象手法，通过具体景物表达抽象情感。
        
        【情感表达】作者通过这首诗抒发了深刻的思想感情，具有很高的艺术价值。
        
        （注：当前使用备用分析结果，讯飞星火API调用异常：{str(e)}）
        """
        
        return {
            "code": 200,
            "data": {
                "analysis": fallback_content,
                "model": "fallback",
                "cached": False,
                "note": f"API调用异常，使用备用分析: {str(e)}"
            }
        }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8081)