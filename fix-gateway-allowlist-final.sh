#!/bin/bash

echo "🔧 彻底修复 Gateway Allowlist 问题"
echo "================================"
echo ""

echo "✅ 已修复代码问题："
echo "   - 修改了 server/gateway-proxy.js 中的 isUpstreamAllowed 函数"
echo "   - 现在支持 hostname:port 格式的 allowlist"
echo ""

echo "📋 当前配置："
grep "UPSTREAM_ALLOWLIST" .env | grep -v "^#"
echo ""

echo "🔄 停止当前服务器..."
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
echo "🧹 清除缓存..."
rm -rf .next/cache 2>/dev/null
echo "✅ 缓存已清除"

echo ""
echo "================================"
echo "✅ 修复完成！"
echo ""
echo "现在请启动服务器："
echo ""
echo "  npm run dev"
echo ""
echo "启动后："
echo "  1. 访问 http://localhost:3000/office"
echo "  2. 硬刷新浏览器: Cmd+Shift+R"
echo "  3. Gateway 连接应该成功了！"
echo ""
echo "💡 修复说明："
echo "  - 原问题: isUpstreamAllowed 只检查 hostname，不支持 port"
echo "  - 新逻辑: 同时支持 'localhost' 和 'localhost:18789' 格式"
echo "  - 配置: UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789"
echo ""

