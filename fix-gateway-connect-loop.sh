#!/bin/bash

# Gateway 连接功能无限循环修复脚本
# 修复 page.tsx 和 OfficeScreen.tsx 中的依赖问题

set -e

echo "🔧 修复 Gateway 连接功能无限循环问题..."
echo ""

# 1. 停止开发服务器
echo "1️⃣ 停止开发服务器..."
if lsof -ti :3000 > /dev/null 2>&1; then
  echo "   发现端口 3000 上的进程，正在停止..."
  lsof -ti :3000 | xargs kill -9 2>/dev/null || true
  sleep 2
  echo "   ✅ 开发服务器已停止"
else
  echo "   ℹ️  端口 3000 上没有运行的进程"
fi

# 2. 清除 Next.js 缓存
echo ""
echo "2️⃣ 清除 Next.js 缓存..."
if [ -d ".next/cache" ]; then
  rm -rf .next/cache
  echo "   ✅ 已删除 .next/cache"
else
  echo "   ℹ️  .next/cache 不存在"
fi

if [ -d ".next/server" ]; then
  rm -rf .next/server
  echo "   ✅ 已删除 .next/server"
else
  echo "   ℹ️  .next/server 不存在"
fi

# 3. 验证修复
echo ""
echo "3️⃣ 验证修复..."
if grep -q "useMemo.*createStudioSettingsCoordinator" src/app/office/page.tsx; then
  echo "   ✅ page.tsx 修复已应用（useMemo）"
else
  echo "   ⚠️  警告：page.tsx 修复可能未正确应用"
fi

if grep -q "const isManuallyOpened" src/features/office/screens/OfficeScreen.tsx; then
  echo "   ✅ OfficeScreen.tsx 修复已应用（isManuallyOpened）"
else
  echo "   ⚠️  警告：OfficeScreen.tsx 修复可能未正确应用"
fi

# 4. 重新启动开发服务器
echo ""
echo "4️⃣ 重新启动开发服务器..."
echo "   运行: npm run dev"
echo ""
echo "✅ 修复完成！"
echo ""
echo "📋 验证步骤："
echo "   1. 打开浏览器控制台"
echo "   2. 访问应用"
echo "   3. 检查是否还有 'Maximum update depth exceeded' 错误"
echo "   4. 测试连接按钮功能"
echo "   5. 测试自动连接功能"
echo ""
echo "📚 详细说明请查看: Gateway自动连接功能说明.md"
