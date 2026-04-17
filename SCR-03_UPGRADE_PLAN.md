# SCR-03 创作工作室升级开发计划

## 📅 制定日期
2026年4月17日

---

## 🎯 升级目标

将 SCR-03 从简单的 Mock 演示升级为**完整的 AI 内容生成工作流系统**，参考 SCR-02 V2 的升级思路，打造一个数据驱动、功能完整、交互丰富的创作工作室。

---

## 📊 当前状态分析

### 现有功能
- ✅ Mock 消息自动播放（3条预设消息）
- ✅ 思考过程可视化（4步推理动画）
- ✅ 打字机效果输出
- ✅ 粒子动画效果
- ✅ 左右两栏布局（INPUT+OUTPUT | PROCESS）

### 存在问题
- ❌ 数据完全 Mock，无真实数据源
- ❌ 功能单一，只有简单的演示流程
- ❌ 缺少用户交互，无法手动触发
- ❌ 没有历史记录和任务管理
- ❌ 缺少数据统计和可视化
- ❌ 没有与 OpenClaw 集成

---

## 🎨 升级设计理念

### 核心定位
**AI 内容创作全流程工作台**
- 从选题策划到内容生成
- 从文本创作到多媒体制作
- 从单次生成到批量生产

### 设计原则
1. **数据驱动** - 真实数据源，实时更新
2. **工作流完整** - 覆盖创作全流程
3. **交互丰富** - 支持手动操作和自动化
4. **可视化强** - 数据图表和过程展示
5. **一屏适配** - 所有内容在一屏内完整展示

### 参考 SCR-02 V2 的成功经验
- ✅ 组件化架构（6个核心组件）
- ✅ 真实数据源（hotspotService）
- ✅ 状态管理（React hooks）
- ✅ 自动更新（30秒轮询）
- ✅ 动画效果（framer-motion）
- ✅ 响应式布局（CSS Grid/Flexbox）

---

## 🏗️ 架构设计

### 三列布局

```
┌─────────────────────────────────────────────────────────────┐
│                    SCR-03 创作工作室                          │
├─────────────┬─────────────────────┬─────────────────────────┤
│   左列      │      中列           │        右列              │
│  (30%)      │     (40%)           │       (30%)              │
├─────────────┼─────────────────────┼─────────────────────────┤
│             │                     │                         │
│ 1. 创作任务 │  3. 实时生成区      │  5. 创作统计            │
│    队列     │     - 当前任务      │     - 今日产出          │
│             │     - 思考过程      │     - 任务完成率        │
│             │     - 流式输出      │     - 内容类型分布      │
│             │     - 进度条        │                         │
│             │                     │                         │
│ 2. 快速选题 │  4. 历史记录        │  6. 热点灵感            │
│    - 热点   │     - 最近生成      │     - 实时热搜          │
│    - 节日   │     - 任务历史      │     - 话题推荐          │
│    - 行业   │     - 收藏内容      │     - 关键词云          │
│             │                     │                         │
└─────────────┴─────────────────────┴─────────────────────────┘
```

---

## 📦 核心组件设计

### 1. TaskQueue（创作任务队列）
**位置**: 左上
**功能**:
- 显示待处理任务列表（最多5个）
- 任务状态：等待中、生成中、已完成、失败
- 支持手动添加任务
- 支持任务优先级调整
- 支持任务删除和重试

**数据结构**:
```typescript
interface CreationTask {
  id: string;
  title: string;           // 任务标题
  type: 'article' | 'video' | 'social' | 'ad';  // 内容类型
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;        // 优先级 1-5
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  prompt: string;          // 用户输入
  output?: string;         // 生成结果
  metadata?: {
    wordCount?: number;
    duration?: number;     // 生成耗时
    model?: string;        // 使用的模型
  };
}
```

**UI 设计**:
- 列表项显示：图标 + 标题 + 状态徽章
- 进行中的任务高亮显示
- 支持拖拽排序
- 悬停显示详细信息

---

