#!/bin/bash

echo "🔍 验证品牌标题修改"
echo "================================"
echo ""

echo "1️⃣ 检查浏览器标题（layout.tsx）："
echo "--------------------------------"
grep -A 2 "export const metadata" src/app/layout.tsx | grep "title"
echo ""

echo "2️⃣ 检查界面顶部标题（MultiScreenLayout.tsx）："
echo "--------------------------------"
grep "brand}" src/features/office/components/MultiScreenLayout.tsx
echo ""

echo "✅ 验证结果"
echo "================================"
echo ""

# 检查是否包含新标题
if grep -q "网络安全学堂·AI实验室" src/app/layout.tsx && \
   grep -q "网络安全学堂·AI实验室" src/features/office/components/MultiScreenLayout.tsx; then
    echo "✅ 品牌标题已成功修改为：网络安全学堂·AI实验室"
    echo ""
    echo "📋 修改位置："
    echo "  ✅ 浏览器标签标题"
    echo "  ✅ 界面顶部品牌标识"
    echo ""
    echo "🚀 下一步："
    echo "  1. 重启开发服务器: npm run dev"
    echo "  2. 访问: http://localhost:3000/office"
    echo "  3. 查看浏览器标签和界面顶部"
else
    echo "⚠️ 标题可能未完全修改"
    echo "请检查上述输出内容"
fi

echo ""
echo "📚 详细说明："
echo "  查看 品牌标题修改说明.md"
echo ""

