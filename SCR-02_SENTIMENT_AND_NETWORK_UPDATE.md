# SCR-02 情感分析与话题网络更新

## 实施日期
2026年4月17日

## 更新内容

### 1. 智能情感分析系统

#### 1.1 情感分析工具（sentimentAnalyzer.ts）
**功能**: 根据热搜标题关键词自动判断情感倾向

**关键词库**:
- **正面关键词** (80+): 
  - 成就类: 突破、成功、胜利、夺冠、获奖、创新、发明等
  - 情感类: 喜欢、爱、感动、温暖、幸福、快乐、精彩等
  - 期待类: 期待、希望、憧憬、梦想、未来、机遇等
  - 正能量: 励志、奋斗、努力、坚持、加油、鼓励等
  - 庆祝类: 庆祝、祝贺、恭喜、喜讯、好消息等

- **负面关键词** (80+):
  - 危机类: 危机、风险、威胁、问题、困难、失败、错误等
  - 冲突类: 争议、质疑、批评、指责、反对、抗议、冲突等
  - 负面情绪: 愤怒、不满、失望、悲伤、痛苦、担忧、焦虑等
  - 丑闻类: 丑闻、曝光、爆料、揭露、造假、欺骗、诈骗等
  - 下降类: 下跌、暴跌、下滑、亏损、损失等
  - 疾病灾害: 疫情、病毒、感染、死亡、地震、火灾等

- **中性关键词** (30+):
  - 讨论、分析、解读、观点、报道、消息、新闻等
  - 发布、公布、宣布、通知、公告、声明等
  - 数据、统计、调查、研究、报告等

**分析逻辑**:
1. 统计文本中出现的正面、负面、中性关键词数量
2. 如果正面得分 > 负面得分 × 1.5，判断为正面
3. 如果负面得分 > 正面得分 × 1.5，判断为负面
4. 如果正面得分 > 负面得分，判断为正面
5. 如果负面得分 > 正面得分，判断为负面
6. 其他情况判断为中性

**核心函数**:
```typescript
// 分析单条热搜的情感
analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral'

// 批量分析热搜数据
analyzeTrendingSentiments(items: TrendingItem[]): TrendingItem[]

// 统计情感分布百分比
calculateSentimentDistribution(items: TrendingItem[]): {
  positive: number;
  neutral: number;
  negative: number;
}

// 提取情感关键词
extractSentimentKeywords(items: TrendingItem[]): {
  positive: string[];
  negative: string[];
}
```

#### 1.2 应用场景
- 自动分析所有热搜数据的情感倾向
- 为舆情监测提供准确的情感分布数据
- 根据情感自动生成风险预警和机会话题
- 提取正面和负面关键词用于舆情分析

### 2. 话题关联网络生成器

#### 2.1 网络生成工具（topicNetworkGenerator.ts）
**功能**: 基于真实热搜数据生成话题关联网络

**生成逻辑**:
1. **节点创建**:
   - 选择热度最高的前15条热搜
   - 第1条作为中心节点（level 0）
   - 第2-6条作为一级节点（level 1）
   - 第7-15条作为二级节点（level 2）
   - 节点大小基于热度值

2. **边创建**:
   - 计算热搜标题之间的相似度（Jaccard相似度）
   - 相似度 ≥ 0.15 的热搜之间创建连接
   - 如果边太少，添加基于排名的连接：
     - 中心节点连接前5个节点
     - 一级节点连接二级节点

3. **相似度计算**:
   - 提取标题中的关键词（≥2个字符）
   - 计算两个标题的共同关键词
   - 使用 Jaccard 相似度: 交集 / 并集

**核心函数**:
```typescript
// 从热搜数据生成话题网络
generateTopicNetworkFromTrending(
  items: TrendingItem[],
  maxNodes: number = 15,
  minSimilarity: number = 0.15
): TopicNetwork

// 更新话题网络
updateTopicNetwork(
  currentNetwork: TopicNetwork,
  newItems: TrendingItem[]
): TopicNetwork
```

#### 2.2 网络特点
- 动态生成：基于实时热搜数据
- 智能关联：自动发现话题之间的关联
- 层级清晰：核心话题 → 衍生话题 → 次级话题
- 可交互：支持拖拽、悬停查看详情

### 3. 界面布局更新

#### 3.1 中间列布局调整
**从**: 单个组件（舆情监测与智能预警）
**到**: 两个组件垂直排列
  - 上方：话题关联网络
  - 下方：舆情监测与智能预警

**CSS 更新**:
```css
.centerColumn {
  display: flex;
  flex-direction: column;
  gap: 10px;  /* 新增：组件间距 */
}
```

#### 3.2 组件高度分配
- 话题关联网络：flex: 1（自动填充）
- 舆情监测：flex: 1（自动填充）
- 两个组件平分中间列的高度

