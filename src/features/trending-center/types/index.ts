export interface Platform {
  id: string;
  name: string;
  displayName: string;
  category: string;
  url: string;
  itemsCount: number;
  updatedAt: string;
}

export interface Feed {
  id: string;
  title: string;
  url: string;
  hotValue: number;
  rank: number;
}

export interface PlatformFeedData {
  platform: Platform;
  data: Feed[];
  total: number;
  hasMore: boolean;
  updatedAt: string;
}

export interface TrendingItem {
  id: string;
  title: string;
  platform: string;
  heat: number;
  rank: number;
  url: string;
  delta: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  isNew: boolean;
}

export interface TrendDataPoint {
  time: string;
  value: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface CategoryDataPoint {
  label: string;
  value: number;
}

export interface AnalysisData {
  trendData: TrendDataPoint[];
  sentiment: SentimentData;
  keywords: string[];
  categoryData: CategoryDataPoint[];
}

export interface CacheStatus {
  source: string;
  platforms: number;
  feeds: number;
  updatedAt: string;
}
