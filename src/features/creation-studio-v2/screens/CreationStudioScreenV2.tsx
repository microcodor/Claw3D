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

// V1 Mock 数据（5个网络安全相关选题）
// 主题：网络安全威胁与防护
const MOCK_MESSAGES = [
  {
    user: '勒索软件攻击激增，企业如何应对',
    assistant: `# 勒索软件攻击防御全攻略

【数据来源】FreeBuf、安全客、Cybersecurity News
【采集时间】2026-04-21 09:00
【热度指数】★★★★★ 1250万
【威胁等级】🔴 极高

## 🚨 威胁态势

2026年Q1勒索软件攻击同比激增67%，平均赎金要求达到500万美元。新型勒索软件采用双重勒索策略：加密数据+威胁公开泄露，给企业带来巨大压力。

## 🎯 攻击手法

1. **钓鱼邮件**：伪装成合法文件，诱导员工点击
2. **漏洞利用**：利用未修补的系统漏洞入侵
3. **供应链攻击**：通过第三方软件植入后门
4. **RDP暴力破解**：攻击远程桌面协议弱密码
5. **内部威胁**：离职员工或被收买的内鬼

## 🛡️ 防御策略

### 事前预防
- **定期备份**：3-2-1备份原则（3份副本、2种介质、1份离线）
- **补丁管理**：及时更新系统和应用程序
- **权限控制**：最小权限原则，限制管理员账户
- **安全培训**：提升员工安全意识，识别钓鱼邮件
- **网络隔离**：关键业务系统与办公网络隔离

### 事中响应
- **断网隔离**：发现感染立即断网，防止横向传播
- **保留证据**：不要删除日志，便于后续分析
- **启动预案**：按照应急响应流程处置
- **专家支持**：联系安全厂商或应急响应团队

### 事后恢复
- **数据恢复**：从备份恢复数据，不建议支付赎金
- **漏洞修复**：找出入侵路径，修复安全漏洞
- **加固系统**：重新部署安全防护措施
- **总结复盘**：分析攻击过程，完善防御体系

## 💡 最佳实践

**零信任架构**：不信任任何内外部连接，持续验证
**EDR部署**：终端检测与响应，实时监控异常行为
**SIEM系统**：安全信息与事件管理，集中分析日志
**渗透测试**：定期进行红蓝对抗，发现安全短板

## 📊 成本分析

- 支付赎金：平均500万美元（且不保证恢复）
- 业务中断：每小时损失10-50万美元
- 声誉损失：客户流失、股价下跌
- 合规罚款：GDPR等法规处罚

**结论**：预防成本远低于被攻击后的损失！

#勒索软件 #网络安全 #企业防护 #数据安全`,
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
    user: '元宇宙产业发展现状与趋势',
    assistant: `# 元宇宙产业深度解析

【数据来源】36氪科技报道、虎嗅深度分析、IDC研究报告
【采集时间】2026-04-16 11:00
【热度指数】★★★★☆ 680万

## 🌐 产业现状

2026年全球元宇宙市场规模突破5000亿美元，VR/AR设备出货量同比增长120%。Meta、苹果、字节跳动等巨头持续加码投入。

## 💡 核心技术

- **虚拟现实**：8K分辨率、120Hz刷新率成为标配
- **数字孪生**：工业元宇宙应用落地加速
- **区块链**：数字资产确权与交易体系完善
- **AI驱动**：智能NPC、自动内容生成

## 📱 应用场景

1. **社交娱乐**：虚拟演唱会、沉浸式游戏
2. **远程办公**：虚拟会议室、协作空间
3. **教育培训**：虚拟实验室、技能训练
4. **电商零售**：虚拟试衣、3D展厅

## 🎬 内容创作建议

**视觉呈现**：炫酷的3D场景、虚拟世界漫游
**采访对象**：行业专家、创业者、用户体验
**数据图表**：市场规模、用户增长、投资趋势
**互动环节**：观众投票、问答互动

**平台选择**：抖音、B站、小红书
**发布时间**：周末晚上8点黄金时段

#元宇宙 #虚拟现实 #数字经济`,
  },
  {
    user: '量子计算商业化进程加速',
    assistant: `# 量子计算：从实验室走向商业应用

【数据来源】MIT科技评论、Nature量子专刊、科技日报
【采集时间】2026-04-16 11:15
【热度指数】★★★★★ 890万

## ⚛️ 技术突破

IBM发布1000量子比特处理器，谷歌实现量子纠错里程碑。中国"祖冲之号"在超导量子计算领域取得重大进展。

## 🚀 商业应用

- **药物研发**：分子模拟速度提升百万倍
- **金融建模**：风险评估与投资组合优化
- **密码学**：量子加密通信网络建设
- **材料科学**：新材料设计与性能预测

## 💰 市场前景

预计2030年量子计算市场规模达650亿美元，年复合增长率超过30%。各国政府和科技巨头投入超千亿美元。

## 🎯 投资机会

**硬件厂商**：量子芯片、低温设备
**软件平台**：量子算法、开发工具
**应用服务**：行业解决方案提供商

## 🎬 视频制作方案

**开场**：震撼的量子世界可视化
**科普部分**：量子叠加、量子纠缠原理
**应用展示**：真实案例、专家访谈
**未来展望**：技术路线图、投资建议

**风格定位**：硬核科技、深度解析
**目标观众**：科技从业者、投资人、学生
**时长**：10-15分钟深度内容

#量子计算 #前沿科技 #科技投资`,
  },
];

