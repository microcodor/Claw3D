#!/bin/bash

echo "🔄 重启 Claw3D 服务器"
echo "================================"
echo ""

# 1. 查找并停止当前 Claw3D 进程
echo "1️⃣ 停止当前 Claw3D 服务器..."
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)

if [ -z "$CLAW3D_PID" ]; then
    echo "⚠️ 未找到运行中的 Claw3D 服务器"
else
    echo "找到进程: PID $CLAW3D_PID"
    kill $CLAW3D_PID
    echo "✅ 已发送停止信号"
    
    # 等待进程完全停止
    echo "等待进程停止..."
    sleep 2
    
    # 验证进程是否已停止
    if lsof -ti :3000 >/dev/null 2>&1; then
        echo "⚠️ 进程仍在运行，强制停止..."
        kill -9 $CLAW3D_PID 2>/dev/null
        sleep 1
    fi
    
    echo "✅ Claw3D 服务器已停止"
fi

echo ""
echo "2️⃣ 启动 Claw3D 服务器..."
echo "================================"
echo ""
echo "请在新终端窗口执行以下命令："
echo ""
echo "  cd Claw3D"
echo "  npm run dev"
echo ""
echo "启动后："
echo "  1. 访问 http://localhost:3000/office"
echo "  2. 硬刷新浏览器: Cmd+Shift+R"
echo "  3. 先测试 SCR-02 和 SCR-03（不需要 Gateway）"
echo "  4. 再测试 SCR-01（需要 Gateway 连接）"
echo ""
echo "💡 提示: 如果 SCR-01 仍然无法连接 Gateway，可以："
echo "  - 使用 Demo Gateway: npm run demo-gateway"
echo "  - 或者只使用 SCR-02 和 SCR-03（它们功能完整）"
echo ""

