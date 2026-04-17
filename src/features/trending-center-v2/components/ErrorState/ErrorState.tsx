'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  error?: string | null;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.iconWrapper}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <AlertTriangle className={styles.icon} />
      </motion.div>
      
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        数据加载失败
      </motion.h2>
      
      <motion.p
        className={styles.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {error || '无法获取舆情数据，请稍后重试'}
      </motion.p>
      
      {onRetry && (
        <motion.button
          className={styles.retryButton}
          onClick={onRetry}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className={styles.retryIcon} />
          重新加载
        </motion.button>
      )}
    </div>
  );
}

export function EmptyState({ message = '暂无数据' }: { message?: string }) {
  return (
    <div className={styles.emptyContainer}>
      <motion.div
        className={styles.emptyIcon}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        📊
      </motion.div>
      <motion.p
        className={styles.emptyText}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  );
}
