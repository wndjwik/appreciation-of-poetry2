#!/usr/bin/env python3
"""
诗鉴后端服务启动脚本
"""

import os
import sys
import subprocess
import time

def check_dependencies():
    """检查依赖包是否安装"""
    required_packages = ['fastapi', 'uvicorn', 'pydantic', 'redis']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✓ {package} 已安装")
        except ImportError:
            missing_packages.append(package)
            print(f"✗ {package} 未安装")
    
    return missing_packages

def start_backend():
    """启动后端服务"""
    print("🚀 启动诗鉴后端服务...")
    
    # 检查依赖
    missing = check_dependencies()
    if missing:
        print(f"❌ 缺少依赖包: {missing}")
        print("请运行: pip install -r backend/requirements.txt")
        return False
    
    # 检查诗词数据文件
    data_files = ['data/唐-边塞诗.txt', 'data/宋-田园诗.txt']
    for file in data_files:
        if not os.path.exists(file):
            print(f"⚠️  警告: {file} 不存在")
    
    # 启动服务
    try:
        print("📡 启动FastAPI服务 (端口: 8081)...")
        os.chdir('backend')
        process = subprocess.Popen([sys.executable, 'main.py'])
        
        print("⏳ 等待服务启动...")
        time.sleep(3)
        
        # 检查服务是否正常启动
        try:
            # 使用urllib替代requests进行简单的健康检查
            from urllib.request import urlopen
            from urllib.error import URLError
            response = urlopen('http://localhost:8081/api/health', timeout=5)
            if response.getcode() == 200:
                print("✅ 后端服务启动成功！")
                print("🌐 服务地址: http://localhost:8081")
                print("📚 API文档: http://localhost:8081/docs")
                return True
        except URLError:
            print("⚠️  服务可能未完全启动，请稍后访问 http://localhost:8081")
        except Exception as e:
            print(f"⚠️  健康检查异常: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        return False

if __name__ == "__main__":
    if start_backend():
        print("\n🎉 诗鉴后端服务已启动！")
        print("💡 提示: 请确保Redis服务正在运行")
        print("📖 查看文档: 打开 docs/部署指南.md")
    else:
        print("\n❌ 启动失败，请检查错误信息")