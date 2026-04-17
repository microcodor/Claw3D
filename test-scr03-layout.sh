#!/bin/bash

echo "🎨 SCR-03 布局调整验证"
echo "================================"
echo ""

# 检查开发服务器是否运行
CLAW3D_PID=$(lsof -ti :3000 2>/dev/null)

if [ -z "$CLAW3D_PID" ]; then
    echo "⚠️ Claw3D 服务器未运行"
    echo ""
    echo "请先启动开发服务器："
    echo "  npm run dev"
    echo ""
    exit 1
fi

echo "✅ Claw3D 服务器运行中 (PID: $CLAW3D_PID)"
echo ""

echo "📋 新布局说明"
echo "================================"
echo ""
echo "布局结构："
echo "  ┌──────────────────────────┬──────────────┐"
echo "  │  INPUT · 智能选题         │              │"
echo "  │  (左侧顶部)              │  PROCESS ·   │"
echo "  ├──────────────────────────┤  推理过程    │"
echo "  │                          │              │"
echo "  │  OUTPUT · AI 生成内容     │  (右侧全高)  │"
echo "  │  (左侧主体，占大部分)     │              │"
echo "  │                          │              │"
echo "  └──────────────────────────┴──────────────┘"
echo "       左侧 (70%)              右侧 (30%)"
echo ""

echo "🎯 测试步骤"
echo "================================"
echo ""
echo "1. 访问页面："
echo "   http://localhost:3000/office"
echo ""
echo "2. 切换到 SCR-03："
echo "   点击顶部 \"SCR-03 创作工作室\" 标签"
echo ""
echo "3. 观察布局："
echo "   ✓ 左侧应该占据大部分宽度（约 70%）"
echo "   ✓ 右侧推理过程应该占据约 30% 宽度"
echo "   ✓ INPUT 在左上角"
echo "   ✓ OUTPUT 在左下方（主要内容区）"
echo "   ✓ PROCESS 在右侧（全高）"
echo ""
echo "4. 等待自动演示："
echo "   ✓ 3 秒后自动开始"
echo "   ✓ INPUT 显示用户消息"
echo "   ✓ PROCESS 显示 4 步推理动画"
echo "   ✓ OUTPUT 显示打字机效果输出"
echo ""
echo "5. 验证功能："
echo "   ✓ 粒子动画效果"
echo "   ✓ 推理步骤旋转动画"
echo "   ✓ 打字机光标闪烁"
echo "   ✓ 视频生成指示器"
echo "   ✓ 20 秒后自动循环"
echo ""

echo "💡 提示"
echo "================================"
echo ""
echo "如果布局不正确："
echo "  1. 硬刷新浏览器: Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows)"
echo "  2. 清除浏览器缓存"
echo "  3. 重启开发服务器: Ctrl+C 然后 npm run dev"
echo ""

echo "📚 相关文档"
echo "================================"
echo ""
echo "  - SCR-03布局调整说明.md - 详细的布局说明"
echo "  - QUICK_START_三屏架构.md - 快速启动指南"
echo "  - THREE_SCREEN_INTEGRATION_COMPLETE.md - 完整功能文档"
echo ""

echo "🎉 准备就绪！"
echo "================================"
echo ""
echo "现在可以在浏览器中测试新布局了。"
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
echo "✨ 享受新布局！"

