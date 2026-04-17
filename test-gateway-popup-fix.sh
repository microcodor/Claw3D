#!/bin/bash

echo "🧪 测试 Gateway 弹窗闪屏修复"
echo "================================"
echo ""

# 检查服务器状态
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)
GATEWAY_PID=$(lsof -ti :18789 2>/dev/null)

if [ -z "$CLAW3D_PID" ]; then
    echo "❌ Claw3D 服务器未运行"
    echo "请先启动: npm run dev"
    exit 1
fi

if [ -z "$GATEWAY_PID" ]; then
    echo "⚠️ Gateway 未运行"
    echo "请先启动: openclaw gateway start"
    echo ""
fi

echo "✅ Claw3D 服务器运行中 (PID: $CLAW3D_PID)"
if [ -n "$GATEWAY_PID" ]; then
    echo "✅ Gateway 运行中 (PID: $GATEWAY_PID)"
fi
echo ""

echo "📋 测试步骤"
echo "================================"
echo ""
echo "1️⃣ 基本连接测试"
echo "   - 访问: http://localhost:3000/office"
echo "   - 输入 Token"
echo "   - 点击 \"连接\" 按钮"
echo "   - ✅ 预期: 弹窗消失，不再闪现"
echo ""

echo "2️⃣ 重连测试"
echo "   - 刷新页面 (Cmd+R)"
echo "   - ✅ 预期: 自动重连，弹窗不闪现"
echo ""

echo "3️⃣ 错误恢复测试"
echo "   - 停止 Gateway: openclaw gateway stop"
echo "   - 刷新页面"
echo "   - 启动 Gateway: openclaw gateway start"
echo "   - 点击连接"
echo "   - ✅ 预期: 弹窗消失，不闪现"
echo ""

echo "🔍 检查要点"
echo "================================"
echo ""
echo "✅ 弹窗应该："
echo "   - 连接中不显示"
echo "   - 连接成功后立即消失"
echo "   - 不会短暂闪现"
echo ""
echo "❌ 如果弹窗闪现："
echo "   - 检查浏览器控制台日志"
echo "   - 查看 [gateway-client] status 日志"
echo "   - 硬刷新浏览器: Cmd+Shift+R"
echo ""

echo "📚 相关文档"
echo "================================"
echo ""
echo "  - Gateway-弹窗闪屏修复说明.md - 详细修复文档"
echo "  - TROUBLESHOOTING.md - 故障排查知识库"
echo ""

echo "🎯 修复内容"
echo "================================"
echo ""
echo "修复文件: src/lib/gateway/GatewayClient.ts"
echo ""
echo "修复点 1: 添加 status !== 'connecting' 检查"
echo "修复点 2: 修改 wasManualDisconnectRef 条件"
echo "修复点 3: 确保 hasConnectedOnceRef 正确更新"
echo ""

echo "✨ 准备测试！"
echo ""
echo "现在可以在浏览器中测试了。"
echo "访问: http://localhost:3000/office"
echo ""

# 尝试打开浏览器（可选）
read -p "是否自动打开浏览器？(y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "正在打开浏览器..."
    open "http://localhost:3000/office" 2>/dev/null || \
    xdg-open "http://localhost:3000/office" 2>/dev/null || \
    echo "请手动打开: http://localhost:3000/office"
fi

echo ""
echo "🎉 开始测试！"

