#!/bin/bash

echo "🔧 修复无限循环错误"
echo "================================"
echo ""

echo "停止当前服务器..."
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)

if [ -n "$CLAW3D_PID" ]; then
    kill -9 $CLAW3D_PID
    echo "✅ 已强制停止 (PID: $CLAW3D_PID)"
    sleep 2
else
    echo "⚠️ 未找到运行中的服务器"
fi

echo ""
echo "清除缓存..."
rm -rf .next/cache .next/server 2>/dev/null
echo "✅ 缓存已清除"

echo ""
echo "================================"
echo "✅ 准备就绪！"
echo ""
echo "现在请启动服务器："
echo ""
echo "  npm run dev"
echo ""
echo "💡 说明："
echo "  - 已回滚可能导致无限循环的修改"
echo "  - 保留了 hasConnectedOnceRef 的安全修改"
echo "  - 弹窗闪屏问题可能仍然存在，但不会导致崩溃"
echo ""

