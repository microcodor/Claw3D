'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import TaskQueue from '../components/TaskQueue/TaskQueue';
import GenerationPanel from '../components/GenerationPanel/GenerationPanel';
import HistoryPanel from '../components/HistoryPanel/HistoryPanel';
import CreationStats from '../components/CreationStats/CreationStats';
import HotInspirations from '../components/HotInspirations/HotInspirations';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import type { CreationTask, CreationStats as StatsType } from '../types';
import { calculateStats } from '../services/statsCalculator';
import { ANIMATION_CONFIG } from '../utils/constants';
import styles from '../styles/creation-studio-v2.module.css';

// V1 Mock 数据（来自 creation-studio-v1）
const MOCK_MESSAGES = [
  {
    user: '分析一下AI大模型竞争格局',
    assistant: `# AI大模型竞争格局深度分析

【数据来源】综合微博热搜、知乎热榜、36氪科技新闻
【采集时间】2026-04-16 10:30
【热度指数】★★★★★ 985万

## 🔥 核心观点

当前AI大模型市场呈现"三足鼎立"格局：OpenAI的GPT系列、Google的Gemini、以及中国的文心一言和通义千问。技术竞争焦点已从参数规模转向实际应用效果和成本控制。

## 📊 市场数据

- GPT-4市场占有率：42%
- Gemini市场占有率：28%
- 国产大模型合计：30%
- 预计2026年市场规模：1200亿美元

## 🎬 视频脚本建议

**开场**（0-15秒）
震撼的AI视觉效果，配合紧张的电子音乐

**主体内容**（15-90秒）
- 展示各大模型的核心能力对比
- 用动画呈现市场份额变化
- 采访行业专家观点

**结尾**（90-120秒）
总结未来趋势，引发观众思考

**视觉风格**：科技感、未来感、数据可视化
**音效配乐**：电子音乐、科技音效
**发布策略**：工作日上午10点，配合热点话题

#AI大模型 #科技前沿 #人工智能`,
  },
  {
    user: '网络数据泄露事件如何防范',
    assistant: `# 网络数据泄露防范指南

【数据来源】微博热搜、IT之家安全资讯、知乎安全话题
【采集时间】2026-04-16 10:35
【热度指数】★★★★☆ 820万

## ⚠️ 风险警示

2026年Q1数据泄露事件同比增长45%，个人信息安全面临严峻挑战。主要泄露途径包括：钓鱼网站、恶意软件、弱密码攻击。

## 🛡️ 防范措施

1. **密码管理**：使用强密码+密码管理器
2. **双因素认证**：所有重要账户启用2FA
3. **定期检查**：监控账户异常登录
4. **数据加密**：敏感文件本地加密存储
5. **软件更新**：及时安装安全补丁

## 🎬 视频脚本

**开场**：真实案例引入，展示数据泄露危害
**教学部分**：分步骤演示防护措施
**互动环节**：观众自查清单
**结尾**：强调安全意识的重要性

**视觉风格**：警示色调、信息图表、实操演示
**目标受众**：18-45岁互联网用户
**预期效果**：提升安全意识，获得实用技能

#网络安全 #数据保护 #隐私安全`,
  },
  {
    user: '脑机接口技术最新进展',
    assistant: `# 脑机接口技术突破性进展

【数据来源】今日头条科技频道、36氪深度报道、Nature论文
【采集时间】2026-04-16 10:40
【热度指数】★★★★★ 756万

## 🧠 技术突破

Neuralink最新N2芯片实现1024通道神经信号采集，信号精度提升300%。临床试验显示瘫痪患者可通过意念控制机械臂完成复杂动作。

## 📈 应用前景

- **医疗领域**：帮助残障人士恢复运动能力
- **娱乐领域**：沉浸式游戏体验
- **教育领域**：直接知识传输（理论阶段）
- **工业领域**：精密操作控制

## ⚖️ 伦理挑战

隐私保护、技术滥用、社会公平等问题亟待解决

## 🎬 视频创作方案

**片头**：科幻感十足的脑机接口动画
**核心内容**：
- 技术原理3D可视化
- 真实案例采访
- 专家解读未来趋势
- 伦理讨论引发思考

**时长**：8-10分钟深度内容
**平台**：B站、YouTube
**受众**：科技爱好者、医学从业者

#脑机接口 #神经科技 #未来科技`,
  },
];

// 消息索引（用于循环）
let messageIndex = 0;

