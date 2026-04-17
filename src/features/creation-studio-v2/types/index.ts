/**
 * SCR-03 创作工作室 V2 - 类型定义
 */

// 内容类型
export type ContentType = 'article' | 'video' | 'social' | 'ad';

// 任务状态
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 任务优先级
export type TaskPriority = 1 | 2 | 3 | 4 | 5;

// 选题来源
export type TopicSource = 'hotspot' | 'holiday' | 'industry' | 'custom';

// 创作任务
export interface CreationTask {
  id: string;
  title: string;
  type: ContentType;
  status: TaskStatus;
  priority: TaskPriority;
  source: TopicSource;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  prompt: string;
  output?: string;
  metadata?: {
    wordCount?: number;
    duration?: number;
    model?: string;
    error?: string;
    mockOutput?: string; // V1 Mock 数据的生成结果
  };
}

// 任务元数据
export interface TaskMetadata {
  wordCount?: number;
  duration?: number;
  model?: string;
  error?: string;
  mockOutput?: string; // V1 Mock 数据的生成结果
}

// 创作统计
export interface CreationStats {
  today: {
    taskCount: number;
    wordCount: number;
    duration: number;
    completionRate: number;
  };
  typeDistribution: {
    article: number;
    video: number;
    social: number;
    ad: number;
  };
  speedTrend: Array<{
    time: string;
    speed: number;
  }>;
}

// 快速选题
export interface QuickTopic {
  id: string;
  title: string;
  description: string;
  source: TopicSource;
  heat?: number;
  category?: string;
  tags?: string[];
  template?: string;
}

// 节日数据
export interface Holiday {
  id: string;
  name: string;
  date: string;
  description: string;
  keywords: string[];
  templates: string[];
}

// 行业模板
export interface IndustryTemplate {
  id: string;
  name: string;
  industry: string;
  description: string;
  prompt: string;
  type: ContentType;
}

// 历史记录筛选
export interface HistoryFilter {
  type?: ContentType;
  status?: TaskStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
  keyword?: string;
}

// 生成进度
export interface GenerationProgress {
  taskId: string;
  phase: 'thinking' | 'generating' | 'done';
  step?: number;
  totalSteps?: number;
  progress?: number;
  currentText?: string;
  speed?: number;
  estimatedTime?: number;
}

// 思考步骤
export interface ThinkingStep {
  id: number;
  icon: string;
  label: string;
  duration: number;
  status: 'pending' | 'active' | 'completed';
}

// 内容类型配置
export interface ContentTypeConfig {
  type: ContentType;
  label: string;
  icon: string;
  color: string;
  defaultLength: number;
  description: string;
}

// 统计时间范围
export type StatsTimeRange = 'today' | 'week' | 'month';

// 图表数据
export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];
}
