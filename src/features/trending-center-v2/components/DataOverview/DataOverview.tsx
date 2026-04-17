'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TrendingItem } from '../../types';
import styles from './DataOverview.module.css';

interface DataOverviewProps {
  data: TrendingItem[];
}

export default function DataOverview({ data }: DataOverviewProps) {
  // 计算统计数据
  const stats = useMemo(() => {
    const totalTopics = data.length;
    const totalHeat = data.reduce((sum, item) => sum + item.heat, 0);
    const avgHeat = totalTopics > 0 ? Math.floor(totalHeat / totalTopics) : 0;
    
    // 计算涨跌趋势
    const risingCount = data.filter(item => item.delta.startsWith('+')).length;
    const fallingCount = data.filter(item => item.delta.startsWith('-')).length;
    
    // 计算情感分布
    const positiveCount = data.filter(item => item.sentiment === 'positive').length;
    const negativeCount = data.filter(item => item.sentiment === 'negative').length;
    const neutralCount = data.filter(item => item.sentiment === 'neutral').length;
    
    // 按类别统计
    const categoryStats = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
    
    // 按平台统计
    const platformStats = data.reduce((acc, item) => {
      acc[item.platform] = (acc[item.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topPlatforms = Object.entries(platformStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([platform, count]) => ({ platform, count }));
    
    return {
      totalTopics,
      totalHeat,
      avgHeat,
      risingCount,
      fallingCount,
      positiveCount,
      negativeCount,
      neutralCount,
      topCategories,
      topPlatforms,
    };
  }, [data]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>数据总览</h2>
        <span className={styles.badge}>实时</span>
      </div>

      <div className={styles.content}>
        {/* 核心指标 */}
        <div className={styles.metricsGrid}>
          <motion.div
            className={styles.metricCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.metricIcon}>📊</div>
            <div className={styles.metricValue}>{stats.totalTopics}</div>
            <div className={styles.metricLabel}>话题总数</div>
          </motion.div>

          <motion.div
            className={styles.metricCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className={styles.metricIcon}>🔥</div>
            <div className={styles.metricValue}>{formatNumber(stats.totalHeat)}</div>
            <div className={styles.metricLabel}>总热度</div>
          </motion.div>

          <motion.div
            className={styles.metricCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className={styles.metricIcon}>📈</div>
            <div className={styles.metricValue}>{stats.risingCount}</div>
            <div className={styles.metricLabel}>上升话题</div>
          </motion.div>

          <motion.div
            className={styles.metricCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className={styles.metricIcon}>📉</div>
            <div className={styles.metricValue}>{stats.fallingCount}</div>
            <div className={styles.metricLabel}>下降话题</div>
          </motion.div>
        </div>

        {/* 情感分布 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>情感分布</h3>
          <div className={styles.sentimentGrid}>
            <div className={styles.sentimentItem}>
              <div className={styles.sentimentIcon} style={{ color: '#4ade80' }}>😊</div>
              <div className={styles.sentimentValue}>{stats.positiveCount}</div>
              <div className={styles.sentimentLabel}>正面</div>
            </div>
            <div className={styles.sentimentItem}>
              <div className={styles.sentimentIcon} style={{ color: '#9ca3af' }}>😐</div>
              <div className={styles.sentimentValue}>{stats.neutralCount}</div>
              <div className={styles.sentimentLabel}>中性</div>
            </div>
            <div className={styles.sentimentItem}>
              <div className={styles.sentimentIcon} style={{ color: '#f87171' }}>😞</div>
              <div className={styles.sentimentValue}>{stats.negativeCount}</div>
              <div className={styles.sentimentLabel}>负面</div>
            </div>
          </div>
        </div>

        {/* 热门类别 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>热门类别 TOP5</h3>
          <div className={styles.rankList}>
            {stats.topCategories.map((item, index) => (
              <motion.div
                key={item.category}
                className={styles.rankItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className={`${styles.rank} ${index < 3 ? styles.rankTop : ''}`}>
                  {index + 1}
                </span>
                <span className={styles.rankLabel}>{item.category}</span>
                <span className={styles.rankValue}>{item.count}条</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 活跃平台 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>活跃平台 TOP5</h3>
          <div className={styles.rankList}>
            {stats.topPlatforms.map((item, index) => (
              <motion.div
                key={item.platform}
                className={styles.rankItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <span className={`${styles.rank} ${index < 3 ? styles.rankTop : ''}`}>
                  {index + 1}
                </span>
                <span className={styles.rankLabel}>{item.platform}</span>
                <span className={styles.rankValue}>{item.count}条</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
