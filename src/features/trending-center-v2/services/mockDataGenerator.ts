// Mock 数据生成器

import type {
  Platform,
  TrendingItem,
  HeatMapData,
  SentimentData,
  TopicNetwork,
  TopicNode,
  TopicEdge,
  AudienceProfile,
  Alert,
} from '../types';
import { generatePastHours } from '../utils/timeUtils';

// 平台列表
export const MOCK_PLATFORMS: Platform[] = [
  { id: 'weibo', name: 'weibo', displayName: '微博', color: '#ff6b35', icon: '🔥', category: '社交' },
  { id: 'douyin', name: 'douyin', displayName: '抖音', color: '#00d4ff', icon: '🎵', category: '短视频' },
  { id: 'zhihu', name: 'zhihu', displayName: '知乎', color: '#0084ff', icon: '💡', category: '问答' },
  { id: 'bilibili', name: 'bilibili', displayName: 'B站', color: '#00a1d6', icon: '📺', category: '视频' },
  { id: 'baidu', name: 'baidu', displayName: '百度', color: '#2932e1', icon: '🔍', category: '搜索' },
  { id: 'toutiao', name: 'toutiao', displayName: '头条', color: '#ff4757', icon: '📰', category: '资讯' },
  { id: 'kuaishou', name: 'kuaishou', displayName: '快手', color: '#ff6348', icon: '⚡', category: '短视频' },
  { id: 'xiaohongshu', name: 'xiaohongshu', displayName: '小红书', color: '#ff2d55', icon: '📖', category: '社区' },
];

// 峰值时段列表
const PEAK_HOURS = [
  '08:00-10:00', '10:00-12:00', '12:00-14:00', 
  '14:00-16:00', '16:00-18:00', '18:00-20:00', 
  '20:00-22:00', '22:00-24:00'
];

// 类别列表
const CATEGORIES = ['科技', '娱乐', '社会', '体育', '财经', '游戏', '教育', '健康'];

// 热搜标题模板
const TITLE_TEMPLATES = [
  '{topic}引发热议',
  '{topic}登上热搜',
  '{topic}最新进展',
  '{topic}相关话题',
  '关于{topic}的讨论',
  '{topic}成为焦点',
  '{topic}引起关注',
  '{topic}持续发酵',
];

// 话题列表
const TOPICS = [
  'AI技术突破', '新能源汽车', '元宇宙发展', '量子计算', '5G应用',
  '明星八卦', '电影上映', '综艺节目', '音乐新歌', '演唱会',
  '社会热点', '民生问题', '政策解读', '公益活动', '环保议题',
  '体育赛事', '奥运会', '世界杯', '篮球比赛', '电竞赛事',
  '股市行情', '经济政策', '创业融资', '企业动态', '行业分析',
  '游戏发布', '电竞比赛', '游戏更新', '玩家讨论', '游戏攻略',
  '教育改革', '考试政策', '在线教育', '留学资讯', '职业培训',
  '健康养生', '医疗科技', '疫情防控', '运动健身', '心理健康',
];

/**
 * 生成随机热搜数据
 */
export function generateMockTrendingData(count: number = 50): TrendingItem[] {
  const items: TrendingItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const platform = MOCK_PLATFORMS[Math.floor(Math.random() * MOCK_PLATFORMS.length)];
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const template = TITLE_TEMPLATES[Math.floor(Math.random() * TITLE_TEMPLATES.length)];
    const title = template.replace('{topic}', topic);
    
    const heat = Math.floor(Math.random() * 1000000) + 10000;
    const deltaValue = Math.floor(Math.random() * 200) - 50; // -50 to +150
    const delta = deltaValue > 0 ? `+${deltaValue}%` : `${deltaValue}%`;
    
    const sentiments: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    items.push({
      id: `${platform.id}-${i}`,
      title,
      platform: platform.name,
      category,
      heat,
      delta,
      sentiment,
      rank: i + 1,
      timestamp: new Date().toISOString(),
    });
  }
  
  return items.sort((a, b) => b.heat - a.heat);
}

/**
 * 生成热力图数据
 */
export function generateMockHeatMapData(): HeatMapData[] {
  const data: HeatMapData[] = [];
  const timePoints = generatePastHours(24);
  
  CATEGORIES.forEach(category => {
    timePoints.forEach((time, index) => {
      // 模拟不同时段的热度变化
      const baseValue = Math.random() * 50000 + 10000;
      const timeBoost = Math.sin((index / timePoints.length) * Math.PI * 2) * 20000;
      const value = Math.max(0, baseValue + timeBoost);
      
      data.push({ category, time, value });
    });
  });
  
  return data;
}

/**
 * 生成情感分析数据
 */
