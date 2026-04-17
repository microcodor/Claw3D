# SCR-02 快速参考指南

## 🚀 快速开始

### 启动开发服务器
```bash
cd Claw3D
npm run dev
```

### 访问 SCR-02
- **主应用**: http://localhost:3000/office → 选择 "SCR-02 舆情分析中心"
- **独立页面**: http://localhost:3000/sentiment-analysis

---

## 📁 文件结构

```
src/features/trending-center-v2/
├── screens/
│   └── TrendingCenterScreenV2.tsx          # 主屏幕组件
├── components/
│   ├── PlatformComparison/                 # 全平台对比 + 热搜榜
│   ├── HeatMap/                            # 热力图
│   ├── SentimentAnalysis/                  # 情感分析
│   ├── AlertSystem/                        # 预警系统
│   ├── TopicNetwork/                       # 话题网络
│   └── AudienceProfile/                    # 人群画像
├── services/
│   └── mockDataGenerator.ts               # 模拟数据生成器
├── types/
│   └── index.ts                           # TypeScript 类型定义
└── styles/
    └── trending-center-v2.module.css      # 主样式文件
```

---

## 🎨 6 大核心组件

### 1. PlatformComparison - 全平台热度对比
**位置**: 左列第1行  
**文件**: `components/PlatformComparison/`

**功能**:
- 10个平台热度对比
- 实时热搜榜（前20条）
- 自动滚动

**数据结构**:
```typescript
interface PlatformData {
  platform: string;
  icon: string;
  heat: number;
  count: number;
  trend: number;
  topics: Array<{
    title: string;
    heat: number;
    delta: number;
  }>;
}
```

---

### 2. HeatMap - 热力图
**位置**: 左列第2行  
**文件**: `components/HeatMap/`

**功能**:
- 24小时热度分布
- 平台×时段热力图

**数据结构**:
```typescript
interface HeatMapData {
  platform: string;
  hour: number;
  value: number;
}
```

---

### 3. SentimentAnalysis - 情感分析
**位置**: 中列第1行  
**文件**: `components/SentimentAnalysis/`

**功能**:
- 情感占比
- 情感趋势
- 高频关键词

**数据结构**:
```typescript
interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  trend: Array<{
    time: string;
    positive: number;
    neutral: number;
    negative: number;
  }>;
  keywords: Array<{
    word: string;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
}
```

---

### 4. TopicNetwork - 话题网络
**位置**: 中列第2行  
**文件**: `components/TopicNetwork/`

**功能**:
- 话题关联网络图
- 节点大小表示热度
- 连线表示关联强度

**数据结构**:
```typescript
interface TopicNetworkData {
  nodes: Array<{
    id: string;
    name: string;
    value: number;
    category: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
  }>;
}
```

---

### 5. AlertSystem - 预警系统
**位置**: 右列第1行  
**文件**: `components/AlertSystem/`

**功能**:
- 风险预警
- 机会预警
- 预警等级

**数据结构**:
```typescript
interface Alert {
  id: string;
  type: 'risk' | 'opportunity';
  level: 'high' | 'medium' | 'low';
  topic: string;
  reason: string;
  metrics: {
    sentiment?: number;
    speed?: number;
    reach?: number;
  };
  suggestion: string;
  timestamp: Date;
}
```

---

### 6. AudienceProfile - 人群画像
**位置**: 右列第2行  
**文件**: `components/AudienceProfile/`

**功能**:
- 年龄分布
- 性别比例
- 地域分布
- 兴趣标签

**数据结构**:
```typescript
interface AudienceProfileData {
  age: Array<{ range: string; value: number }>;
  gender: { male: number; female: number };
  location: Array<{ city: string; value: number }>;
  interests: Array<{ tag: string; value: number }>;
}
```

---

## 🎯 布局系统

### CSS Grid 主布局
```css
.mainContent {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3列 */
  grid-template-rows: 1fr 1fr;         /* 2行 */
  gap: 10px;
  height: calc(100vh - 20px);
  overflow: hidden;
}
```

### 组件自适应
```css
.component {
  flex: 1;              /* 自动填充 */
  min-height: 0;        /* 允许收缩 */
  overflow: hidden;     /* 禁止溢出 */
}

.componentContent {
  flex: 1;
  overflow-y: auto;     /* 内部滚动 */
}
```

---

## 🎨 样式规范

### 颜色
```css
/* 主色 */
--primary: #ff9500;
--background: #0e0a04;
--border: rgba(255, 149, 0, 0.2);

/* 数据颜色 */
--positive: #4ade80;
--neutral: rgba(255, 255, 255, 0.6);
--negative: #f87171;
--warning: #dc2626;
```

### 字体
```css
/* 字号 */
--title: 13px;
--body: 10px;
--small: 9px;

/* 字重 */
--bold: 700;
--semibold: 600;
--normal: 400;
```

### 间距
```css
/* 外边距/内边距 */
--container: 10px;
--component: 10px;
--card: 6px;

/* 圆角 */
--radius-lg: 8px;
--radius-md: 6px;
--radius-sm: 4px;
```

---

## 🔧 常用操作

### 修改数据更新频率
```typescript
// TrendingCenterScreenV2.tsx
useEffect(() => {
  const interval = setInterval(() => {
    // 更新数据
  }, 30000); // 30秒 → 修改这里
  return () => clearInterval(interval);
}, []);
```

