// 颜色计算工具

import Color from 'color';

/**
 * 平台颜色映射
 */
export const PLATFORM_COLORS: Record<string, string> = {
  weibo: '#ff6b35',      // 橙色
  douyin: '#00d4ff',     // 青色
  zhihu: '#0084ff',      // 蓝色
  bilibili: '#00a1d6',   // B站蓝
  baidu: '#2932e1',      // 百度蓝
  toutiao: '#ff4757',    // 红色
  kuaishou: '#ff6348',   // 橙红
  xiaohongshu: '#ff2d55',// 小红书红
  all: '#00ff88',        // 绿色（全平台）
};

/**
 * 类别颜色映射
 */
export const CATEGORY_COLORS: Record<string, string> = {
  科技: '#00d4ff',
  娱乐: '#ff6b35',
  社会: '#00ff88',
  体育: '#a855f7',
  财经: '#fbbf24',
  游戏: '#ec4899',
  教育: '#3b82f6',
  健康: '#10b981',
  综合: '#8b5cf6',
};

/**
 * 情感颜色
 */
export const SENTIMENT_COLORS = {
  positive: '#00ff88',
  neutral: '#00d4ff',
  negative: '#ff2d78',
};

/**
 * 风险等级颜色
 */
export const RISK_COLORS = {
  low: '#00ff88',
  medium: '#fbbf24',
  high: '#ff2d78',
};

/**
 * 获取平台颜色
 */
export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] || PLATFORM_COLORS.all;
}

/**
 * 获取类别颜色
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.综合;
}

/**
 * 获取情感颜色
 */
export function getSentimentColor(sentiment: 'positive' | 'neutral' | 'negative'): string {
  return SENTIMENT_COLORS[sentiment];
}

/**
 * 获取风险颜色
 */
export function getRiskColor(level: 'low' | 'medium' | 'high'): string {
  return RISK_COLORS[level];
}

/**
 * 生成热力图颜色渐变
 */
export function generateHeatMapGradient(): string[] {
  return [
    'rgba(0, 212, 255, 0.1)',
    'rgba(0, 212, 255, 0.3)',
    'rgba(0, 212, 255, 0.5)',
    'rgba(0, 212, 255, 0.7)',
    'rgba(0, 212, 255, 0.9)',
    'rgba(255, 107, 53, 0.7)',
    'rgba(255, 107, 53, 0.9)',
  ];
}

/**
 * 根据值生成颜色（0-1范围）
 */
export function valueToColor(value: number, colorStart: string, colorEnd: string): string {
  const start = Color(colorStart);
  const end = Color(colorEnd);
  
  return start.mix(end, value).hex();
}

/**
 * 生成渐变色数组
 */
export function generateGradient(
  colorStart: string,
  colorEnd: string,
  steps: number
): string[] {
  const colors: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1);
    colors.push(valueToColor(ratio, colorStart, colorEnd));
  }
  
  return colors;
}

/**
 * 添加透明度
 */
export function addAlpha(color: string, alpha: number): string {
  return Color(color).alpha(alpha).string();
}

/**
 * 变亮
 */
export function lighten(color: string, amount: number): string {
  return Color(color).lighten(amount).hex();
}

/**
 * 变暗
 */
export function darken(color: string, amount: number): string {
  return Color(color).darken(amount).hex();
}

/**
 * 生成阴影颜色
 */
export function generateShadow(color: string, alpha: number = 0.6): string {
  return `0 0 10px ${addAlpha(color, alpha)}`;
}