export function generateMockSentimentData(): SentimentData {
  const positive = Math.floor(Math.random() * 40) + 40; // 40-80
  const negative = Math.floor(Math.random() * 30) + 5;  // 5-35
  const neutral = 100 - positive - negative;
  
  const trends: Array<'up' | 'down' | 'stable'> = ['up', 'down', 'stable'];
  const trend = trends[Math.floor(Math.random() * trends.length)];
  const trendValue = Math.floor(Math.random() * 20) - 10; // -10 to +10
  
  const riskLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
  const riskLevel = negative > 25 ? 'high' : negative > 15 ? 'medium' : 'low';
  
  const positiveKeywords = ['创新', '突破', '期待', '支持', '赞同', '优秀', '精彩', '感动'];
  const negativeKeywords = ['担忧', '质疑', '争议', '失望', '批评', '反对', '问题', '风险'];
  
  const history = generatePastHours(12).map((time, index) => ({
    time,
    positive: positive + Math.floor(Math.random() * 20) - 10,
    negative: negative + Math.floor(Math.random() * 10) - 5,
  }));
  
  return {
    positive,
    neutral,
    negative,
    trend,
    trendValue,
    riskLevel,
    keywords: {
      positive: positiveKeywords.slice(0, 5),
      negative: negativeKeywords.slice(0, 5),
    },
    history,
  };
}

/**
 * 生成话题网络数据
 */
export function generateMockTopicNetwork(): TopicNetwork {
  const centerTopic = TOPICS[0];
  const nodes: TopicNode[] = [
    {
      id: 'center',
      label: centerTopic,
      value: 100,
      category: CATEGORIES[0],
      level: 0,
    },
  ];
  
  // 生成一级节点
  for (let i = 1; i <= 5; i++) {
    nodes.push({
      id: `level1-${i}`,
      label: TOPICS[i],
      value: Math.floor(Math.random() * 50) + 30,
      category: CATEGORIES[i % CATEGORIES.length],
      level: 1,
    });
  }
  
  // 生成二级节点
  for (let i = 1; i <= 8; i++) {
    nodes.push({
      id: `level2-${i}`,
      label: TOPICS[i + 5],
      value: Math.floor(Math.random() * 30) + 10,
      category: CATEGORIES[i % CATEGORIES.length],
      level: 2,
    });
  }
  
  const edges: TopicEdge[] = [];
  
  // 中心节点连接一级节点
  for (let i = 1; i <= 5; i++) {
    edges.push({
      source: 'center',
      target: `level1-${i}`,
      weight: Math.random() * 0.5 + 0.5, // 0.5-1.0
    });
  }
  
  // 一级节点连接二级节点
  for (let i = 1; i <= 8; i++) {
    const parentIndex = Math.floor((i - 1) / 2) + 1;
    edges.push({
      source: `level1-${parentIndex}`,
      target: `level2-${i}`,
      weight: Math.random() * 0.5 + 0.3, // 0.3-0.8
    });
  }
  
  return {
    nodes,
    edges,
    centerNode: 'center',
  };
}

/**
 * 生成人群画像数据
 */
export function generateMockAudienceProfile(): AudienceProfile {
  return {
    ageDistribution: [
      { range: '18-25', percentage: 35 },
      { range: '26-35', percentage: 45 },
      { range: '36-45', percentage: 15 },
      { range: '45+', percentage: 5 },
    ],
    regionDistribution: [
      { region: '北京', percentage: 15 },
      { region: '上海', percentage: 14 },
      { region: '广州', percentage: 12 },
      { region: '深圳', percentage: 11 },
      { region: '杭州', percentage: 8 },
      { region: '成都', percentage: 7 },
      { region: '其他', percentage: 33 },
    ],
    activeHours: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      activity: hour >= 8 && hour <= 23
        ? Math.floor(Math.random() * 50) + 30
        : Math.floor(Math.random() * 20) + 5,
    })),
    interactionTypes: {
      share: 35,
      comment: 40,
      like: 25,
    },
  };
}

/**
 * 生成预警数据
 */
export function generateMockAlerts(): Alert[] {
  const alerts: Alert[] = [];
  
  // 高风险预警
  alerts.push({
    id: 'alert-1',
    type: 'risk',
    level: 'high',
    topic: '某明星事件',
    reason: '负面情绪激增',
    metrics: {
      negativeGrowth: 180,
    },
    suggestion: '避免相关内容创作，等待舆情平息',
    timestamp: new Date().toISOString(),
  });
  
  // 中风险预警
  alerts.push({
    id: 'alert-2',
    type: 'risk',
    level: 'medium',
    topic: '政策讨论',
    reason: '观点分化严重',
    metrics: {
      polarization: 75,
    },
    suggestion: '谨慎表态，保持中立立场',
    timestamp: new Date().toISOString(),
  });
  
  // 机会话题
  for (let i = 0; i < 5; i++) {
    alerts.push({
      id: `alert-opp-${i}`,
      type: 'opportunity',
      level: 'low',
      topic: TOPICS[i],
      reason: '正面情绪高涨',
      metrics: {
        positiveGrowth: Math.floor(Math.random() * 50) + 50,
      },
      suggestion: '优质创作机会，建议及时跟进',
      timestamp: new Date().toISOString(),
    });
  }
  
  return alerts;
}

/**
 * 模拟实时数据更新
 */
export function updateMockData<T>(data: T, updateFn: (data: T) => T): T {
  return updateFn(data);
}
