#!/bin/bash

echo "🔍 Claw3D Gateway 连接诊断"
echo "================================"
echo ""

# 1. 检查 OpenClaw Gateway 状态
echo "1️⃣ OpenClaw Gateway 状态:"
openclaw gateway status 2>&1 | grep -E "Service:|Command:|File logs:" || echo "❌ OpenClaw 未安装或未运行"
echo ""

# 2. 检查端口监听
echo "2️⃣ 端口 18789 监听状态:"
lsof -i :18789 2>/dev/null | grep LISTEN || echo "❌ 端口 18789 没有进程监听"
echo ""

# 3. 检查 Claw3D 服务器
echo "3️⃣ Claw3D 服务器状态:"
ps aux | grep "node server/index.js" | grep -v grep || echo "❌ Claw3D 服务器未运行"
echo ""

# 4. 检查端口 3000
echo "4️⃣ 端口 3000 监听状态:"
lsof -i :3000 2>/dev/null | grep LISTEN || echo "❌ 端口 3000 没有进程监听"
echo ""

# 5. 测试 Gateway HTTP 端点
echo "5️⃣ 测试 Gateway HTTP 端点:"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:18789 2>&1
echo ""

# 6. 测试 Claw3D Studio API
echo "6️⃣ 测试 Claw3D Studio API:"
curl -s http://localhost:3000/api/studio | jq -r '.settings.gateway | "URL: \(.url)\nAdapter: \(.adapterType)\nToken配置: \(.tokenConfigured)"' 2>/dev/null || echo "❌ 无法访问 Studio API"
echo ""

# 7. 检查 .env 配置
echo "7️⃣ .env Gateway 配置:"
grep -E "GATEWAY_URL|GATEWAY_TOKEN|GATEWAY_ADAPTER" .env | grep -v "^#" || echo "⚠️ 未找到 Gateway 配置"
echo ""

# 8. 检查 Gateway token
echo "8️⃣ OpenClaw Gateway Token:"
TOKEN=$(openclaw config get gateway.auth.token 2>&1)
if [ "$TOKEN" = "__OPENCLAW_REDACTED__" ]; then
    echo "✅ Token 已配置（已隐藏）"
else
    echo "❌ Token 未配置或获取失败"
fi
echo ""

# 9. 建议
echo "💡 诊断建议:"
echo "================================"

# 检查是否所有服务都在运行
GATEWAY_RUNNING=$(lsof -i :18789 2>/dev/null | grep LISTEN | wc -l)
CLAW3D_RUNNING=$(lsof -i :3000 2>/dev/null | grep LISTEN | wc -l)

if [ "$GATEWAY_RUNNING" -eq 0 ]; then
    echo "❌ OpenClaw Gateway 未运行"
    echo "   解决方案: openclaw gateway start"
elif [ "$CLAW3D_RUNNING" -eq 0 ]; then
    echo "❌ Claw3D 服务器未运行"
    echo "   解决方案: npm run dev"
else
    echo "✅ 所有服务都在运行"
    echo ""
    echo "如果仍然无法连接，可能的原因："
    echo "1. WebSocket 代理超时 - 尝试重启 Claw3D: Ctrl+C 然后 npm run dev"
    echo "2. Token 不匹配 - 检查 .env 中的 CLAW3D_GATEWAY_TOKEN"
    echo "3. 浏览器缓存 - 清除浏览器缓存或使用无痕模式"
    echo "4. 防火墙阻止 - 检查防火墙设置"
    echo ""
    echo "🎯 快速解决方案："
    echo "   1. 重启 Claw3D: Ctrl+C 然后 npm run dev"
    echo "   2. 刷新浏览器: Cmd+Shift+R (硬刷新)"
    echo "   3. 如果还不行，尝试切换到 SCR-02 或 SCR-03（不需要 Gateway）"
fi
echo ""

echo "🎨 三屏架构功能测试:"
echo "================================"
echo "✅ SCR-02 (热搜舆情中心) - 不需要 Gateway，可直接使用"
echo "✅ SCR-03 (创作工作室) - 不需要 Gateway，可直接使用"
echo "⚠️ SCR-01 (Claw3D Office) - 需要 Gateway 连接"
echo ""
echo "💡 建议: 先测试 SCR-02 和 SCR-03，它们不依赖 Gateway"
