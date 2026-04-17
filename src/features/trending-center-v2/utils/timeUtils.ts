// 时间处理工具

import { format, subHours, subDays } from 'date-fns';

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return format(date, 'HH:mm:ss');
}

/**
 * 格式化日期
 */
export function formatDate(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return format(date, 'yyyy-MM-dd');
}

/**
 * 格式化日期时间
 */
export function formatDateTime(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * 生成过去N小时的时间点
 */
export function generatePastHours(hours: number): string[] {
  const points: string[] = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const time = subHours(now, i);
    points.push(format(time, 'HH:mm'));
  }
  
  return points;
}

/**
 * 生成过去N天的日期点
 */
export function generatePastDays(days: number): string[] {
  const points: string[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i);
    points.push(format(date, 'MM-dd'));
  }
  
  return points;
}

/**
 * 获取相对时间描述
 */
export function getRelativeTime(timestamp: string | number | Date): string {
  const now = Date.now();
  const time = new Date(timestamp).getTime();
  const diff = now - time;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  return '刚刚';
}

/**
 * 判断是否是今天
 */
export function isToday(timestamp: string | number | Date): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/**
 * 获取时间范围的开始和结束时间
 */
export function getTimeRange(range: '1h' | '6h' | '24h' | '7d'): {
  start: Date;
  end: Date;
} {
  const end = new Date();
  let start: Date;
  
  switch (range) {
    case '1h':
      start = subHours(end, 1);
      break;
    case '6h':
      start = subHours(end, 6);
      break;
    case '24h':
      start = subHours(end, 24);
      break;
    case '7d':
      start = subDays(end, 7);
      break;
    default:
      start = subHours(end, 24);
  }
  
  return { start, end };
}

/**
 * 格式化持续时间
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`;
  }
  return `${seconds}秒`;
}
