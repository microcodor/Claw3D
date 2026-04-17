'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { TrendingItem } from '../../types';
import { MOCK_PLATFORMS } from '../../services/mockDataGenerator';
import styles from './PlatformComparisonV2.module.css';

interface PlatformComparisonProps {
  data: TrendingItem[];
}

export default function PlatformComparisonV2({ data }: PlatformComparisonProps) {
  // 计算平台多维度统计数据
  const platformStats = useMemo(() => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.platform]) {
        acc[item.platform] = [];
      }
      acc[item.platform].push(item);
      return acc;
    }, {} as Record<string, TrendingItem[]>);
    
    const stats = MOCK_PLATFORMS.map(platform => {
      const items = grouped[platform.name] || [];
      const totalHeat = items.reduce((sum, item) => sum + item.heat, 0);
      const avgTrend = items.length > 0
        ? items.reduce((sum, item) => sum + parseFloat(item.delta), 0) / items.length
        : 0;
      
      // 计算互动指数 (0-100)
      const interactionIndex = Math.min(100, Math.floor((totalHeat / 1000000) * 100));
      
      // 随机峰值时段
      const peakHours = ['12:00-14:00', '18:00-20:00', '20:00-22:00'];
      const peakHour = peakHours[Math.floor(Math.random() * peakHours.length)];
      
      // 用户增长
      const userGrowth = Math.floor(Math.random() * 10000) + 1000;
      
      return {
        platform,
        contentCount: items.length,
        totalHeat,
        trend: Math.round(avgTrend),
        interactionIndex,
        peakHour,
        userGrowth,
      };
    });
    
    return stats.sort((a, b) => b.totalHeat - a.totalHeat);
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
        <h2 className={styles.title}>全平台数据对比</h2>
        <span className={styles.badge}>多维度</span>
      </div>

      <div className={styles.content}>
        <div className={styles.platformList}>
          {platformStats.map((stat, index) => (
            <motion.div
              key={stat.platform.id}
              className={styles.platformCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* 平台头部 */}
              <div className={styles.platformHeader}>
                <span className={styles.platformIcon}>{stat.platform.icon}</span>
                <span className={styles.platformName}>{stat.platform.displayName}</span>
                <span
                  className={`${styles.trend} ${
                    stat.trend > 0 ? styles.trendUp : stat.trend < 0 ? styles.trendDown : ''
                  }`}
                >
                  {stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '→'} {Math.abs(stat.trend)}%
                </span>
              </div>

              {/* 数据指标 */}
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>内容数</div>
                  <div className={styles.metricValue}>{stat.contentCount}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>总热度</div>
                  <div className={styles.metricValue}>{formatNumber(stat.totalHeat)}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>互动指数</div>
                  <div className={styles.metricValue}>{stat.interactionIndex}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>峰值时段</div>
                  <div className={styles.metricValue}>{stat.peakHour}</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricLabel}>用户增长</div>
                  <div className={styles.metricValue}>+{formatNumber(stat.userGrowth)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