### 2. QuickTopics（快速选题）
**位置**: 左下
**功能**:
- 热点选题：从 SCR-02 获取热门话题
- 节日选题：根据日期推荐节日相关主题
- 行业选题：预设的行业话题模板
- 一键生成：点击即可创建任务

**数据来源**:
- 热点数据：复用 SCR-02 的 hotspotService
- 节日数据：本地日历数据
- 行业模板：预设 JSON 配置

**UI 设计**:
- 标签页切换（热点/节日/行业）
- 卡片式展示，每个选题一个卡片
- 显示话题标题、热度、推荐理由
- 点击按钮快速创建任务

---

### 3. GenerationPanel（实时生成区）
**位置**: 中上（核心区域）
**功能**:
- 显示当前正在生成的任务
- 思考过程可视化（保留现有的4步动画）
- 流式输出显示（打字机效果）
- 进度条和状态指示
- 生成完成后显示操作按钮（复制、保存、重新生成）

**增强功能**:
- 支持暂停/继续生成
- 支持中途修改参数
- 显示生成速度（字/秒）
- 显示预计剩余时间

**UI 设计**:
- 大标题显示任务名称
- 思考步骤横向排列
- 输出区域占据主要空间
- 底部显示进度条和操作按钮

---

### 4. HistoryPanel（历史记录）
**位置**: 中下
**功能**:
- 显示最近生成的内容（最多10条）
- 支持搜索和筛选
- 支持查看详情
- 支持收藏和删除
- 支持导出

**数据存储**:
- 使用 localStorage 或 IndexedDB
- 支持数据导入导出

**UI 设计**:
- 时间线式展示
- 每条记录显示：时间、标题、类型、状态
- 悬停显示预览
- 点击展开详情

---

### 5. CreationStats（创作统计）
**位置**: 右上
**功能**:
- 今日产出统计（任务数、字数、耗时）
- 任务完成率（饼图）
- 内容类型分布（柱状图）
- 生成速度趋势（折线图）

**数据可视化**:
- 使用 echarts 或 recharts
- 实时更新
- 支持时间范围切换（今日/本周/本月）

**UI 设计**:
- 卡片式布局
- 大数字显示关键指标
- 小图表展示趋势
- 使用渐变色和动画

---

### 6. HotInspirations（热点灵感）
**位置**: 右下
**功能**:
- 实时热搜话题（从 SCR-02 获取）
- 话题推荐（基于用户历史）
- 关键词云（热门关键词可视化）
- 点击话题快速创建任务

**数据来源**:
- 复用 SCR-02 的热搜数据
- 本地分析用户历史生成关键词

**UI 设计**:
- 滚动列表显示热搜
- 词云可视化
- 点击交互创建任务

---

## 🔧 技术实现

### 技术栈
```typescript
// 核心框架
- React 19
- TypeScript
- Next.js 16

// 状态管理
- React Hooks (useState, useEffect, useCallback, useMemo)
- Context API (可选，用于全局状态)

// 数据可视化
- echarts (图表)
- framer-motion (动画)
- react-spring (交互动画)

// 数据处理
- date-fns (日期处理)
- lodash (工具函数)

// 样式
- CSS Modules
- CSS Grid / Flexbox
```

### 目录结构
```
src/features/creation-studio-v2/
├── components/
│   ├── TaskQueue/
│   │   ├── TaskQueue.tsx
│   │   └── TaskQueue.module.css
│   ├── QuickTopics/
│   │   ├── QuickTopics.tsx
│   │   └── QuickTopics.module.css
│   ├── GenerationPanel/
│   │   ├── GenerationPanel.tsx
│   │   └── GenerationPanel.module.css
│   ├── HistoryPanel/
│   │   ├── HistoryPanel.tsx
│   │   └── HistoryPanel.module.css
│   ├── CreationStats/
│   │   ├── CreationStats.tsx
│   │   └── CreationStats.module.css
│   └── HotInspirations/
│       ├── HotInspirations.tsx
│       └── HotInspirations.module.css
├── screens/
│   └── CreationStudioScreenV2.tsx
├── services/
│   ├── creationService.ts      # 创作任务管理
│   ├── historyService.ts       # 历史记录管理
│   └── templateService.ts      # 模板管理
├── hooks/
│   ├── useCreationTask.ts      # 任务管理 hook
│   ├── useGenerationStream.ts  # 流式生成 hook
│   └── useCreationStats.ts     # 统计数据 hook
├── types/
│   └── index.ts                # 类型定义
├── utils/
│   ├── taskGenerator.ts        # 任务生成器
│   └── contentAnalyzer.ts      # 内容分析器
├── data/
│   ├── templates.ts            # 内容模板
│   ├── holidays.ts             # 节日数据
│   └── industries.ts           # 行业数据
└── styles/
    └── creation-studio-v2.module.css
```

