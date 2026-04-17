/**
 * SCR-03 创作工作室 V2 - 统计数据计算服务
 */

import type { CreationTask, CreationStats, StatsTimeRange } from '../types';

// 计算统计数据
export function calculateStats(
  tasks: CreationTask[],
  history: CreationTask[],
  timeRange: StatsTimeRange = 'today'
): CreationStats {
  const now = new Date();
  const startDate = getStartDate(now, timeRange);
  
  // 筛选时间范围内的任务
  const filteredHistory = history.filter(task => {
    const completedAt = task.completedAt;
    return completedAt && completedAt >= startDate && completedAt <= now;
  });
  
  // 计算今日数据
  const today = {
    taskCount: filteredHistory.length,
    wordCount: filteredHistory.reduce((sum, task) => sum + (task.metadata?.wordCount || 0), 0),
    duration: filteredHistory.reduce((sum, task) => sum + (task.metadata?.duration || 0), 0),
    completionRate: calculateCompletionRate(tasks, filteredHistory),
  };
  
  // 计算类型分布
  const typeDistribution = {
    article: filteredHistory.filter(t => t.type === 'article').length,
    video: filteredHistory.filter(t => t.type === 'video').length,
    social: filteredHistory.filter(t => t.type === 'social').length,
    ad: filteredHistory.filter(t => t.type === 'ad').length,
  };
  
  // 计算速度趋势
  const speedTrend = calculateSpeedTrend(filteredHistory, timeRange);
  
  return {
    today,
    typeDistribution,
    speedTrend,
  };
}

// 获取开始日期
function getStartDate(now: Date, timeRange: StatsTimeRange): Date {
  const start = new Date(now);
  
  switch (timeRange) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      break;
  }
  
  return start;
}

// 计算完成率
function calculateCompletionRate(tasks: CreationTask[], history: CreationTask[]): number {
  // 只计算已完成的任务
  const completedTasks = history.filter(t => t.status === 'completed').length;
  
  // 如果没有任何任务，返回0
  if (completedTasks === 0) return 0;
  
  // 如果有完成的任务，返回100%（因为history里都是已完成的）
  return 100;
}

// 计算速度趋势
function calculateSpeedTrend(
  history: CreationTask[],
  timeRange: StatsTimeRange
): Array<{ time: string; speed: number }> {
  if (history.length === 0) {
    return [];
  }
  
  // 按时间分组
  const groups = groupByTime(history, timeRange);
  
  // 计算每组的平均速度（字/分钟）
  return groups.map(group => ({
    time: group.label,
    speed: calculateAverageSpeed(group.tasks),
  }));
}

// 按时间分组
function groupByTime(
  history: CreationTask[],
  timeRange: StatsTimeRange
): Array<{ label: string; tasks: CreationTask[] }> {
  const groups: Map<string, CreationTask[]> = new Map();
  
  history.forEach(task => {
    if (!task.completedAt) return;
    
    const label = getTimeLabel(task.completedAt, timeRange);
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(task);
  });
  
  // 转换为数组并排序
  return Array.from(groups.entries())
    .map(([label, tasks]) => ({ label, tasks }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// 获取时间标签
function getTimeLabel(date: Date, timeRange: StatsTimeRange): string {
  switch (timeRange) {
    case 'today':
      return `${date.getHours()}:00`;
    case 'week':
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekDays[date.getDay()];
    case 'month':
      return `${date.getMonth() + 1}/${date.getDate()}`;
  }
}

// 计算平均速度
function calculateAverageSpeed(tasks: CreationTask[]): number {
  if (tasks.length === 0) return 0;
  
  const totalSpeed = tasks.reduce((sum, task) => {
    const wordCount = task.metadata?.wordCount || 0;
    const duration = task.metadata?.duration || 1;
    return sum + (wordCount / duration) * 60; // 字/分钟
  }, 0);
  
  return Math.round(totalSpeed / tasks.length);
}

// 生成 Mock 趋势数据（用于演示）
export function generateMockSpeedTrend(timeRange: StatsTimeRange): Array<{ time: string; speed: number }> {
  const baseSpeed = 800;
  const variance = 200;
  
  let labels: string[];
  
  switch (timeRange) {
    case 'today':
      labels = ['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
      break;
    case 'week':
      labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      break;
    case 'month':
      labels = Array.from({ length: 10 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (9 - i) * 3);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });
      break;
  }
  
  return labels.map(label => ({
    time: label,
    speed: baseSpeed + Math.floor(Math.random() * variance) - variance / 2,
  }));
}