// 自动任务生成器（使用 V1 数据）
function autoGenerateTask(): CreationTask {
  const types: Array<'article' | 'video' | 'social' | 'ad'> = ['article', 'video', 'social', 'ad'];
  const priorities: Array<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];
  
  // 从 V1 Mock 数据中获取选题
  const message = MOCK_MESSAGES[messageIndex % MOCK_MESSAGES.length];
  messageIndex++;
  
  const type = types[Math.floor(Math.random() * types.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  
  return {
    id: `task-${Date.now()}-${Math.random()}`,
    title: message.user,
    type,
    status: 'pending',
    priority,
    source: 'custom',
    createdAt: new Date(),
    prompt: message.user,
    // 存储对应的生成结果
    metadata: {
      mockOutput: message.assistant,
    },
  };
}

// 生成 Mock 内容（使用 V1 数据）
function generateMockContent(task: CreationTask): string {
  // 如果任务有预设的 mock 输出，使用它
  if (task.metadata?.mockOutput) {
    return task.metadata.mockOutput;
  }
  
  // 否则使用默认模板
  return `# ${task.title}

这是一个自动生成的内容示例。

## 核心观点

基于当前热点和用户需求，我们提供以下分析和建议。

## 详细内容

内容正在生成中...`;
}

// 延迟函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage 键名
const STORAGE_KEYS = {
  TASKS: 'scr03_tasks',
  HISTORY: 'scr03_history',
  STATS: 'scr03_stats',
};

// 从 localStorage 加载数据
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    const parsed = JSON.parse(stored);
    // 转换日期字符串回 Date 对象
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        startedAt: item.startedAt ? new Date(item.startedAt) : undefined,
        completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
      })) as T;
    }
    return parsed;
  } catch (error) {
    console.error(`[Storage] Failed to load ${key}:`, error);
    return defaultValue;
  }
}

// 保存到 localStorage
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error);
  }
}