---

## 📝 数据流设计

### 1. 任务创建流程
```
用户操作 → 创建任务 → 添加到队列 → 开始生成 → 流式输出 → 完成 → 保存历史
```

### 2. 数据更新流程
```
定时器(30s) → 更新统计数据 → 更新热点灵感 → 刷新 UI
```

### 3. 状态管理
```typescript
// 全局状态
interface CreationStudioState {
  tasks: CreationTask[];           // 任务队列
  currentTask: CreationTask | null; // 当前任务
  history: CreationTask[];         // 历史记录
  stats: CreationStats;            // 统计数据
  hotTopics: TrendingItem[];       // 热点话题
}

// 统计数据
interface CreationStats {
  today: {
    taskCount: number;
    wordCount: number;
    duration: number;
    completionRate: number;
  };
  typeDistribution: {
    article: number;
    video: number;
    social: number;
    ad: number;
  };
  speedTrend: Array<{
    time: string;
    speed: number;
  }>;
}
```

---

## 🎬 开发阶段

### Phase 1: 基础架构（2-3天）
**目标**: 搭建 V2 版本的基础框架

**任务**:
1. ✅ 创建目录结构
2. ✅ 定义类型系统
3. ✅ 创建主屏幕组件
4. ✅ 实现三列布局
5. ✅ 创建 6 个组件骨架

**验收标准**:
- 页面布局正确
- 组件结构清晰
- TypeScript 无错误

---

### Phase 2: 核心功能（3-4天）
**目标**: 实现核心创作功能

**任务**:
1. ✅ 实现 TaskQueue 组件
   - 任务列表展示
   - 任务状态管理
   - 添加/删除任务
2. ✅ 实现 GenerationPanel 组件
   - 思考过程动画
   - 流式输出效果
   - 进度显示
3. ✅ 实现任务生成逻辑
   - Mock 数据生成
   - 状态流转
   - 错误处理

**验收标准**:
- 可以创建任务
- 可以生成内容
- 流程完整

---

### Phase 3: 数据集成（2-3天）
**目标**: 集成真实数据源

**任务**:
1. ✅ 集成 SCR-02 热搜数据
   - 复用 hotspotService
   - 实现 QuickTopics 组件
   - 实现 HotInspirations 组件
2. ✅ 实现历史记录
   - HistoryPanel 组件
   - localStorage 存储
   - 搜索和筛选
3. ✅ 添加节日和行业数据
   - 节日日历
   - 行业模板

**验收标准**:
- 热搜数据正常显示
- 历史记录可保存
- 模板可使用

---

### Phase 4: 数据可视化（2-3天）
**目标**: 实现统计和可视化

**任务**:
1. ✅ 实现 CreationStats 组件
   - 今日统计
   - 完成率饼图
   - 类型分布柱状图
   - 速度趋势折线图
2. ✅ 实现数据计算逻辑
   - 统计算法
   - 实时更新
3. ✅ 优化图表样式
   - echarts 配置
   - 响应式适配

**验收标准**:
- 图表正确显示
- 数据实时更新
- 样式美观

---

### Phase 5: 交互优化（2天）
**目标**: 提升用户体验

**任务**:
1. ✅ 添加动画效果
   - 页面进入动画
   - 组件切换动画
   - 数据更新动画
