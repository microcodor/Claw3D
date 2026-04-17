# SCR-03 左列布局调整 - 50/50 等分

## 修改内容

### 确保左列组件严格50/50分配
- **创作队列 (TaskQueue)**: 占左列高度的 **50%**
- **热点灵感 (HotInspirations)**: 占左列高度的 **50%**

## 修改的文件

### CreationStudioScreenV2.tsx
为左列的两个 motion.div 添加 flex 样式：

```tsx
{/* 左列 */}
<div className={styles.leftColumn}>
  {/* 创作队列 - 50% */}
  <motion.div
    {...ANIMATION_CONFIG.slideIn}
    transition={{ ...ANIMATION_CONFIG.slideIn.transition, delay: 0.1 }}
    style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
  >
    <TaskQueue ... />
  </motion.div>

  {/* 热点灵感 - 50% */}
  <motion.div
    {...ANIMATION_CONFIG.slideIn}
    transition={{ ...ANIMATION_CONFIG.slideIn.transition, delay: 0.2 }}
    style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
  >
    <HotInspirations ... />
  </motion.div>
</div>
```

### CSS 文件（已确认）
- `TaskQueue.module.css`: `.container { flex: 1 1 0; }` ✅
- `HotInspirations.module.css`: `.container { flex: 1 1 0; }` ✅

## 完整布局结构

```
┌─────────────────────────────────────────────────────────────┐
│  控制栏 [SCR-01] [SCR-02] [SCR-03*] [布局切换]              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐  ┌────────────────┐  ┌──────────┐            │
│  │          │  │                │  │          │            │
│  │ 创作队列 │  │                │  │ 创作统计 │  ← 自适应   │
│  │          │  │                │  │          │            │
│  │  (50%)   │  │                │  │ (auto)   │            │
│  ├──────────┤  │  实时生成区    │  ├──────────┤            │
│  │          │  │                │  │          │            │
│  │ 热点灵感 │  │   (100%)       │  │          │            │
│  │          │  │                │  │ 创作历史 │  ← 占满剩余 │
│  │  (50%)   │  │                │  │          │            │
│  │          │  │                │  │ (flex:1) │            │
│  └──────────┘  └────────────────┘  └──────────┘            │
│     30%             40%                30%                   │
└─────────────────────────────────────────────────────────────┘
```

## 布局策略总结

### 左列（30%宽度）
- **创作队列**: `flex: 1 1 0` → 严格 50%
- **热点灵感**: `flex: 1 1 0` → 严格 50%
- 两个组件之间有 12px 间隙

### 中列（40%宽度）
- **实时生成区**: `flex: 1 1 0` → 100%
- 占满整个中列

### 右列（30%宽度）
- **创作统计**: `flexShrink: 0` → 自适应高度（约20-30%）
- **创作历史**: `flex: 1` → 占满剩余空间（约70-80%）
- 两个组件之间有 12px 间隙

## 技术要点

### flex: 1 1 0 的作用
- **第一个值 (1)**: flex-grow - 允许增长
- **第二个值 (1)**: flex-shrink - 允许收缩
- **第三个值 (0)**: flex-basis - **关键！** 忽略内容尺寸，严格按比例分配

### 为什么需要在 motion.div 上设置样式
1. **motion.div 是容器**: 它包裹着实际的组件
2. **flex 需要在直接子元素上**: 父容器（leftColumn）的 flex 布局作用于直接子元素（motion.div）
3. **传递给内部组件**: motion.div 设置 `display: flex`，让内部组件的 `flex: 1 1 0` 生效

### 布局层级
```
.leftColumn (display: flex, flex-direction: column, height: 100%)
├── motion.div (flex: 1 1 0, display: flex) ← 50%
│   └── TaskQueue.container (flex: 1 1 0)
└── motion.div (flex: 1 1 0, display: flex) ← 50%
    └── HotInspirations.container (flex: 1 1 0)
```

## 测试步骤

1. 启动开发服务器
   ```bash
   npm run dev
   ```

2. 访问 http://localhost:3000/office

3. 点击 **"SCR-03"** 标签

4. 验证左列布局：
   - ✅ 创作队列占左列高度的正好 50%
   - ✅ 热点灵感占左列高度的正好 50%
   - ✅ 两个组件之间有 12px 间隙
   - ✅ 无论内容多少，高度始终保持 50/50

## 预期效果

- 创作队列和热点灵感高度完全相等
- 两个组件底部对齐（考虑12px间隙）
- 布局稳定，不受内容变化影响
- 视觉上平衡美观

---

**修改日期**: 2026-04-17  
**状态**: ✅ 完成
