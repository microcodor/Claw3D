# SCR-02 舆情分析中心升级计划

## 版本信息
- **基线版本**: v1.0.0-baseline
- **开发分支**: feature/scr02-sentiment-analysis-center
- **目标版本**: v2.0.0-sentiment-analysis
- **开发日期**: 2026-04-17

## 一、升级目标

### 核心主旨
结合每天的互联网热搜数据，分析出全平台热搜倾向，舆论关注的点，指出正向的负面的信息。

### 当前问题
1. ❌ 数据展示单一 - 只是简单列表展示热搜
2. ❌ 缺少跨平台对比 - 没有体现"全平台热搜倾向"
3. ❌ 舆情分析浅显 - 只有简单的正负面标签
4. ❌ 时间维度缺失 - 没有展示热度变化趋势
5. ❌ 关联性不足 - 热搜之间的关联、话题演变没有体现

### 升级目标
1. ✅ 全平台热搜对比 - 多平台数据聚合和对比分析
2. ✅ 深度情感分析 - AI驱动的情感分析和趋势预测
3. ✅ 热力图可视化 - 24小时热度变化热力图
4. ✅ 话题关联网络 - 话题之间的关联关系图
5. ✅ 人群画像分析 - 关注人群的年龄、地域、活跃时段
6. ✅ 智能预警系统 - 风险话题预警和机会话题推荐

---

## 二、技术架构

### 2.1 技术栈
```json
{
  "可视化": {
    "ECharts": "^5.4.3 - 热力图、折线图、饼图",
    "D3.js": "^7.8.5 - 网络图、力导向图",
    "Canvas API": "原生 - 自定义动画效果"
  },
  "数据管理": {
    "React Query": "^5.0.0 - 数据获取和缓存",
    "Zustand": "^4.4.0 - 状态管理",
    "Immer": "^10.0.0 - 不可变数据"
  },
  "动画": {
    "Framer Motion": "^10.16.0 - 组件动画",
    "GSAP": "^3.12.0 - 复杂时间轴动画"
  },
  "工具": {
    "date-fns": "^2.30.0 - 时间处理",
    "lodash": "^4.17.21 - 数据处理",
    "color": "^4.2.3 - 颜色计算"
  }
}
```

### 2.2 文件结构
```
src/features/trending-center-v2/
├── screens/
│   └── TrendingCenterScreenV2.tsx          # 主屏幕
├── components/
│   ├── PlatformComparison/                 # 全平台对比
│   ├── HeatMap/                            # 热力图
│   ├── SentimentAnalysis/                  # 情感分析
│   ├── TopicNetwork/                       # 话题网络
│   ├── AudienceProfile/                    # 人群画像
│   ├── AlertSystem/                        # 预警系统
│   └── TrendingList/                       # 热搜列表
├── hooks/
│   ├── useTrendingData.ts                  # 数据获取
│   ├── useSentimentAnalysis.ts             # 情感分析
│   ├── useTopicNetwork.ts                  # 话题网络
│   ├── useRealTimeUpdate.ts                # 实时更新
│   └── useAlertSystem.ts                   # 预警系统
├── services/
│   ├── trendingApi.ts                      # API接口
│   ├── sentimentEngine.ts                  # 情感分析引擎
│   ├── networkAnalyzer.ts                  # 网络分析
│   └── alertEngine.ts                      # 预警引擎
├── types/
│   ├── trending.types.ts                   # 类型定义
│   ├── sentiment.types.ts
│   ├── network.types.ts
│   └── alert.types.ts
├── utils/
│   ├── dataTransform.ts                    # 数据转换
│   ├── colorScale.ts                       # 颜色计算
│   ├── timeUtils.ts                        # 时间工具
│   └── chartConfig.ts                      # 图表配置
└── styles/
    └── trending-center-v2.module.css       # 样式
```

---

## 三、核心功能模块

### 3.1 全平台对比面板
**优先级**: P0 (最高)
**预计工时**: 2天

**功能点**:
- [ ] 多平台热度条形图
- [ ] 平台主要类别标签
- [ ] 热度趋势指示器
- [ ] 共同热点识别
- [ ] 平台独特热点标记

