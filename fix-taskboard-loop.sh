#!/bin/bash

# useTaskBoardController 无限循环修复脚本
# 修复 useTaskBoardController.ts 中的数组引用依赖问题

set -e

echo "🔧 修复 useTaskBoardController 无限循环问题..."
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
if grep -q "prevAgentsRef" src/features/office/tasks/useTaskBoardController.ts; then
  echo "   ✅ 修复代码已应用"
else
  echo "   ⚠️  警告：修复代码可能未正确应用"
  echo "   请检查 src/features/office/tasks/useTaskBoardController.ts"
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
echo "   4. 观察屏幕是否还会闪烁"
echo "   5. 确认 agent 动画正常加载"
echo ""
echo "📚 详细说明请查看: useTaskBoardController无限循环修复说明.md"
