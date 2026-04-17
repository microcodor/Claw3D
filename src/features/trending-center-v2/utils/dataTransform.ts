// 数据转换工具函数

import type { TrendingItem, HeatMapData, Platform } from '../types';

/**
 * 提取主题词（简化版）
 */
export function extractMainTopic(title: string): string {
  // 简化版：提取第一个关键词
  const keywords = title.split(/[，。！？、\s]+/);
  return keywords[0] || title.slice(0, 10);
}

/**
 * 计算热度百分比
 */
export function calculateHotnessPercent(value: number, maxValue: number): number {
  if (maxValue === 0) return 0;
  return Math.round((value / maxValue) * 100);
}

/**
 * 格式化热度值
 */
export function formatHeatValue(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}亿`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}万`;
  }
  return value.toFixed(0);
}

/**
 * 计算趋势（增长率）
 */
export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * 格式化趋势显示
 */
export function formatTrend(trend: number): string {
  if (trend > 0) return `+${trend}%`;
  if (trend < 0) return `${trend}%`;
  return '0%';
}

/**
 * 找出共同热点
 */
export function findCommonHotspots(
  data: TrendingItem[],
  minPlatformCount: number = 3
): Array<{ topic: string; platformCount: number; platforms: string[] }> {
  const topicCount: Record<string, Set<string>> = {};
  
  data.forEach(item => {
    const topic = extractMainTopic(item.title);
    if (!topicCount[topic]) {
      topicCount[topic] = new Set();
    }
    topicCount[topic].add(item.platform);
  });
  
  return Object.entries(topicCount)
    .filter(([, platforms]) => platforms.size >= minPlatformCount)
    .map(([topic, platforms]) => ({
      topic,
      platformCount: platforms.size,
      platforms: Array.from(platforms),
    }))
    .sort((a, b) => b.platformCount - a.platformCount);
}

/**
 * 找出平台独特热点
 */
export function findUniqueTopics(
  data: TrendingItem[],
  platform: string
): string[] {
  const platformTopics = new Set(
    data
      .filter(item => item.platform === platform)
      .map(item => extractMainTopic(item.title))
  );
  
  const otherTopics = new Set(
    data
      .filter(item => item.platform !== platform)
      .map(item => extractMainTopic(item.title))
  );
  
  return Array.from(platformTopics).filter(topic => !otherTopics.has(topic));
}

/**
 * 聚合热力图数据
 */
export function aggregateHeatMapData(
  data: TrendingItem[],
  timePoints: string[]
): HeatMapData[] {
  const result: HeatMapData[] = [];
  const categories = Array.from(new Set(data.map(item => item.category)));
  
  categories.forEach(category => {
    timePoints.forEach(time => {
      // 简化版：随机生成数据
      // 实际应该根据真实数据聚合
      const value = Math.random() * 100000;
      result.push({ category, time, value });
    });
  });
  
  return result;
}

/**
 * 计算情感分数
 */
export function calculateSentimentScore(
  items: TrendingItem[]
): { positive: number; neutral: number; negative: number } {
  if (items.length === 0) {
    return { positive: 50, neutral: 30, negative: 20 };
  }
  
  const counts = {
    positive: items.filter(item => item.sentiment === 'positive').length,
    neutral: items.filter(item => item.sentiment === 'neutral').length,
    negative: items.filter(item => item.sentiment === 'negative').length,
  };
  
  const total = items.length;
  
  return {
    positive: Math.round((counts.positive / total) * 100),
    neutral: Math.round((counts.neutral / total) * 100),
    negative: Math.round((counts.negative / total) * 100),
  };
}

/**
 * 提取关键词
 */
export function extractKeywords(
  items: TrendingItem[],
  sentiment: 'positive' | 'negative',
  limit: number = 10
): string[] {
  const filtered = items.filter(item => item.sentiment === sentiment);
  const keywords = filtered.map(item => extractMainTopic(item.title));
  
  // 去重并限制数量
  return Array.from(new Set(keywords)).slice(0, limit);
}

/**
 * 归一化数据到 0-1 范围
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

/**
 * 生成时间点数组
 */
export function generateTimePoints(hours: number = 24): string[] {
  const points: string[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    points.push(`${String(time.getHours()).padStart(2, '0')}:00`);
  }
  
  return points;
}

/**
 * 分组数据
 */
export function groupBy<T>(
  array: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * 排序数据
 */
export function sortByHeat(items: TrendingItem[]): TrendingItem[] {
  return [...items].sort((a, b) => b.heat - a.heat);
}

/**
 * 过滤数据
 */
export function filterByPlatform(
  items: TrendingItem[],
  platform: string
): TrendingItem[] {
  if (platform === 'all') return items;
  return items.filter(item => item.platform === platform);
}

/**
 * 过滤数据（按类别）
 */
export function filterByCategory(
  items: TrendingItem[],
  category: string
): TrendingItem[] {
  if (category === 'all') return items;
  return items.filter(item => item.category === category);
}