**技术要点**:
- 使用 Framer Motion 实现动画
- 热度百分比相对于最高值计算
- 实时数据更新（30秒间隔）

**数据结构**:
```typescript
interface PlatformStats {
  platform: Platform;
  hotness: number;
  hotnessPercent: number;
  category: string;
  count: number;
  trend: number; // -100 to +100
}

interface CommonHotspot {
  topic: string;
  platformCount: number;
  platforms: string[];
}
```

---

### 3.2 热力图可视化
**优先级**: P0 (最高)
**预计工时**: 3天

**功能点**:
- [ ] 24小时热度热力图
- [ ] 类别×时间二维展示
- [ ] 当前爆发话题高亮
- [ ] 热度变化趋势线
- [ ] 交互式tooltip

**技术要点**:
- 使用 ECharts heatmap
- 颜色映射：冷色→暖色
- 自动识别爆发点（增长率>100%）

**数据结构**:
```typescript
interface HeatMapData {
  category: string;
  time: string; // HH:mm
  value: number; // 热度值
}

interface HotspotAlert {
  category: string;
  value: number;
  growthRate: number;
  timestamp: string;
}
```

---

### 3.3 情感分析仪表盘
**优先级**: P0 (最高)
**预计工时**: 3天

**功能点**:
- [ ] 正面/中性/负面分布条
- [ ] 情感趋势指示器
- [ ] 风险等级评估
- [ ] 正负面关键词云
- [ ] 情感变化曲线

**技术要点**:
- 情感分析算法（简化版或调用API）
- 关键词提取和分类
- 风险评分计算

**数据结构**:
```typescript
interface SentimentData {
  positive: number;    // 0-100
  neutral: number;     // 0-100
  negative: number;    // 0-100
  trend: 'up' | 'down' | 'stable';
  trendValue: number;  // 变化百分比
  riskLevel: 'low' | 'medium' | 'high';
  keywords: {
    positive: string[];
    negative: string[];
  };
  history: Array<{
    time: string;
    positive: number;
    negative: number;
  }>;
}
```

---

### 3.4 话题关联网络图
**优先级**: P1 (高)
**预计工时**: 4天

**功能点**:
- [ ] 力导向布局网络图
- [ ] 节点大小表示热度
- [ ] 边粗细表示关联强度
- [ ] 交互式节点点击
- [ ] 子话题展开/收起

**技术要点**:
- 使用 D3.js force simulation
- 话题关联算法（共现分析）
- 节点聚类和层级展示

**数据结构**:
```typescript
interface TopicNode {
  id: string;
  label: string;
  value: number;      // 热度
  category: string;
  level: number;      // 层级 0=核心 1=衍生 2=次级
}

interface TopicEdge {
  source: string;
  target: string;
  weight: number;     // 关联强度
}

interface TopicNetwork {
  nodes: TopicNode[];
  edges: TopicEdge[];
  centerNode: string; // 核心话题ID
}
```

---

### 3.5 人群画像分析
**优先级**: P1 (高)
**预计工时**: 2天

**功能点**:
- [ ] 年龄分布柱状图
- [ ] 地域分布热力地图
- [ ] 活跃时段曲线图
- [ ] 互动方式占比
- [ ] 用户画像标签

**技术要点**:
- 使用 ECharts 多种图表
- 地图可视化（可选）
- 数据聚合和统计

**数据结构**:
```typescript
interface AudienceProfile {
  ageDistribution: Array<{
    range: string;      // "18-25"
    percentage: number;
  }>;
  regionDistribution: Array<{
    region: string;
    percentage: number;
  }>;
  activeHours: Array<{
    hour: number;       // 0-23
    activity: number;   // 活跃度
  }>;
  interactionTypes: {
    share: number;
    comment: number;
    like: number;
  };
}
```

---

### 3.6 智能预警系统
**优先级**: P0 (最高)
**预计工时**: 3天

**功能点**:
- [ ] 高风险话题预警
- [ ] 中风险话题提示
- [ ] 机会话题推荐
- [ ] 预警级别分类
- [ ] 建议操作提示

