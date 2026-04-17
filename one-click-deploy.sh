#!/bin/bash
# Claw3D 一键部署脚本 - 在服务器上运行
# 使用方法: bash one-click-deploy.sh

set -e
cd ~

echo "🚀 开始部署 Claw3D..."

# 克隆或更新项目
if [ -d "claw3d" ]; then
    echo "📦 更新项目..."
    cd claw3d
    [ -f ".env" ] && cp .env .env.backup
    git pull || true
    [ -f ".env.backup" ] && mv .env.backup .env
else
    echo "📦 克隆项目..."
    git clone https://github.com/microcodor/Claw3D.git claw3d
    cd claw3d
fi

# 配置环境变量
if [ ! -f ".env" ]; then
    echo "⚙️  配置环境变量..."
    cp .env.example .env
    
    # 自动获取 Gateway Token
    if command -v openclaw &> /dev/null; then
        TOKEN=$(openclaw config get gateway.auth.token 2>/dev/null || echo "")
        [ -n "$TOKEN" ] && sed -i "s|^CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=${TOKEN}|g" .env
    fi
    
    # 配置基本设置
    sed -i "s|^# *HOST=.*|HOST=0.0.0.0|g" .env
    sed -i "s|^# *PORT=.*|PORT=3000|g" .env
    sed -i "s|^# *CLAW3D_GATEWAY_URL=.*|CLAW3D_GATEWAY_URL=ws://localhost:18789|g" .env
    sed -i "s|^# *CLAW3D_GATEWAY_ADAPTER_TYPE=.*|CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw|g" .env
    sed -i "s|^# *STUDIO_ACCESS_TOKEN=.*|STUDIO_ACCESS_TOKEN=ChangeMe$(date +%s)|g" .env
    
    echo "⚠️  请修改 .env 中的 STUDIO_ACCESS_TOKEN 为强密码！"
fi

# 安装依赖
echo "📥 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 启动服务
echo "🚀 启动服务..."
pm2 stop claw3d 2>/dev/null || true
pm2 delete claw3d 2>/dev/null || true
pm2 start npm --name "claw3d" -- start
pm2 save

echo ""
echo "✅ 部署完成！"
echo ""
echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "查看日志: pm2 logs claw3d"
echo "批准设备: openclaw devices approve --latest"
echo ""
