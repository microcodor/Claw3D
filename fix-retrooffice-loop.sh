#!/bin/bash

echo "🔧 修复 RetroOffice3D 无限循环错误"
echo "================================"
echo ""

echo "📋 问题说明："
echo "  - 文件: src/features/retro-office/RetroOffice3D.tsx"
echo "  - 行号: 2944"
echo "  - 原因: useEffect 依赖了 renderAgentsRef (ref 不应作为依赖)"
echo ""

echo "✅ 修复内容："
echo "  - 移除 renderAgentsRef 依赖"
echo "  - 使用空依赖数组 []"
echo "  - 只在组件挂载时运行一次"
echo ""

echo "🔄 停止当前服务器..."
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)

if [ -n "$CLAW3D_PID" ]; then
    kill -9 $CLAW3D_PID
    echo "✅ 已强制停止 (PID: $CLAW3D_PID)"
    sleep 2
else
    echo "⚠️ 未找到运行中的服务器"
fi

echo ""
echo "🧹 清除缓存..."
rm -rf .next/cache .next/server 2>/dev/null
echo "✅ 缓存已清除"

echo ""
echo "================================"
echo "✅ 修复完成！"
echo ""
echo "现在请启动服务器："
echo ""
echo "  npm run dev"
echo ""
echo "💡 修复说明："
echo "  - Ref 的引用永远不会改变，不应作为 useEffect 依赖"
echo "  - 使用空依赖数组 [] 确保只在挂载时运行一次"
echo "  - setInterval 会持续更新 UI，无需重新创建"
echo ""

