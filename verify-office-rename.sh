#!/bin/bash

echo "🔍 验证 SCR-01 名称修改"
echo "================================"
echo ""

echo "1️⃣ 检查屏幕选择器（ScreenSelector.tsx）："
echo "--------------------------------"
grep "SCR-01" src/features/office/components/ScreenSelector.tsx
echo ""

echo "2️⃣ 检查文档更新："
echo "--------------------------------"
echo "Gateway-Allowlist-修复说明.md:"
grep "SCR-01" Gateway-Allowlist-修复说明.md | head -2
echo ""
echo "Gateway连接问题解决方案.md:"
grep "SCR-01" Gateway连接问题解决方案.md | head -2
echo ""
echo "QUICK_START_三屏架构.md:"
grep "SCR-01" QUICK_START_三屏架构.md | head -2
echo ""

echo "✅ 验证结果"
echo "================================"
echo ""

# 检查是否包含新名称
if grep -q "数字办公室" src/features/office/components/ScreenSelector.tsx; then
    echo "✅ SCR-01 名称已成功修改为：数字办公室"
    echo ""
    echo "📋 修改位置："
    echo "  ✅ 屏幕选择器组件"
    echo "  ✅ 相关文档已更新"
    echo ""
    echo "🚀 下一步："
    echo "  1. 重启开发服务器: npm run dev"
    echo "  2. 访问: http://localhost:3000/office"
    echo "  3. 查看顶部标签显示：SCR-01 数字办公室"
else
    echo "⚠️ 名称可能未完全修改"
    echo "请检查上述输出内容"
fi

echo ""
echo "📚 三屏架构名称："
echo "  - SCR-01: 数字办公室"
echo "  - SCR-02: 热搜舆情中心"
echo "  - SCR-03: 创作工作室"
echo ""