**技术要点**:
- 风险评分算法
- 负面情绪激增检测
- 观点分化度计算
- 机会识别算法

**数据结构**:
```typescript
interface Alert {
  id: string;
  type: 'risk' | 'opportunity';
  level: 'high' | 'medium' | 'low';
  topic: string;
  reason: string;
  metrics: {
    negativeGrowth?: number;
    polarization?: number;
    positiveGrowth?: number;
  };
  suggestion: string;
  timestamp: string;
}
```

---

## 四、开发计划

### 第一阶段：基础架构 (2天)
**时间**: Day 1-2

- [ ] 创建文件结构
- [ ] 安装依赖包
- [ ] 定义TypeScript类型
- [ ] 创建基础组件框架
- [ ] 设置样式系统

**交付物**:
- 完整的文件结构
- 类型定义文件
- 基础组件骨架

---

### 第二阶段：核心功能 (6天)
**时间**: Day 3-8

#### Day 3-4: 全平台对比 + 热力图
- [ ] PlatformComparisonPanel 组件
- [ ] HeatMapChart 组件
- [ ] 数据转换工具
- [ ] Mock数据生成

#### Day 5-6: 情感分析 + 预警系统
- [ ] SentimentDashboard 组件
- [ ] AlertPanel 组件
- [ ] 情感分析引擎
- [ ] 预警算法

#### Day 7-8: 话题网络 + 人群画像
- [ ] TopicNetworkGraph 组件
- [ ] AudiencePanel 组件
- [ ] 网络分析算法
- [ ] 数据聚合工具

**交付物**:
- 6个核心功能模块
- 完整的数据流
- Mock数据系统

---

### 第三阶段：集成和优化 (2天)
**时间**: Day 9-10

- [ ] 主屏幕集成
- [ ] 实时更新机制
- [ ] 动画效果优化
- [ ] 响应式布局调整
- [ ] 性能优化

**交付物**:
- 完整可运行的SCR-02 v2
- 流畅的动画效果
- 良好的性能表现

---

### 第四阶段：测试和文档 (2天)
**时间**: Day 11-12

- [ ] 功能测试
- [ ] 性能测试
- [ ] 浏览器兼容性测试
- [ ] 编写使用文档
- [ ] 代码注释完善

**交付物**:
- 测试报告
- 使用文档
- API文档

---

## 五、数据接口设计

### 5.1 热搜数据接口
```typescript
// GET /api/trending/list
interface TrendingListRequest {
  platform?: string;    // 'all' | 'weibo' | 'douyin' | ...
  timeRange?: string;   // '1h' | '6h' | '24h'
  limit?: number;       // 默认 50
}

interface TrendingListResponse {
  data: TrendingItem[];
  total: number;
  timestamp: string;
}
```

### 5.2 热力图数据接口
```typescript
// GET /api/trending/heatmap
interface HeatMapRequest {
  timeRange: string;    // '24h' | '7d'
  categories?: string[];
}

interface HeatMapResponse {
  data: HeatMapData[];
  categories: string[];
  timePoints: string[];
}
```

### 5.3 情感分析接口
```typescript
// GET /api/sentiment/analysis
interface SentimentRequest {
  platform?: string;
  timeRange?: string;
  topics?: string[];
}

interface SentimentResponse {
  data: SentimentData;
  timestamp: string;
}
```

### 5.4 话题网络接口
```typescript
// GET /api/topics/network
interface TopicNetworkRequest {
  centerTopic?: string;
  depth?: number;       // 默认 2
  minWeight?: number;   // 最小关联强度
}

interface TopicNetworkResponse {
  data: TopicNetwork;
  timestamp: string;
}
```

### 5.5 人群画像接口
```typescript
// GET /api/audience/profile
interface AudienceRequest {
  platform?: string;
  topic?: string;
  timeRange?: string;
}

interface AudienceResponse {
  data: AudienceProfile;
  timestamp: string;
}
```

### 5.6 预警接口
```typescript
// GET /api/alerts/list
interface AlertsRequest {
  level?: 'high' | 'medium' | 'low';
  type?: 'risk' | 'opportunity';
  limit?: number;
}

interface AlertsResponse {
  data: Alert[];
  total: number;
  timestamp: string;
}
```

