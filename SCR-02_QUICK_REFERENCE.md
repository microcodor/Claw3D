# SCR-02 快速参考指南

## 情感分析 API

### 基础用法

```typescript
import { 
  analyzeSentiment,
  analyzeTrendingSentiments,
  calculateSentimentDistribution,
  extractSentimentKeywords
} from '@/features/trending-center-v2/utils/sentimentAnalyzer';

// 1. 分析单条文本
const sentiment = analyzeSentiment('AI技术突破引发热议');
console.log(sentiment); // 'positive'

// 2. 批量分析热搜数据
const analyzedData = analyzeTrendingSentiments(trendingItems);

// 3. 统计情感分布
const distribution = calculateSentimentDistribution(trendingItems);
console.log(distribution); 
// { positive: 45, neutral: 30, negative: 25 }

// 4. 提取情感关键词
const keywords = extractSentimentKeywords(trendingItems);
console.log(keywords);
// { positive: ['突破', '成功', ...], negative: ['危机', '争议', ...] }
```

### 关键词库

#### 正面关键词示例
- 成就类: 突破、成功、胜利、夺冠、获奖、冠军、创新
- 情感类: 喜欢、爱、感动、温暖、幸福、快乐、精彩
- 期待类: 期待、希望、憧憬、梦想、未来、机遇
- 正能量: 励志、奋斗、努力、坚持、加油、鼓励

#### 负面关键词示例
- 危机类: 危机、风险、威胁、问题、困难、失败
- 冲突类: 争议、质疑、批评、指责、反对、抗议
- 负面情绪: 愤怒、不满、失望、悲伤、担忧、焦虑
- 丑闻类: 丑闻、曝光、爆料、揭露、造假、欺骗

### 自定义关键词

如需添加自定义关键词，编辑 `sentimentAnalyzer.ts`:

```typescript
// 在文件顶部添加
const POSITIVE_KEYWORDS = [
  // ... 现有关键词
  '你的正面关键词1',
  '你的正面关键词2',
];

const NEGATIVE_KEYWORDS = [
  // ... 现有关键词
  '你的负面关键词1',
  '你的负面关键词2',
];
```

## 话题网络 API

### 基础用法

```typescript
import { 
  generateTopicNetworkFromTrending,
  updateTopicNetwork
} from '@/features/trending-center-v2/utils/topicNetworkGenerator';

// 1. 生成话题网络
const network = generateTopicNetworkFromTrending(
  trendingItems,  // 热搜数据
  15,             // 最大节点数（可选，默认15）
  0.15            // 最小相似度（可选，默认0.15）
);

console.log(network);
// {
//   nodes: [{ id, label, value, category, level }, ...],
//   edges: [{ source, target, weight }, ...],
//   centerNode: 'xxx'
// }

// 2. 更新话题网络
const updatedNetwork = updateTopicNetwork(currentNetwork, newTrendingItems);
```

### 参数说明

#### maxNodes (最大节点数)
- 默认: 15
- 范围: 5-30
- 说明: 控制网络中显示的话题数量
- 建议: 
  - 小屏幕: 10-15
  - 大屏幕: 15-20
  - 超大屏: 20-30

#### minSimilarity (最小相似度)
- 默认: 0.15
- 范围: 0.1-0.5
- 说明: 控制话题之间连接的阈值
- 建议:
  - 0.1-0.15: 连接较多，网络密集
  - 0.15-0.25: 适中，推荐
  - 0.25-0.5: 连接较少，网络稀疏

### 节点层级

- **Level 0 (核心话题)**: 热度最高的话题，橙色显示
- **Level 1 (衍生话题)**: 第2-6名的话题，蓝色显示
- **Level 2 (次级话题)**: 第7-15名的话题，紫色显示

### 相似度算法

使用 Jaccard 相似度:
```
相似度 = 共同关键词数 / 总关键词数
```

示例:
```
话题A: "AI技术突破引发热议"
话题B: "AI技术应用前景广阔"

关键词A: [AI, 技术, 突破, 引发, 热议]
关键词B: [AI, 技术, 应用, 前景, 广阔]

共同关键词: [AI, 技术] = 2个
总关键词: [AI, 技术, 突破, 引发, 热议, 应用, 前景, 广阔] = 8个

相似度 = 2 / 8 = 0.25
```

## 组件使用

### TopicNetwork 组件

```typescript
import TopicNetwork from '@/features/trending-center-v2/components/TopicNetwork';

<TopicNetwork data={topicNetworkData} />
```

**Props**:
- `data`: TopicNetwork 类型的数据对象

