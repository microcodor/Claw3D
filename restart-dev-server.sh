#!/bin/bash

echo "🔄 重启 Claw3D 开发服务器"
echo "================================"
echo ""

# 停止旧进程
echo "1️⃣ 停止旧的服务器进程..."
pkill -f "node server/index.js" 2>/dev/null
sleep 2
echo "✅ 已停止"
echo ""

# 验证 token 配置
echo "2️⃣ 验证 Gateway Token 配置..."
if grep -q "^CLAW3D_GATEWAY_TOKEN=.\\+" .env; then
    echo "✅ Token 已配置"
else
    echo "⚠️ Token 未配置或为空"
fi
echo ""

# 启动开发服务器
echo "3️⃣ 启动开发服务器..."
echo "   访问: http://localhost:3000/office"
echo ""
echo "================================"
echo ""

npm run dev