2. ✅ 优化交互细节
   - 悬停效果
   - 点击反馈
   - 加载状态
3. ✅ 响应式适配
   - 不同分辨率测试
   - 布局自适应

**验收标准**:
- 动画流畅
- 交互自然
- 适配良好

---

### Phase 6: 测试和优化（1-2天）
**目标**: 确保质量和性能

**任务**:
1. ✅ 功能测试
   - 所有功能正常
   - 边界情况处理
   - 错误处理
2. ✅ 性能优化
   - 组件优化
   - 渲染优化
   - 内存优化
3. ✅ 代码审查
   - 代码规范
   - 注释完善
   - 文档更新

**验收标准**:
- 无明显 bug
- 性能良好
- 代码质量高

---

## 🎨 UI/UX 设计要点

### 视觉风格
- **主色调**: 橙色系（#ff9500）- 创作活力
- **辅助色**: 蓝色（#3b82f6）、绿色（#10b981）、紫色（#a855f7）
- **背景**: 深色半透明（rgba(14, 10, 4, 0.7)）
- **边框**: 发光效果（box-shadow）
- **字体**: 
  - 标题：14-16px，bold
  - 正文：11-12px，regular
  - 数据：12-14px，monospace

### 动画效果
- **进入动画**: fade + slide（0.5s）
- **切换动画**: fade + scale（0.3s）
- **数据更新**: number counting（1s）
- **粒子效果**: 生成时的背景动画

### 交互反馈
- **悬停**: 轻微放大 + 边框高亮
- **点击**: 按下效果 + 涟漪动画
- **加载**: 骨架屏 + 进度条
- **成功**: 绿色闪烁 + 勾选图标
- **失败**: 红色闪烁 + 错误提示

---

## 📊 数据模拟策略

### Mock 数据生成
在真实 API 集成前，使用 Mock 数据：

```typescript
// 任务生成器
function generateMockTask(): CreationTask {
  const types = ['article', 'video', 'social', 'ad'];
  const titles = [
    '春节营销方案策划',
    '产品发布会视频脚本',
    '社交媒体推广文案',
    '品牌广告创意',
  ];
  
  return {
    id: `task-${Date.now()}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    type: types[Math.floor(Math.random() * types.length)],
    status: 'pending',
    priority: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(),
    prompt: '生成一篇关于...',
  };
}