export default function CreationStudioScreenV2() {
  // 状态管理 - 从 localStorage 初始化
  const [tasks, setTasks] = useState<CreationTask[]>(() => 
    loadFromStorage(STORAGE_KEYS.TASKS, [])
  );
  const [currentTask, setCurrentTask] = useState<CreationTask | null>(null);
  const [history, setHistory] = useState<CreationTask[]>(() =>
    loadFromStorage(STORAGE_KEYS.HISTORY, [])
  );
  const [isRunning, setIsRunning] = useState(true);
  const isExecutingRef = useRef(false);
  const [showingResult, setShowingResult] = useState(false); // 是否正在展示结果
  
  const [stats, setStats] = useState<StatsType>({
    today: {
      taskCount: 0,
      wordCount: 0,
      duration: 0,
      completionRate: 0,
    },
    typeDistribution: {
      article: 0,
      video: 0,
      social: 0,
      ad: 0,
    },
    speedTrend: [],
  });

  // 保存 tasks 到 localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  // 保存 history 到 localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HISTORY, history);
  }, [history]);

  // 初始化：如果队列为空，生成初始任务
  useEffect(() => {
    if (tasks.length === 0) {
      console.log('[SCR-03 V2] Initializing task queue...');
      const initialTasks = Array.from({ length: 5 }, () => autoGenerateTask());
      setTasks(initialTasks);
    }
  }, []);

  // 自动执行任务
  const executeTask = useCallback(async (task: CreationTask) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    setShowingResult(false);

    console.log('[SCR-03 V2] Starting task execution:', task.title);
    
    try {
      // 1. 设置为当前任务（思考阶段）
      setCurrentTask({
        ...task,
        status: 'processing',
        startedAt: new Date(),
      });

      // 2. 思考过程（8秒：4步 × 2秒）
      await sleep(8000);

      // 3. 生成内容
      const content = generateMockContent(task);
      const wordCount = content.length;

      // 4. 流式输出（6秒 - 慢速打字机效果）
      await sleep(6000);

      // 5. 完成动画（1秒）
      await sleep(1000);

      // 6. 完成任务，进入展示阶段
      const completedTask: CreationTask = {
        ...task,
        status: 'completed',
        completedAt: new Date(),
        output: content,
        metadata: {
          wordCount,
          duration: 15, // 总耗时15秒（8+6+1）
        },
      };

      console.log('[SCR-03 V2] Task completed, showing result for 20s:', task.title);
      
      // 设置为完成状态，展示结果
      setCurrentTask(completedTask);
      setShowingResult(true);

      // 7. 展示结果 20 秒
      await sleep(20000);

      console.log('[SCR-03 V2] Result display finished, updating history and stats');

      // 8. 更新历史记录（添加到顶部）
      setHistory(prev => [completedTask, ...prev].slice(0, 50));
      
      // 9. 清除当前任务
      setCurrentTask(null);
      setShowingResult(false);

      // 10. 等待间隔（2秒）
      await sleep(2000);

    } catch (error) {
      console.error('[SCR-03 V2] Task execution error:', error);
      setCurrentTask(null);
      setShowingResult(false);
    } finally {
      isExecutingRef.current = false;
    }
  }, []);

  // 自动任务循环
  useEffect(() => {
    if (!isRunning) return;
    if (isExecutingRef.current) return;
    if (currentTask) return;
    if (showingResult) return; // 正在展示结果时不执行新任务

    // 检查队列
    if (tasks.length === 0) {
      console.log('[SCR-03 V2] Queue empty, generating new tasks...');
      const newTasks = Array.from({ length: 5 }, () => autoGenerateTask());
      setTasks(newTasks);
      return;
    }

    // 取出第一个任务执行
    const nextTask = tasks[0];
    setTasks(prev => prev.slice(1)); // 从队列中移除
    executeTask(nextTask);

  }, [tasks, currentTask, isRunning, showingResult, executeTask]);

  // 自动补充队列
  useEffect(() => {
    if (tasks.length < 5 && !isExecutingRef.current) {
      const needed = 5 - tasks.length;
      const newTasks = Array.from({ length: needed }, () => autoGenerateTask());
      setTasks(prev => [...prev, ...newTasks]);
      console.log(`[SCR-03 V2] Queue refilled: added ${needed} tasks`);
    }
  }, [tasks.length]);

  // 定期更新统计数据
  useEffect(() => {
    // 立即更新一次
    const newStats = calculateStats(tasks, history, 'today');
    setStats(newStats);
    
    // 然后每5秒更新一次
    const interval = setInterval(() => {
      const newStats = calculateStats(tasks, history, 'today');
      setStats(newStats);
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks, history]);

  // 手动创建任务（从灵感来源）
  const handleCreateTask = useCallback((task: CreationTask) => {
    console.log('[SCR-03 V2] Manual task created:', task.title);
    setTasks(prev => [...prev, task]);
  }, []);

  // 删除任务（保留接口，但不显示按钮）
  const handleDeleteTask = useCallback((taskId: string) => {
    console.log('[SCR-03 V2] Task deleted:', taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  // 重试任务（保留接口）
  const handleRetryTask = useCallback((task: CreationTask) => {
    console.log('[SCR-03 V2] Task retry:', task.title);
    const newTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      status: 'pending' as const,
      createdAt: new Date(),
      startedAt: undefined,
      completedAt: undefined,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  // 完成任务（GenerationPanel 回调）
  const handleCompleteGeneration = useCallback((task: CreationTask) => {
    // 这个回调现在由自动流程处理，保留接口兼容性
    console.log('[SCR-03 V2] Generation completed callback:', task.title);
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* 主要内容区域 */}
        <div className={styles.mainContent}>
          {/* 左列 */}
          <div className={styles.leftColumn}>
            <motion.div
              {...ANIMATION_CONFIG.slideIn}
              transition={{ ...ANIMATION_CONFIG.slideIn.transition, delay: 0.1 }}
              style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
            >
              <TaskQueue
                tasks={tasks}
                currentTask={currentTask}
                onStartTask={() => {}} // 自动执行，不需要手动触发
                onDeleteTask={handleDeleteTask}
                onRetryTask={handleRetryTask}
              />
            </motion.div>

            <motion.div
              {...ANIMATION_CONFIG.slideIn}
              transition={{ ...ANIMATION_CONFIG.slideIn.transition, delay: 0.2 }}
              style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
            >
              <HotInspirations onCreateTask={handleCreateTask} />
            </motion.div>
          </div>

          {/* 中列 */}
          <div className={styles.centerColumn}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
            >
              <GenerationPanel
                currentTask={currentTask}
                onComplete={handleCompleteGeneration}
              />
            </motion.div>
          </div>

          {/* 右列 */}
          <div className={styles.rightColumn}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{ flexShrink: 0 }}
            >
              <CreationStats stats={stats} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ flex: 1, display: 'flex', minHeight: 0 }}
            >
              <HistoryPanel
                history={history}
                onRetryTask={handleRetryTask}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
