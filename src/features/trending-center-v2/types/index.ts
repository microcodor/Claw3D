// 核心类型定义

// ============================================================
// 平台相关类型
// ============================================================

export interface Platform {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
  category: string;
}

export interface PlatformStats {
  platform: Platform;
  hotness: number;
  hotnessPercent: number;
  category: string;
  count: number;
  trend: number; // -100 to +100
}

export interface CommonHotspot {
  topic: string;
  platformCount: number;
  platforms: string[];
}

// ============================================================
// 热搜相关类型
// ============================================================

export interface TrendingItem {
  id: string;
  title: string;
  platform: string;
  category: string;
  heat: number;
  delta: string; // "+15%" or "-5%"
  sentiment: 'positive' | 'negative' | 'neutral';
  rank: number;
  timestamp: string;
  url?: string;
}

// ============================================================
// 热力图相关类型
// ============================================================

export interface HeatMapData {
  category: string;
  time: string; // HH:mm
  value: number; // 热度值
}

export interface HotspotAlert {
  category: string;
  value: number;
  growthRate: number;
  timestamp: string;
}

// ============================================================
// 情感分析相关类型
// ============================================================

export interface SentimentData {
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

// ============================================================
// 话题网络相关类型
// ============================================================

export interface TopicNode {
  id: string;
  label: string;
  value: number;      // 热度
  category: string;
  level: number;      // 层级 0=核心 1=衍生 2=次级
}

export interface TopicEdge {
  source: string;
  target: string;
  weight: number;     // 关联强度 0-1
}

export interface TopicNetwork {
  nodes: TopicNode[];
  edges: TopicEdge[];
  centerNode: string; // 核心话题ID
}

// ============================================================
// 人群画像相关类型
// ============================================================

export interface AudienceProfile {
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
    activity: number;   // 活跃度 0-100
  }>;
  interactionTypes: {
    share: number;
    comment: number;
    like: number;
  };
}

// ============================================================
// 预警系统相关类型
// ============================================================

export interface Alert {
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

// ============================================================
// API 请求/响应类型
// ============================================================

export interface TrendingListRequest {
  platform?: string;    // 'all' | 'weibo' | 'douyin' | ...
  timeRange?: '1h' | '6h' | '24h';
  limit?: number;
}

export interface TrendingListResponse {
  data: TrendingItem[];
  total: number;
  timestamp: string;
}

export interface HeatMapRequest {
  timeRange: '24h' | '7d';
  categories?: string[];
}

export interface HeatMapResponse {
  data: HeatMapData[];
  categories: string[];
  timePoints: string[];
}

export interface SentimentRequest {
  platform?: string;
  timeRange?: string;
  topics?: string[];
}

export interface SentimentResponse {
  data: SentimentData;
  timestamp: string;
}

export interface TopicNetworkRequest {
  centerTopic?: string;
  depth?: number;
  minWeight?: number;
}

export interface TopicNetworkResponse {
  data: TopicNetwork;
  timestamp: string;
}

export interface AudienceRequest {
  platform?: string;
  topic?: string;
  timeRange?: string;
}

export interface AudienceResponse {
  data: AudienceProfile;
  timestamp: string;
}

export interface AlertsRequest {
  level?: 'high' | 'medium' | 'low';
  type?: 'risk' | 'opportunity';
  limit?: number;
}

export interface AlertsResponse {
  data: Alert[];
  total: number;
  timestamp: string;
}

// ============================================================
// 组件 Props 类型
// ============================================================

export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface DataComponentProps<T> extends BaseComponentProps {
  data: T;
  loading?: boolean;
  error?: string | null;
}