// 内容生成器
function generateMockContent(task: CreationTask): string {
  // 根据任务类型生成不同长度的内容
  const lengths = {
    article: 800,
    video: 500,
    social: 200,
    ad: 150,
  };
  
  const length = lengths[task.type];
  // 生成 Mock 内容...
}
```

---

## 🔌 API 集成计划

### 未来集成点
1. **OpenClaw Agent API**
   - 真实的内容生成
   - 流式输出
   - 模型选择

2. **热搜数据 API**
   - 已有：hotspotService
   - 直接复用 SCR-02 的数据

3. **用户数据 API**
   - 任务历史
   - 用户偏好
   - 统计数据

4. **模板库 API**
   - 内容模板
   - 行业模板
   - 自定义模板

---

## 📈 成功指标

### 功能完整性
- ✅ 6个核心组件全部实现
- ✅ 任务创建、生成、历史全流程
- ✅ 数据可视化完整
- ✅ 交互流畅自然

### 性能指标
- ✅ 首屏加载 < 2s
- ✅ 组件渲染 < 100ms
- ✅ 动画帧率 > 30fps
- ✅ 内存占用 < 100MB

### 用户体验
- ✅ 一屏内完整展示
- ✅ 无需滚动查看核心功能
- ✅ 操作响应及时
- ✅ 视觉效果出色

---

## 🚀 启动开发

### 准备工作
1. ✅ 阅读 SCR-02 V2 的代码
2. ✅ 理解组件化架构
3. ✅ 熟悉数据流设计
4. ✅ 准备开发环境

### 第一步
创建基础目录结构和类型定义

### 开发顺序
1. Phase 1: 基础架构
2. Phase 2: 核心功能
3. Phase 3: 数据集成
4. Phase 4: 数据可视化
5. Phase 5: 交互优化
6. Phase 6: 测试和优化

---

## 📚 参考资料

### 内部文档
- `SCR02_REFACTOR_SUMMARY.md` - SCR-02 V2 重构总结
- `TASK_COMPLETION_SUMMARY.md` - 任务完成总结
- `AUTO_SCROLL_FIX.md` - 自动滚动实现

### 代码参考
- `src/features/trending-center-v2/` - SCR-02 V2 实现
- `src/features/creation-studio/` - SCR-03 V1 实现

### 技术文档
- React 19 文档
- TypeScript 文档
- echarts 文档
- framer-motion 文档

---

## 💡 创新点

### 相比 V1 的提升
1. **数据驱动** - 从 Mock 到真实数据
2. **功能完整** - 从演示到完整工作流
3. **交互丰富** - 从自动播放到手动操作
4. **可视化强** - 添加统计图表
5. **集成深度** - 与 SCR-02 数据联动

### 独特功能
1. **热点灵感** - 从热搜直接创建任务
2. **快速选题** - 节日/行业模板一键生成
3. **任务队列** - 批量创作管理
4. **历史记录** - 内容复用和管理
5. **创作统计** - 数据分析和优化

---

## ⚠️ 注意事项

### 开发规范
1. 遵循 TypeScript 严格模式
2. 使用 CSS Modules 避免样式冲突
3. 组件保持单一职责
4. 代码注释清晰完整
5. 提交信息规范

### 性能优化
1. 使用 React.memo 避免不必要渲染
2. 使用 useMemo/useCallback 优化计算
3. 图表数据分页加载
4. 历史记录限制数量
5. 定时器正确清理

### 兼容性
1. 支持 Chrome/Edge/Firefox 最新版
2. 分辨率 1920x1080 及以上
3. 不支持移动端（大屏展示用）

---

## 📅 时间估算

### 总计: 12-17 天

- Phase 1: 2-3 天
- Phase 2: 3-4 天
- Phase 3: 2-3 天
- Phase 4: 2-3 天
- Phase 5: 2 天
- Phase 6: 1-2 天

### 里程碑
- **Day 3**: 基础架构完成
- **Day 7**: 核心功能完成
- **Day 10**: 数据集成完成
- **Day 13**: 可视化完成
- **Day 15**: 交互优化完成
- **Day 17**: 测试和发布

---

## ✅ 验收标准

### 功能验收
- [ ] 可以创建任务
- [ ] 可以生成内容
- [ ] 可以查看历史
- [ ] 可以查看统计
- [ ] 可以使用热点灵感
- [ ] 可以使用快速选题

### 质量验收
- [ ] TypeScript 无错误
- [ ] ESLint 无错误
- [ ] 构建成功
- [ ] 性能达标
- [ ] 视觉效果出色

### 文档验收
- [ ] 代码注释完整
- [ ] README 更新
- [ ] 开发文档完善
- [ ] 使用说明清晰

---

## 🎉 预期效果

### 用户体验
用户打开 SCR-03，看到一个完整的创作工作台：
1. 左侧可以快速创建任务
2. 中间实时看到生成过程
3. 右侧了解创作数据和热点
4. 所有功能一屏展示，无需滚动
5. 动画流畅，交互自然

### 技术亮点
1. 组件化架构清晰
2. 数据流设计合理
3. 性能优化到位
4. 代码质量高
5. 可维护性强

### 业务价值
1. 提升创作效率
2. 数据驱动决策
3. 热点快速响应
4. 内容批量生产
5. 工作流程完整

---

## 📞 支持和反馈

如有问题或建议，请：
1. 查看相关文档
2. 参考 SCR-02 V2 实现
3. 提交 Issue 或 PR

---

**制定人**: Kiro AI  
**日期**: 2026年4月17日  
**版本**: v1.0  
**状态**: 📋 计划中

---

**准备好开始了吗？让我们打造一个出色的创作工作室！** 🚀✨