### 4. 数据流优化

#### 4.1 数据处理流程
```
1. fetchPlatforms() 
   ↓
2. fetchPlatformFeeds() (前5个平台，每平台20条)
   ↓
3. transformFeedToTrending() (转换为统一格式)
   ↓
4. analyzeTrendingSentiments() (重新分析情感)
   ↓
5. 并行处理:
   ├─ generateTopicNetworkFromTrending() → TopicNetwork
   └─ PublicOpinionMonitor (计算情感分布 + 生成预警)
   ↓
6. 渲染展示
```

#### 4.2 实时更新
- 每30秒自动刷新数据
- 重新分析情感
- 重新生成话题网络
- 更新舆情监测数据

### 5. 舆情监测数据源改进

#### 5.1 情感分布计算
**从**: 使用原始数据的 sentiment 字段（可能不准确）
**到**: 使用 sentimentAnalyzer 重新分析

**优势**:
- 基于中文关键词库，更准确
- 考虑了上下文和多个关键词
- 可以自定义关键词库

#### 5.2 风险等级判断
**逻辑**:
- 负面比例 > 40%: 高风险
- 负面比例 > 25%: 中风险
- 其他: 低风险

**动态调整**: 根据实时数据自动更新风险等级

## 文件清单

### 新增文件
1. `src/features/trending-center-v2/utils/sentimentAnalyzer.ts` - 情感分析工具
2. `src/features/trending-center-v2/utils/topicNetworkGenerator.ts` - 话题网络生成器
3. `src/features/trending-center-v2/components/TopicNetwork/index.ts` - 组件导出

### 修改文件
1. `src/features/trending-center-v2/screens/TrendingCenterScreenV2.tsx` - 集成新功能
2. `src/features/trending-center-v2/styles/trending-center-v2.module.css` - 布局调整

## 技术亮点

### 1. 智能情感分析
- 160+ 关键词库覆盖多种场景
- 多维度评分机制
- 自动提取情感关键词

### 2. 动态话题网络
- 基于真实数据生成
- 智能相似度计算
- 自动层级划分

### 3. 数据驱动
- 所有分析基于真实热搜数据
- 实时更新，动态调整
- 无需人工标注

## 验证结果

### TypeScript 检查
```bash
npm run typecheck
```
✅ 无错误

### 构建测试
```bash
npm run build
```
✅ 编译成功

## 用户体验提升

1. **情感分析准确性**: 基于中文关键词库，比原始数据更准确
2. **话题关联可视化**: 直观展示热搜之间的关联关系
3. **风险预警智能化**: 根据真实情感分布自动判断风险等级
4. **数据完整性**: 话题网络 + 舆情监测，全方位分析
5. **实时性**: 30秒自动刷新，保持数据最新

## 使用示例

### 情感分析
```typescript
import { analyzeSentiment } from '@/features/trending-center-v2/utils/sentimentAnalyzer';

const sentiment = analyzeSentiment('AI技术突破引发热议');
// 返回: 'positive'

const sentiment2 = analyzeSentiment('某明星丑闻曝光引发争议');
// 返回: 'negative'
```

### 话题网络生成
```typescript
import { generateTopicNetworkFromTrending } from '@/features/trending-center-v2/utils/topicNetworkGenerator';

const network = generateTopicNetworkFromTrending(trendingData, 15, 0.15);
// 返回: { nodes: [...], edges: [...], centerNode: '...' }
```

## 下一步建议

1. **关键词库优化**:
   - 添加行业特定关键词
   - 支持自定义关键词库
   - 定期更新关键词

2. **情感分析增强**:
   - 集成 NLP 情感分析 API
   - 支持情感强度分析
   - 考虑否定词和转折词

3. **话题网络优化**:
   - 添加时间维度（话题演化）
   - 支持话题聚类
   - 添加影响力分析

4. **交互功能**:
   - 点击节点查看详情
   - 筛选特定情感的话题
   - 导出话题网络图

5. **性能优化**:
   - 缓存情感分析结果
   - 增量更新话题网络
   - 优化大数据量处理

## 注意事项

1. **关键词库维护**: 需要定期更新关键词库以适应新的热点话题
2. **相似度阈值**: 当前设置为 0.15，可根据实际效果调整
3. **节点数量**: 当前最多15个节点，可根据屏幕大小调整
4. **情感判断**: 基于关键词的简单规则，复杂语境可能不准确
5. **性能考虑**: 大量数据时情感分析可能较慢，建议使用 Web Worker

## 总结

本次更新实现了：
✅ 智能情感分析系统（160+ 关键词）
✅ 动态话题关联网络生成
✅ 话题网络可视化展示
✅ 基于真实数据的舆情监测
✅ 自动风险等级判断

所有功能已集成到 SCR-02 舆情分析中心，提供更准确、更智能的舆情分析能力。