**交互功能**:
- 拖拽节点调整位置
- 悬停查看详细信息
- 自动力导向布局

### PublicOpinionMonitor 组件

```typescript
import PublicOpinionMonitor from '@/features/trending-center-v2/components/PublicOpinionMonitor';

<PublicOpinionMonitor trendingData={trendingItems} />
```

**Props**:
- `trendingData`: TrendingItem[] 类型的热搜数据数组

**自动功能**:
- 计算情感分布
- 判断风险等级
- 生成风险预警
- 生成机会话题

## 数据类型

### TrendingItem

```typescript
interface TrendingItem {
  id: string;
  title: string;              // 热搜标题
  platform: string;           // 平台名称
  heat: number;               // 热度值
  rank: number;               // 排名
  url: string;                // 链接
  delta: string;              // 变化趋势 "+15%"
  sentiment: 'positive' | 'negative' | 'neutral';  // 情感
  isNew: boolean;             // 是否新增
}
```

### TopicNetwork

```typescript
interface TopicNetwork {
  nodes: TopicNode[];         // 节点列表
  edges: TopicEdge[];         // 边列表
  centerNode: string;         // 中心节点ID
}

interface TopicNode {
  id: string;
  label: string;              // 显示标签
  value: number;              // 节点大小（热度）
  category: string;           // 分类
  level: number;              // 层级 0/1/2
}

interface TopicEdge {
  source: string;             // 源节点ID
  target: string;             // 目标节点ID
  weight: number;             // 权重 0-1
}
```

## 性能优化建议

### 1. 数据量控制
```typescript
// 限制热搜数据量
const limitedData = trendingItems.slice(0, 100);
const analyzedData = analyzeTrendingSentiments(limitedData);
```

### 2. 缓存结果
```typescript
// 缓存情感分析结果
const cache = new Map<string, 'positive' | 'negative' | 'neutral'>();

function cachedAnalyzeSentiment(text: string) {
  if (cache.has(text)) {
    return cache.get(text)!;
  }
  const result = analyzeSentiment(text);
  cache.set(text, result);
  return result;
}
```

### 3. 防抖更新
```typescript
import { debounce } from 'lodash';

const debouncedUpdate = debounce((data) => {
  const network = generateTopicNetworkFromTrending(data);
  setTopicNetwork(network);
}, 1000);
```

### 4. Web Worker
```typescript
// 在 Web Worker 中执行情感分析
const worker = new Worker('/workers/sentiment-analyzer.js');

worker.postMessage({ items: trendingItems });
worker.onmessage = (e) => {
  setAnalyzedData(e.data);
};
```

## 常见问题

### Q1: 情感分析不准确怎么办？
**A**: 
1. 检查关键词库是否覆盖该领域
2. 添加领域特定关键词
3. 调整评分权重
4. 考虑集成 NLP API

### Q2: 话题网络太密集/稀疏？
**A**:
1. 调整 `minSimilarity` 参数
2. 调整 `maxNodes` 参数
3. 修改力导向图参数

### Q3: 性能问题？
**A**:
1. 限制数据量
2. 使用缓存
3. 使用 Web Worker
4. 增加更新间隔

### Q4: 如何导出数据？
**A**:
```typescript
// 导出情感分析结果
const exportData = {
  distribution: calculateSentimentDistribution(items),
  keywords: extractSentimentKeywords(items),
  items: analyzedData,
};

const json = JSON.stringify(exportData, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// 下载文件...
```

## 调试技巧

### 1. 查看情感分析详情
```typescript
import { analyzeSentiment } from '@/features/trending-center-v2/utils/sentimentAnalyzer';

// 在控制台查看分析过程
const text = '你的热搜标题';
console.log('原文:', text);
console.log('情感:', analyzeSentiment(text));
```

### 2. 查看话题网络结构
```typescript
const network = generateTopicNetworkFromTrending(items);
console.log('节点数:', network.nodes.length);
console.log('边数:', network.edges.length);
console.log('中心节点:', network.centerNode);
console.table(network.nodes);
console.table(network.edges);
```

### 3. 性能监控
```typescript
console.time('情感分析');
const analyzed = analyzeTrendingSentiments(items);
console.timeEnd('情感分析');

console.time('网络生成');
const network = generateTopicNetworkFromTrending(items);
console.timeEnd('网络生成');
```

## 更新日志

### v1.0.0 (2026-04-17)
- ✨ 新增智能情感分析系统
- ✨ 新增话题关联网络生成器
- 🎨 优化界面布局
- 🐛 修复情感数据不准确问题
- 📝 完善文档和注释
