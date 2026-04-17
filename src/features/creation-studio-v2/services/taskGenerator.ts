/**
 * SCR-03 创作工作室 V2 - 任务生成服务
 */

import type { CreationTask, ContentType, TopicSource, TaskPriority } from '../types';
import { DEFAULT_PROMPTS } from '../utils/constants';

// 生成任务 ID
function generateTaskId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 创建任务
export function createTask(params: {
  title: string;
  type: ContentType;
  source: TopicSource;
  priority?: TaskPriority;
  prompt?: string;
}): CreationTask {
  const { title, type, source, priority = 3, prompt } = params;
  
  return {
    id: generateTaskId(),
    title,
    type,
    status: 'pending',
    priority,
    source,
    createdAt: new Date(),
    prompt: prompt || DEFAULT_PROMPTS[type].replace('{topic}', title),
  };
}

// 从热点创建任务
export function createTaskFromHotspot(params: {
  title: string;
  type: ContentType;
  heat?: number;
}): CreationTask {
  const { title, type, heat } = params;
  
  // 根据热度设置优先级
  let priority: TaskPriority = 3;
  if (heat && heat > 1000000) priority = 5;
  else if (heat && heat > 500000) priority = 4;
  else if (heat && heat > 100000) priority = 3;
  else priority = 2;
  
  return createTask({
    title: `${title} - 热点创作`,
    type,
    source: 'hotspot',
    priority,
    prompt: `基于当前热点话题"${title}"，创作一篇${getTypeLabel(type)}内容。要求紧跟热点，观点新颖，内容有深度。`,
  });
}

// 从节日创建任务
export function createTaskFromHoliday(params: {
  holidayName: string;
  type: ContentType;
  keywords?: string[];
}): CreationTask {
  const { holidayName, type, keywords = [] } = params;
  
  const keywordText = keywords.length > 0 ? `，融入关键词：${keywords.join('、')}` : '';
  
  return createTask({
    title: `${holidayName} - 节日营销`,
    type,
    source: 'holiday',
    priority: 4,
    prompt: `围绕"${holidayName}"节日主题，创作一篇${getTypeLabel(type)}内容${keywordText}。要求贴合节日氛围，情感真挚，易于传播。`,
  });
}

// 从行业模板创建任务
export function createTaskFromIndustry(params: {
  industryName: string;
  templateName: string;
  type: ContentType;
  customPrompt?: string;
}): CreationTask {
  const { industryName, templateName, type, customPrompt } = params;
  
  return createTask({
    title: `${industryName} - ${templateName}`,
    type,
    source: 'industry',
    priority: 3,
    prompt: customPrompt || `为${industryName}行业创作一篇${templateName}主题的${getTypeLabel(type)}内容。要求专业、实用、有针对性。`,
  });
}

// 获取类型标签
function getTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    article: '文章',
    video: '视频脚本',
    social: '社交媒体文案',
    ad: '广告文案',
  };
  return labels[type];
}

// 批量创建任务
export function createBatchTasks(params: {
  titles: string[];
  type: ContentType;
  source: TopicSource;
  priority?: TaskPriority;
}): CreationTask[] {
  const { titles, type, source, priority } = params;
  
  return titles.map(title => createTask({
    title,
    type,
    source,
    priority,
  }));
}
