/**
 * SCR-03 创作工作室 V2 - 常量配置
 */

import type { ContentTypeConfig, ThinkingStep } from '../types';

// 内容类型配置
export const CONTENT_TYPE_CONFIGS: Record<string, ContentTypeConfig> = {
  article: {
    type: 'article',
    label: '文章',
    icon: '📝',
    color: '#3b82f6',
    defaultLength: 800,
    description: '长篇图文内容',
  },
  video: {
    type: 'video',
    label: '视频',
    icon: '🎬',
    color: '#a855f7',
    defaultLength: 500,
    description: '视频脚本文案',
  },
  social: {
    type: 'social',
    label: '社交',
    icon: '💬',
    color: '#10b981',
    defaultLength: 200,
    description: '社交媒体文案',
  },
  ad: {
    type: 'ad',
    label: '广告',
    icon: '📢',
    color: '#f59e0b',
    defaultLength: 150,
    description: '营销广告文案',
  },
};

// 思考步骤配置
export const THINKING_STEPS: ThinkingStep[] = [
  {
    id: 0,
    icon: '⟳',
    label: '解析用户意图',
    duration: 1200,
    status: 'pending',
  },
  {
    id: 1,
    icon: '◈',
    label: '检索知识库与热点',
    duration: 1400,
    status: 'pending',
  },
  {
    id: 2,
    icon: '⬡',
    label: '构建内容框架',
    duration: 1300,
    status: 'pending',
  },
  {
    id: 3,
    icon: '✦',
    label: '润色与格式化输出',
    duration: 1100,
    status: 'pending',
  },
];

// 任务状态配置
export const TASK_STATUS_CONFIG = {
  pending: {
    label: '等待中',
    color: '#6b7280',
    icon: '○',
  },
  processing: {
    label: '生成中',
    color: '#3b82f6',
    icon: '◐',
  },
  completed: {
    label: '已完成',
    color: '#10b981',
    icon: '●',
  },
  failed: {
    label: '失败',
    color: '#ef4444',
    icon: '✕',
  },
};

// 优先级配置
export const PRIORITY_CONFIG = {
  1: { label: '低', color: '#6b7280' },
  2: { label: '较低', color: '#3b82f6' },
  3: { label: '中', color: '#10b981' },
  4: { label: '较高', color: '#f59e0b' },
  5: { label: '高', color: '#ef4444' },
};

// 选题来源配置
export const TOPIC_SOURCE_CONFIG = {
  hotspot: {
    label: '热点',
    icon: '🔥',
    color: '#ef4444',
  },
  holiday: {
    label: '节日',
    icon: '🎉',
    color: '#f59e0b',
  },
  industry: {
    label: '行业',
    icon: '🏢',
    color: '#3b82f6',
  },
  custom: {
    label: '自定义',
    icon: '✏️',
    color: '#6b7280',
  },
};

// 统计时间范围配置
export const STATS_TIME_RANGE_CONFIG = {
  today: { label: '今日', days: 1 },
  week: { label: '本周', days: 7 },
  month: { label: '本月', days: 30 },
};

// 动画配置
export const ANIMATION_CONFIG = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5 },
  },
  cardTransition: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4 },
  },
};

// 更新间隔（毫秒）
export const UPDATE_INTERVALS = {
  stats: 30000,      // 统计数据：30秒
  hotTopics: 30000,  // 热点话题：30秒
  autoSave: 5000,    // 自动保存：5秒
};

// 限制配置
export const LIMITS = {
  maxQueueSize: 10,        // 最大队列长度
  maxHistorySize: 50,      // 最大历史记录
  maxQuickTopics: 6,       // 快速选题显示数量
  maxHotInspirations: 8,   // 热点灵感显示数量
};

// 本地存储键
export const STORAGE_KEYS = {
  tasks: 'creation-studio-v2-tasks',
  history: 'creation-studio-v2-history',
  stats: 'creation-studio-v2-stats',
  preferences: 'creation-studio-v2-preferences',
};

// 默认提示词模板
export const DEFAULT_PROMPTS = {
  article: '请撰写一篇关于"{topic}"的深度文章，要求内容专业、结构清晰、观点独到。',
  video: '请为"{topic}"创作一个视频脚本，包含开场、主体内容和结尾，时长约3-5分钟。',
  social: '请为"{topic}"撰写一条社交媒体文案，要求简洁有力、引人注目、易于传播。',
  ad: '请为"{topic}"创作一则广告文案，突出产品特点、激发购买欲望、包含行动号召。',
};
