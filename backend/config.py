"""
诗鉴后端配置模块
"""

import os
from typing import Optional
try:
    from pydantic_settings import BaseSettings
except ImportError:
    # 兼容旧版本pydantic
    from pydantic import BaseSettings


class Settings(BaseSettings):
    """应用配置类"""
    
    # 讯飞星火API配置
    spark_app_id: str = "e3532dea"
    spark_api_key: str = "59d89dca17cd2f2f53c76a971cdc4719"
    spark_api_secret: str = "N2FlMmFhZmY5Y2IwNjk2YWI4YWVlOTcx"
    spark_model: str = "spark-lite-3.0"
    
    # Redis配置
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_db: int = 0
    redis_password: Optional[str] = None
    
    # 服务配置
    server_host: str = "0.0.0.0"
    server_port: int = 8084
    debug: bool = True
    
    # 数据文件路径（使用绝对路径指向项目根目录的data文件夹）
    data_dir: str = "C:/Users/xiaohao/Desktop/Appreciation_of_Poetry/data"
    
    # 缓存配置
    cache_ttl_hours: int = 24  # AI分析缓存时间
    search_cache_ttl_hours: int = 12  # 搜索缓存时间
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# 全局配置实例
settings = Settings()


def get_redis_url() -> str:
    """获取Redis连接URL"""
    if settings.redis_password:
        return f"redis://:{settings.redis_password}@{settings.redis_host}:{settings.redis_port}/{settings.redis_db}"
    else:
        return f"redis://{settings.redis_host}:{settings.redis_port}/{settings.redis_db}"


def validate_config():
    """验证配置是否完整"""
    errors = []
    
    # 检查必要配置
    if not settings.spark_api_key:
        errors.append("讯飞星火API密钥未配置")
    if not settings.spark_api_secret:
        errors.append("讯飞星火API密钥未配置")
    
    # 检查数据目录（使用绝对路径）
    data_dir_path = os.path.abspath(settings.data_dir)
    if not os.path.exists(data_dir_path):
        errors.append(f"数据目录不存在: {data_dir_path}")
    
    return errors