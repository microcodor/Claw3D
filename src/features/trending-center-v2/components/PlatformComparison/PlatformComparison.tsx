'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { TrendingItem, PlatformStats } from '../../types';
import { MOCK_PLATFORMS } from '../../services/mockDataGenerator';
import { groupBy, calculateHotnessPercent, formatHeatValue } from '../../utils/dataTransform';
import styles from './PlatformComparison.module.css';

interface PlatformComparisonProps {
  data: TrendingItem[];
}

export default function PlatformComparison({ data }: PlatformComparisonProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // 计算平台统计数据
  const platformStats = useMemo(() => {
    const grouped = groupBy(data, item => item.platform);
    
    const stats: PlatformStats[] = MOCK_PLATFORMS.map(platform => {
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
        hotness: totalHeat,
        hotnessPercent: 0, // 稍后计算
        category: platform.category,
        count: items.length,
        trend: Math.round(avgTrend),
        interactionIndex,
        peakHour,
        userGrowth,
        contentCount: items.length,
      };
    });
    
    // 计算百分比
    const maxHotness = Math.max(...stats.map(s => s.hotness));
    stats.forEach(stat => {
      stat.hotnessPercent = calculateHotnessPercent(stat.hotness, maxHotness);
    });
    
    return stats.sort((a, b) => b.hotness - a.hotness);
  }, [data]);

  // 找出共同热点
  const commonHotspots = useMemo(() => {
    const topicMap: Record<string, Set<string>> = {};
    
    data.forEach(item => {
      const topic = item.title.slice(0, 20);
      if (!topicMap[topic]) {
        topicMap[topic] = new Set();
      }
      topicMap[topic].add(item.platform);
    });
    
    return Object.entries(topicMap)
      .filter(([, platforms]) => platforms.size >= 3)
      .map(([topic, platforms]) => ({
        topic,
        platformCount: platforms.size,
        platforms: Array.from(platforms),
      }))
      .sort((a, b) => b.platformCount - a.platformCount)
      .slice(0, 5);
  }, [data]);
  
  // 获取热搜列表（前20条）
  const trendingList = useMemo(() => {
    return data
      .sort((a, b) => b.heat - a.heat)
      .slice(0, 20);
  }, [data]);
  
  // 自动滚动
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let scrollInterval: NodeJS.Timeout;
    let isPaused = false;
    
    const startScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && scrollContainer) {
          scrollContainer.scrollTop += 1;
          
          // 滚动到底部时重置
          if (scrollContainer.scrollTop >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
            scrollContainer.scrollTop = 0;
          }
        }
      }, 50);
    };
    
    startScroll();
    
    // 鼠标悬停暂停滚动
    scrollContainer.addEventListener('mouseenter', () => { isPaused = true; });
    scrollContainer.addEventListener('mouseleave', () => { isPaused = false; });
    
    return () => {
      clearInterval(scrollInterval);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>全平台热度对比</h2>
        <span className={styles.badge}>实时</span>
      </div>

      <div className={styles.content}>
        {/* 左侧：平台热度条 */}
        <div className={styles.platformSection}>
          <div className={styles.platformList}>
            {platformStats.map((stat, index) => (
              <motion.div
                key={stat.platform.id}
                className={styles.platformItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <div className={styles.platformInfo}>
                  <span className={styles.platformIcon}>{stat.platform.icon}</span>
                  <span className={styles.platformName}>{stat.platform.displayName}</span>
                </div>

                <div className={styles.heatBar}>
                  <motion.div
                    className={styles.heatFill}
                    style={{ backgroundColor: stat.platform.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.hotnessPercent}%` }}
                    transition={{ duration: 0.8, delay: index * 0.03 }}
                  />
                  <span className={styles.heatPercent}>{stat.hotnessPercent}%</span>
                </div>

                <div className={styles.platformMeta}>
                  <span className={styles.count}>{stat.count}条</span>
                  <span
                    className={`${styles.trend} ${
                      stat.trend > 0 ? styles.trendUp : stat.trend < 0 ? styles.trendDown : ''
                    }`}
                  >
                    {stat.trend > 0 ? '↑' : stat.trend < 0 ? '↓' : '→'} {Math.abs(stat.trend)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 右侧：实时热搜榜 */}
        <div className={styles.trendingSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.fireIcon}>🔥</span>
            实时热搜榜
          </h3>
          <div ref={scrollRef} className={styles.trendingList}>
            {trendingList.map((item, index) => (
              <motion.div
                key={item.id}
                className={styles.trendingItem}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <span className={`${styles.rank} ${index < 3 ? styles.rankTop : ''}`}>
                  {index + 1}
                </span>
                <div className={styles.trendingContent}>
                  <span className={styles.trendingTitle}>{item.title}</span>
                  <div className={styles.trendingMeta}>
                    <span className={styles.platform}>
                      {MOCK_PLATFORMS.find(p => p.name === item.platform)?.displayName}
                    </span>
                    <span className={styles.heat}>{formatHeatValue(item.heat)}</span>
                    <span className={`${styles.delta} ${item.delta.startsWith('+') ? styles.deltaUp : styles.deltaDown}`}>
                      {item.delta}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 共同热点 */}
      {commonHotspots.length > 0 && (
        <div className={styles.commonSection}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.fireIcon}>🔥</span>
            共同热点
          </h3>
          <div className={styles.commonList}>
            {commonHotspots.map((hotspot, index) => (
              <motion.div
                key={index}
                className={styles.commonItem}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <span className={styles.commonTopic}>{hotspot.topic}</span>
                <span className={styles.commonCount}>{hotspot.platformCount}个平台</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