// 任务类型和优先级配置（固定顺序）
// 顺序：网络安全 → 脑机接口 → AI大模型 → 元宇宙 → 量子计算
// 全部改为文章类型，都有文案生成动画
const TASK_CONFIGS = [
  { type: 'article' as const, priority: 4 as const },  // 网络安全 - 文章
  { type: 'article' as const, priority: 5 as const },  // 脑机接口 - 文章
  { type: 'article' as const, priority: 5 as const },  // AI大模型 - 文章
  { type: 'article' as const, priority: 3 as const },  // 元宇宙 - 文章
  { type: 'article' as const, priority: 5 as const },  // 量子计算 - 文章
];

// 自动任务生成器（使用 V1 数据，固定顺序）
// 使用闭包来保持 messageIndex 的状态
const createTaskGenerator = () => {
  let messageIndex = 0;
  
  return (): CreationTask => {
    // 从 V1 Mock 数据中按顺序获取选题
    const index = messageIndex % MOCK_MESSAGES.length;
    const message = MOCK_MESSAGES[index];
    const config = TASK_CONFIGS[index];
    
    messageIndex++;
    
    return {
      id: `task-${Date.now()}-${Math.random()}`,
      title: message.user,
      type: config.type,
      status: 'pending',
      priority: config.priority,
      source: 'custom',
      createdAt: new Date(),
      prompt: message.user,
      // 存储对应的生成结果
      metadata: {
        mockOutput: message.assistant,
      },
    };
  };
};

const autoGenerateTask = createTaskGenerator();

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
  INITIALIZED: 'scr03_initialized', // 标记是否已初始化
};

// 生成初始任务队列
function generateInitialTasks(): CreationTask[] {
  const tasks = Array.from({ length: 5 }, () => autoGenerateTask());
  console.log('[SCR-03 V2] Generated initial tasks:');
  tasks.forEach((task, index) => {
    console.log(`  ${index + 1}. ${task.title} (${task.type}, P${task.priority})`);
  });
  return tasks;
}

