'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Video, MessageSquare, Megaphone } from 'lucide-react';
import type { CreationTask } from '../../types';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
  history: CreationTask[];
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

export default function HistoryPanel({ history }: HistoryPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 自动滚动
  useEffect(() => {
    if (history.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      if (listRef.current) {
        const { scrollHeight, clientHeight } = listRef.current;
        const maxScroll = scrollHeight - clientHeight;

        if (maxScroll <= 0) return;

        setScrollPosition(prev => {
          const next = prev + 1;
          return next >= maxScroll ? 0 : next;
        });
      }
    }, 50); // 每50ms滚动1px，平滑滚动

    return () => clearInterval(interval);
  }, [history.length, isPaused]);

  // 应用滚动位置
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

  // 格式化时间
  const formatTime = (date?: Date) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📚 创作历史</h2>
        <div className={styles.headerRight}>
          <span className={styles.badge}>{history.length}</span>
          {history.length > 0 && (
            <div className={styles.scrollIndicator}>
              <span className={styles.scrollDot}></span>
              <span className={styles.scrollText}>自动滚动</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {history.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⏳</div>
            <div className={styles.emptyText}>等待任务完成...</div>
          </div>
        ) : (
          <div 
            ref={listRef}
            className={styles.historyList}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={styles.gradientTop}></div>
            <AnimatePresence mode="popLayout">
              {history.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className={styles.historyItem}
                >
                  <div className={styles.itemNumber}>{index + 1}</div>
                  <div className={styles.itemIcon}>
                    {typeIcons[task.type] || <FileText size={16} style={{ color: '#3b82f6' }} />}
                  </div>
                  <div className={styles.itemContent}>
                    <div className={styles.itemTitle}>{task.title}</div>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemType}>
                        {typeLabels[task.type] || task.type}
                      </span>
                      <span className={styles.itemTime}>
                        {formatTime(task.completedAt)}
                      </span>
                      {task.metadata?.wordCount && (
                        <span className={styles.itemWords}>
                          {task.metadata.wordCount}字
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemStatus}>✓</div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className={styles.gradientBottom}></div>
          </div>
        )}
      </div>
    </div>
  );
}