### 修改热搜滚动速度
```typescript
// PlatformComparison.tsx
useEffect(() => {
  const scrollInterval = setInterval(() => {
    scrollRef.current.scrollTop += 1; // 1px → 修改这里
  }, 50); // 50ms → 修改这里
  return () => clearInterval(scrollInterval);
}, []);
```

### 修改显示的热搜数量
```typescript
// PlatformComparison.tsx
const trendingList = useMemo(() => {
  return data
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 20); // 20条 → 修改这里
}, [data]);
```

### 修改主题颜色
```css
/* trending-center-v2.module.css */
.container {
  background: linear-gradient(
    135deg,
    #0e0a04 0%,    /* 修改这里 */
    #1a1410 50%,   /* 修改这里 */
    #0e0a04 100%   /* 修改这里 */
  );
}
```

---

## 🐛 常见问题

### Q: 组件高度不对？
**A**: 检查以下 CSS:
```css
.component {
  flex: 1;          /* 必须 */
  min-height: 0;    /* 必须 */
  overflow: hidden; /* 必须 */
}
```

### Q: 滚动不工作？
**A**: 检查父容器:
```css
.parent {
  overflow: hidden; /* 父容器禁止滚动 */
}

.child {
  overflow-y: auto; /* 子元素允许滚动 */
}
```

### Q: 网格布局错乱？
**A**: 检查 grid 设置:
```css
.mainContent {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px;
}
```

### Q: 自动滚动不暂停？
**A**: 检查事件监听:
```typescript
onMouseEnter={() => setIsPaused(true)}
onMouseLeave={() => setIsPaused(false)}
```

---

## 📊 性能优化

### 1. 使用 React.memo
```typescript
export default React.memo(PlatformComparison);
```

### 2. 使用 useMemo
```typescript
const trendingList = useMemo(() => {
  return data.sort(...).slice(0, 20);
}, [data]);
```

### 3. 使用 useCallback
```typescript
const handleScroll = useCallback(() => {
  // 处理滚动
}, []);
```

### 4. 懒加载图表
```typescript
const ECharts = lazy(() => import('echarts-for-react'));
```

---

## 🧪 测试

### TypeScript 类型检查
```bash
npm run typecheck
```

### ESLint 代码检查
```bash
npm run lint
```

### 构建测试
```bash
npm run build
```

---

## 📝 开发流程

### 1. 添加新组件
```bash
# 创建组件目录
mkdir src/features/trending-center-v2/components/NewComponent

# 创建文件
touch src/features/trending-center-v2/components/NewComponent/NewComponent.tsx
touch src/features/trending-center-v2/components/NewComponent/NewComponent.module.css
touch src/features/trending-center-v2/components/NewComponent/index.ts
```

### 2. 组件模板
```typescript
// NewComponent.tsx
'use client';

import React from 'react';
import styles from './NewComponent.module.css';

interface NewComponentProps {
  data: any;
}

export default function NewComponent({ data }: NewComponentProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>新组件</h3>
      </div>
      <div className={styles.content}>
        {/* 内容 */}
      </div>
    </div>
  );
}
```

### 3. 样式模板
```css
/* NewComponent.module.css */
.container {
  background: rgba(14, 10, 4, 0.7);
  border: 1px solid rgba(255, 149, 0, 0.2);
  border-radius: 8px;
  padding: 10px;
  backdrop-filter: blur(10px);
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.title {
  font-size: 13px;
  font-weight: bold;
  color: #ff9500;
  margin: 0;
}

.content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
```

### 4. 集成到主屏幕
```typescript
// TrendingCenterScreenV2.tsx
import NewComponent from '../components/NewComponent';

// 在布局中添加
<NewComponent data={newData} />
```

---

## 🔗 相关文档

- **完整总结**: `SCR02_FINAL_SUMMARY.md`
- **布局图**: `SCR02_LAYOUT_DIAGRAM.md`
- **优化记录**: `SCR02_LAYOUT_FIT_OPTIMIZATION.md`
- **开发状态**: `SCR02_DEVELOPMENT_STATUS.md`
- **升级计划**: `SCR02_UPGRADE_PLAN.md`

---

## 💡 最佳实践

### 1. 组件设计
- ✅ 单一职责
- ✅ 可复用
- ✅ 类型安全
- ✅ 性能优化

### 2. 样式编写
- ✅ CSS Modules
- ✅ 语义化类名
- ✅ 响应式设计
- ✅ 统一规范

### 3. 数据处理
- ✅ 类型定义
- ✅ 数据验证
- ✅ 错误处理
- ✅ 缓存优化

### 4. 性能优化
- ✅ React.memo
- ✅ useMemo/useCallback
- ✅ 懒加载
- ✅ 虚拟滚动

---

## 🎓 学习资源

### CSS Grid
- [MDN: CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [CSS Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

### Flexbox
- [MDN: Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [CSS Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

### React Performance
- [React Docs: Optimizing Performance](https://react.dev/learn/render-and-commit)
- [React Docs: useMemo](https://react.dev/reference/react/useMemo)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 📞 支持

如有问题或建议，请：
1. 查看相关文档
2. 检查代码注释
3. 运行类型检查和 lint
4. 查看浏览器控制台

---

**版本**: V1.0  
**更新时间**: 2026-04-17  
**维护者**: Kiro AI Assistant

**Happy Coding! 🚀**
