#!/bin/bash

echo "🔧 修复 Claw3D Gateway Token 配置"
echo "================================"
echo ""

# 获取 OpenClaw Gateway token
echo "1️⃣ 获取 OpenClaw Gateway token..."
TOKEN=$(openclaw config get gateway.auth.token 2>&1 | grep -v "🦞" | grep -v "OpenClaw" | grep -v "^$" | tail -1)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "__OPENCLAW_REDACTED__" ]; then
    echo "⚠️ 无法自动获取 token（被隐藏）"
    echo ""
    echo "请手动执行以下步骤："
    echo "1. 运行: openclaw config get gateway.auth.token"
    echo "2. 复制显示的 token"
    echo "3. 编辑 .env 文件"
    echo "4. 设置: CLAW3D_GATEWAY_TOKEN=你的token"
    echo "5. 重启 Claw3D: Ctrl+C 然后 npm run dev"
    exit 1
fi

echo "✅ Token 获取成功"
echo ""

# 备份 .env
echo "2️⃣ 备份 .env 文件..."
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ 备份完成"
echo ""

# 更新 .env
echo "3️⃣ 更新 .env 文件..."
if grep -q "^CLAW3D_GATEWAY_TOKEN=" .env; then
    # 替换现有行
    sed -i.tmp "s|^CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=$TOKEN|" .env
    rm -f .env.tmp
else
    # 添加新行
    echo "CLAW3D_GATEWAY_TOKEN=$TOKEN" >> .env
fi
echo "✅ .env 已更新"
echo ""

# 验证
echo "4️⃣ 验证配置..."
if grep -q "^CLAW3D_GATEWAY_TOKEN=.\\+" .env; then
    echo "✅ Token 已成功配置到 .env"
else
    echo "❌ Token 配置失败"
    exit 1
fi
echo ""

echo "🎉 修复完成！"
echo "================================"
echo ""
echo "下一步："
echo "1. 重启 Claw3D 服务器:"
echo "   - 按 Ctrl+C 停止当前服务器"
echo "   - 运行: npm run dev"
echo ""
echo "2. 刷新浏览器:"
echo "   - 按 Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows/Linux)"
echo ""
echo "3. 检查连接:"
echo "   - 应该能看到 Gateway 连接成功"
echo "   - SCR-01 应该能正常显示 Agent 数据"
echo ""
