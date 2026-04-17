#!/bin/bash

echo "🔧 快速修复 Gateway 连接"
echo "================================"
echo ""

# 停止当前 Claw3D 服务器
echo "1️⃣ 停止 Claw3D 服务器..."
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)

if [ -n "$CLAW3D_PID" ]; then
    kill $CLAW3D_PID
    echo "✅ 已停止 (PID: $CLAW3D_PID)"
    sleep 2
else
    echo "⚠️ 未找到运行中的服务器"
fi

echo ""
echo "2️⃣ 请在新终端执行以下命令："
echo ""
echo "  cd Claw3D"
echo "  npm run dev"
echo ""
echo "3️⃣ 启动后，刷新浏览器: Cmd+Shift+R"
echo ""
echo "💡 提示："
echo "  - SCR-02 和 SCR-03 不需要 Gateway，可以直接使用"
echo "  - 只有 SCR-01 需要 Gateway 连接"
echo ""