// 从 localStorage 加载数据（页面刷新时不加载历史）
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  // 页面刷新时清空历史记录
  if (key === STORAGE_KEYS.HISTORY) {
    localStorage.removeItem(key);
    return defaultValue;
  }
  
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
  // 状态管理 - 页面刷新时重置
  const [tasks, setTasks] = useState<CreationTask[]>(() => {
    // 页面刷新时重置为初始队列
    const initialTasks = generateInitialTasks();
    return initialTasks;
  });
  const [currentTask, setCurrentTask] = useState<CreationTask | null>(null);
  const [history, setHistory] = useState<CreationTask[]>([]); // 页面刷新时清空历史
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

  // 页面刷新时清空localStorage
  useEffect(() => {
    console.log('[SCR-03 V2] Page loaded, clearing history from localStorage');
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STATS);
  }, []);

  // 自动执行任务
  const executeTask = useCallback(async (task: CreationTask) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    
    console.log('[SCR-03 V2] ========================================');
    console.log('[SCR-03 V2] Starting task execution:', task.title);
    console.log('[SCR-03 V2] Task type:', task.type, 'Priority:', task.priority);
    
    try {
      // 1. 设置为当前任务（思考阶段）
      setCurrentTask({
        ...task,
        status: 'processing',
        startedAt: new Date(),
      });

      // 2. 思考过程（8秒：4步 × 2秒）
      console.log('[SCR-03 V2] Phase 1: Thinking (8s)...');
      await sleep(8000);

      // 3. 生成内容
      console.log('[SCR-03 V2] Phase 2: Generating content (6s)...');
      const content = generateMockContent(task);
      const wordCount = content.length;

      // 4. 流式输出（6秒 - 慢速打字机效果）
      await sleep(6000);

      // 5. 完成动画（1秒）
      console.log('[SCR-03 V2] Phase 3: Completion animation (1s)...');
      await sleep(1000);

      // 6. 完成任务
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

      console.log('[SCR-03 V2] Task completed, adding to history and removing from queue');
      
      // 7. 立即添加到历史记录（添加到顶部）
      setHistory(prev => {
        const newHistory = [completedTask, ...prev].slice(0, 50);
        console.log('[SCR-03 V2] History updated, count:', newHistory.length);
        return newHistory;
      });
      
      // 8. 从队列中移除该任务
      setTasks(prev => {
        const newQueue = prev.filter(t => t.id !== task.id);
        console.log('[SCR-03 V2] Task removed from queue, new length:', newQueue.length);
        return newQueue;
      });
      
      // 9. 清除当前任务
      console.log('[SCR-03 V2] Clearing current task');
      setCurrentTask(null);

      console.log('[SCR-03 V2] Task cycle completed');
      console.log('[SCR-03 V2] ========================================');

    } catch (error) {
      console.error('[SCR-03 V2] Task execution error:', error);
      setCurrentTask(null);
    } finally {
      // 10. 重置执行标志并等待间隔
      console.log('[SCR-03 V2] Finally: setting isExecutingRef.current = false');
      isExecutingRef.current = false;
      
      // 等待2秒后，useEffect 会自动触发下一个任务
      console.log('[SCR-03 V2] Waiting 2s before next task can start...');
      await sleep(2000);
      console.log('[SCR-03 V2] Ready for next task');
    }
  }, []); // 空依赖数组，因为我们使用 setState 的函数形式

  // 自动任务循环
  useEffect(() => {
    console.log('[SCR-03 V2] useEffect triggered - isRunning:', isRunning, 'isExecuting:', isExecutingRef.current, 'currentTask:', currentTask?.title, 'tasks.length:', tasks.length);
    
    if (!isRunning) {
      console.log('[SCR-03 V2] Not running, skipping');
      return;
    }
    if (isExecutingRef.current) {
      console.log('[SCR-03 V2] Already executing, skipping');
      return;
    }
    if (currentTask) {
      console.log('[SCR-03 V2] Current task exists, skipping');
      return;
    }

    // 检查队列
    if (tasks.length === 0) {
      console.log('[SCR-03 V2] Queue empty, all tasks completed. Waiting...');
      // 不再生成新任务，保持空闲状态
      return;
    }

    // 取出第一个任务执行（但不从队列移除）
    const nextTask = tasks[0];
    console.log('[SCR-03 V2] Starting task from queue:', nextTask.title, 'Queue length:', tasks.length);
    
    executeTask(nextTask);

  }, [tasks, currentTask, isRunning, executeTask]);

  // 自动补充队列（移除此功能，不再自动补充）
  // useEffect(() => {
  //   if (tasks.length < 5 && !isExecutingRef.current) {
  //     const needed = 5 - tasks.length;
  //     const newTasks = Array.from({ length: needed }, () => autoGenerateTask());
  //     setTasks(prev => [...prev, ...newTasks]);
  //     console.log(`[SCR-03 V2] Queue refilled: added ${needed} tasks`);
  //   }
  // }, [tasks.length]);

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
