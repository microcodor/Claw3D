#!/bin/bash

echo "🔧 修复 UPSTREAM_ALLOWLIST 并重启服务器"
echo "================================"
echo ""

# 1. 检查当前配置
echo "1️⃣ 检查当前 .env 配置..."
echo ""
grep "UPSTREAM_ALLOWLIST" .env
echo ""

# 2. 确认配置正确
echo "2️⃣ 验证配置..."
ALLOWLIST=$(grep "^UPSTREAM_ALLOWLIST=" .env | cut -d'=' -f2)
if [[ "$ALLOWLIST" == *"localhost:18789"* ]]; then
    echo "✅ UPSTREAM_ALLOWLIST 配置正确: $ALLOWLIST"
else
    echo "❌ UPSTREAM_ALLOWLIST 配置错误"
    echo "正在修复..."
    # 备份
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    # 修复
    if grep -q "^UPSTREAM_ALLOWLIST=" .env; then
        sed -i '' 's/^UPSTREAM_ALLOWLIST=.*/UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789/' .env
    else
        echo "UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789" >> .env
    fi
    echo "✅ 已修复"
fi

echo ""
echo "3️⃣ 停止当前服务器..."
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)

if [ -n "$CLAW3D_PID" ]; then
    kill $CLAW3D_PID
    echo "✅ 已停止 (PID: $CLAW3D_PID)"
    sleep 2
    
    # 确保完全停止
    if lsof -ti :3000 >/dev/null 2>&1; then
        echo "强制停止..."
        kill -9 $(lsof -ti :3000) 2>/dev/null
        sleep 1
    fi
else
    echo "⚠️ 未找到运行中的服务器"
fi

echo ""
echo "4️⃣ 验证 Gateway 状态..."
GATEWAY_PID=$(lsof -ti :18789 2>/dev/null)
if [ -n "$GATEWAY_PID" ]; then
    echo "✅ Gateway 运行中 (PID: $GATEWAY_PID)"
else
    echo "❌ Gateway 未运行"
    echo "请先启动 Gateway: openclaw gateway start"
    exit 1
fi

echo ""
echo "5️⃣ 清除可能的缓存..."
rm -rf .next/cache 2>/dev/null
echo "✅ 缓存已清除"

echo ""
echo "================================"
echo "✅ 准备就绪！"
echo ""
echo "请在新终端执行以下命令启动服务器："
echo ""
echo "  cd Claw3D"
echo "  npm run dev"
echo ""
echo "启动后："
echo "  1. 访问 http://localhost:3000/office"
echo "  2. 硬刷新浏览器: Cmd+Shift+R"
echo "  3. 检查浏览器控制台，应该不再有 'not in the allowed hosts list' 错误"
echo ""
echo "💡 提示："
echo "  - 如果还有问题，可能需要重启 Gateway: openclaw gateway restart"
echo "  - SCR-02 和 SCR-03 不需要 Gateway，可以直接使用"
echo ""