---

## 六、Mock数据策略

在后端API未就绪前，使用Mock数据：

### 6.1 Mock数据生成器
```typescript
// services/mockDataGenerator.ts
export function generateMockTrendingData(): TrendingItem[] {
  // 生成模拟热搜数据
}

export function generateMockHeatMapData(): HeatMapData[] {
  // 生成模拟热力图数据
}

export function generateMockSentimentData(): SentimentData {
  // 生成模拟情感数据
}

// ... 其他生成器
```

### 6.2 Mock数据更新
- 使用 `setInterval` 模拟实时更新
- 添加随机波动模拟真实场景
- 保持数据的连贯性和合理性

---

## 七、性能优化策略

### 7.1 渲染优化
- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 稳定函数引用
- 虚拟滚动处理大列表

### 7.2 数据优化
- React Query 缓存策略
- 数据分页加载
- 增量更新而非全量刷新
- Web Worker 处理复杂计算

### 7.3 图表优化
- ECharts 按需加载
- Canvas 离屏渲染
- 降低更新频率
- 使用 requestAnimationFrame

---

## 八、测试计划

### 8.1 单元测试
- [ ] 数据转换函数
- [ ] 工具函数
- [ ] 算法函数

### 8.2 组件测试
- [ ] 各个组件的渲染
- [ ] 交互行为
- [ ] 边界情况

### 8.3 集成测试
- [ ] 数据流测试
- [ ] 实时更新测试
- [ ] 多组件协作测试

### 8.4 性能测试
- [ ] 渲染性能
- [ ] 内存占用
- [ ] 网络请求

---

## 九、风险和挑战

### 9.1 技术风险
- **D3.js 学习曲线**: 话题网络图实现复杂
  - 缓解: 使用现成的力导向布局示例
  
- **性能问题**: 大量数据和图表可能影响性能
  - 缓解: 虚拟化、分页、降频

- **实时更新**: WebSocket 连接稳定性
  - 缓解: 降级为轮询，添加重连机制

### 9.2 数据风险
- **数据质量**: Mock数据可能不够真实
  - 缓解: 基于真实数据规律生成

- **数据量**: 大量历史数据存储和查询
  - 缓解: 数据聚合、定期清理

### 9.3 时间风险
- **开发时间**: 12天可能不够
  - 缓解: 优先实现P0功能，P1功能可延后

---

## 十、验收标准

### 10.1 功能完整性
- ✅ 6个核心模块全部实现
- ✅ 数据流完整可用
- ✅ 交互功能正常

### 10.2 视觉效果
- ✅ 动画流畅自然
- ✅ 布局合理美观
- ✅ 响应式适配良好

### 10.3 性能指标
- ✅ 首屏加载 < 2秒
- ✅ 交互响应 < 100ms
- ✅ 内存占用 < 200MB

### 10.4 代码质量
- ✅ TypeScript 类型完整
- ✅ 代码注释清晰
- ✅ 无明显bug

---

## 十一、后续优化方向

### 11.1 功能增强
- 舆情报告自动生成
- 历史数据对比分析
- 自定义预警规则
- 数据导出功能

### 11.2 AI增强
- 更智能的情感分析
- 话题趋势预测
- 异常检测算法
- 个性化推荐

### 11.3 用户体验
- 自定义仪表盘
- 数据筛选和搜索
- 快捷键支持
- 主题切换

---

## 十二、参考资料

### 技术文档
- [ECharts 官方文档](https://echarts.apache.org/)
- [D3.js 官方文档](https://d3js.org/)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [React Query 文档](https://tanstack.com/query/latest)

### 设计参考
- 数据可视化最佳实践
- 舆情分析系统案例
- 仪表盘设计模式

---

## 联系方式
- 开发者: Kiro AI Assistant
- 项目仓库: https://github.com/microcodor/Claw3D
- 分支: feature/scr02-sentiment-analysis-center
- 基线版本: v1.0.0-baseline

---

**最后更新**: 2026-04-17
**文档版本**: 1.0
