'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Video, MessageSquare, Megaphone } from 'lucide-react';
import type { CreationTask } from '../../types';
import styles from './TaskQueue.module.css';

interface TaskQueueProps {
  tasks: CreationTask[];
  currentTask: CreationTask | null;
  onStartTask: (task: CreationTask) => void;
  onDeleteTask: (taskId: string) => void;
  onRetryTask: (task: CreationTask) => void;
}

// 类型图标映射
const typeIcons: Record<string, React.ReactNode> = {
  article: <FileText size={16} style={{ color: '#3b82f6' }} />,
  video: <Video size={16} style={{ color: '#ef4444' }} />,
  social: <MessageSquare size={16} style={{ color: '#10b981' }} />,
  ad: <Megaphone size={16} style={{ color: '#f59e0b' }} />,
};

// 类型标签映射
const typeLabels: Record<string, string> = {
  article: '文章',
  video: '视频',
  social: '社交',
  ad: '广告',
};

export default function TaskQueue({
  tasks,
  currentTask,
}: TaskQueueProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📋 创作队列</h2>
        <div className={styles.headerRight}>
          <span className={styles.badge}>{tasks.length}</span>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span className={styles.statusText}>自动运行中</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⏳</div>
            <div className={styles.emptyText}>正在生成任务...</div>
          </div>
        ) : (
          <div className={styles.taskList}>
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => {
                // 当前正在执行的任务：通过ID匹配
                const isActive = currentTask?.id === task.id;
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`${styles.taskItem} ${isActive ? styles.active : ''}`}
                  >
                    <div className={styles.taskNumber}>{index + 1}</div>
                    
                    <div className={styles.taskIcon}>
                      {typeIcons[task.type] || <FileText size={16} style={{ color: '#3b82f6' }} />}
                    </div>
                    
                    <div className={styles.taskContent}>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskMeta}>
                        <span className={styles.taskType}>
                          {typeLabels[task.type] || task.type}
                        </span>
                        <span className={styles.taskPriority}>P{task.priority}</span>
                      </div>
                    </div>
                    
                    <div className={styles.taskStatus}>
                      {isActive ? (
                        <motion.div
                          className={styles.statusProcessing}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        >
                          ◐
                        </motion.div>
                      ) : (
                        <div className={styles.statusPending}>○</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
