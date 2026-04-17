#!/bin/bash

echo "🔧 修复 Gateway WebSocket 连接问题"
echo "================================"
echo ""

# 1. 检查当前状态
echo "1️⃣ 检查当前状态..."
echo ""

# 检查 Gateway 是否运行
GATEWAY_PID=$(lsof -ti :18789 2>/dev/null)
if [ -z "$GATEWAY_PID" ]; then
    echo "❌ Gateway 未运行在端口 18789"
    echo "   启动 Gateway: openclaw gateway start"
    exit 1
else
    echo "✅ Gateway 运行中 (PID: $GATEWAY_PID)"
fi

# 检查 Claw3D 是否运行
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)
if [ -z "$CLAW3D_PID" ]; then
    echo "⚠️ Claw3D 服务器未运行"
else
    echo "✅ Claw3D 服务器运行中 (PID: $CLAW3D_PID)"
fi
echo ""

# 2. 测试 Gateway HTTP 端点
echo "2️⃣ 测试 Gateway HTTP 端点..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:18789 2>&1)
if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "404" ]; then
    echo "✅ Gateway HTTP 响应正常 (状态码: $HTTP_STATUS)"
else
    echo "❌ Gateway HTTP 响应异常 (状态码: $HTTP_STATUS)"
fi
echo ""

# 3. 测试 WebSocket 连接（使用 wscat 如果可用）
echo "3️⃣ 测试 WebSocket 连接..."
if command -v wscat &> /dev/null; then
    echo "使用 wscat 测试 WebSocket..."
    timeout 3 wscat -c ws://localhost:18789 2>&1 | head -5 || echo "⚠️ WebSocket 连接超时或失败"
else
    echo "⚠️ wscat 未安装，跳过 WebSocket 测试"
    echo "   安装: npm install -g wscat"
fi
echo ""

# 4. 检查 Gateway 日志
echo "4️⃣ 检查 Gateway 最新日志..."
GATEWAY_LOG=$(ls -t /tmp/openclaw/openclaw-*.log 2>/dev/null | head -1)
if [ -n "$GATEWAY_LOG" ]; then
    echo "日志文件: $GATEWAY_LOG"
    echo "最后 10 行:"
    tail -10 "$GATEWAY_LOG" | grep -E "error|Error|ERROR|warn|Warn|WARN|websocket|WebSocket" || echo "无错误或警告"
else
    echo "⚠️ 未找到 Gateway 日志文件"
fi
echo ""

# 5. 验证 Token 配置
echo "5️⃣ 验证 Token 配置..."
ENV_TOKEN=$(grep "^CLAW3D_GATEWAY_TOKEN=" .env 2>/dev/null | cut -d'=' -f2)
GATEWAY_TOKEN=$(openclaw config get gateway.auth.token 2>&1)

if [ -z "$ENV_TOKEN" ]; then
    echo "❌ .env 中未配置 CLAW3D_GATEWAY_TOKEN"
elif [ "$GATEWAY_TOKEN" = "__OPENCLAW_REDACTED__" ]; then
    echo "✅ Token 已配置（Gateway 和 .env 都有）"
else
    echo "⚠️ 无法验证 Token 是否匹配"
fi
echo ""

# 6. 解决方案
echo "💡 解决方案:"
echo "================================"
echo ""

if [ -n "$CLAW3D_PID" ]; then
    echo "方案 1: 重启 Claw3D 服务器（推荐）"
    echo "----------------------------------------"
    echo "WebSocket 代理可能需要重新初始化"
    echo ""
    echo "执行命令:"
    echo "  1. 停止当前服务器: kill $CLAW3D_PID"
    echo "  2. 等待 2 秒: sleep 2"
    echo "  3. 重新启动: npm run dev"
    echo ""
    read -p "是否立即执行？(y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 重启 Claw3D 服务器..."
        kill $CLAW3D_PID
        sleep 2
        echo "✅ 已停止旧服务器"
        echo ""
        echo "请手动执行: npm run dev"
        echo "然后刷新浏览器: Cmd+Shift+R"
        exit 0
    fi
fi

echo ""
echo "方案 2: 重启 Gateway（如果方案 1 无效）"
echo "----------------------------------------"
echo "执行命令:"
echo "  openclaw gateway restart"
echo ""

echo "方案 3: 使用 Demo Gateway（不需要 OpenClaw）"
echo "----------------------------------------"
echo "1. 修改 .env:"
echo "   CLAW3D_GATEWAY_URL=ws://localhost:18790"
echo "   CLAW3D_GATEWAY_ADAPTER_TYPE=demo"
echo ""
echo "2. 启动 Demo Gateway:"
echo "   npm run demo-gateway"
echo ""
echo "3. 重启 Claw3D:"
echo "   npm run dev"
echo ""

echo "方案 4: 先测试 SCR-02 和 SCR-03（不需要 Gateway）"
echo "----------------------------------------"
echo "✅ SCR-02 (热搜舆情中心) - 完全独立，无需 Gateway"
echo "✅ SCR-03 (创作工作室) - 完全独立，无需 Gateway"
echo ""
echo "访问 http://localhost:3000/office"
echo "点击顶部标签切换到 SCR-02 或 SCR-03"
echo ""

echo "🎯 推荐操作顺序:"
echo "================================"
echo "1. 先测试 SCR-02 和 SCR-03（验证三屏架构功能）"
echo "2. 如果需要 SCR-01，执行方案 1（重启 Claw3D）"
echo "3. 如果还不行，执行方案 2（重启 Gateway）"
echo "4. 如果都不行，使用方案 3（Demo Gateway）"
echo ""

