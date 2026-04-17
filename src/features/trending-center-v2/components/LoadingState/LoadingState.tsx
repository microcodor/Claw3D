'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './LoadingState.module.css';

export function LoadingState() {
  return (
    <div className={styles.container}>
      <motion.div
        className={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className={styles.spinnerRing} />
        <div className={styles.spinnerRing} />
        <div className={styles.spinnerRing} />
      </motion.div>
      <motion.p
        className={styles.text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        加载舆情数据中...
      </motion.p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonBadge} />
      </div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} style={{ width: '60%' }} />
      </div>
    </div>
  );
}
