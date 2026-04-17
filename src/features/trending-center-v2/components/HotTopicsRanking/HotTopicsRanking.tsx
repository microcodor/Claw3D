'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrendingItem } from '@/features/trending-center/types';
import styles from './HotTopicsRanking.module.css';

interface HotTopicsRankingProps {
  trendingData: TrendingItem[];
}

export default function HotTopicsRanking({ trendingData }: HotTopicsRankingProps) {
  const [topHotspots, setTopHotspots] = useState<TrendingItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  
  useEffect(() => {
    if (!trendingData || trendingData.length === 0) {
      return;
    }
    
    // 按热度排序，取前10个
    const sorted = [...trendingData]
      .sort((a, b) => b.heat - a.heat)
      .slice(0, 10);
    
    setTopHotspots(sorted);
  }, [trendingData]);
  
  // 自动切换页面
  useEffect(() => {
    if (topHotspots.length === 0) return;
    
    const totalPages = Math.ceil(topHotspots.length / itemsPerPage);
    if (totalPages <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 5000); // 每5秒切换一次
    
    return () => clearInterval(interval);
  }, [topHotspots]);
  
  // 获取当前页的数据
  const currentItems = topHotspots.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  const totalPages = Math.ceil(topHotspots.length / itemsPerPage);
  
  // 获取排名样式
  const getRankClass = (index: number) => {
    const globalIndex = currentPage * itemsPerPage + index;
    if (globalIndex === 0) return styles.rankGold;
    if (globalIndex === 1) return styles.rankSilver;
    if (globalIndex === 2) return styles.rankBronze;
    return styles.rankNormal;
  };
  
  // 获取情感颜色
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#4ade80';
      case 'negative': return '#f87171';
      default: return 'rgba(255, 255, 255, 0.7)';
    }
  };
  
  // 获取情感标签
  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '正面';
      case 'negative': return '负面';
      default: return '中性';
    }
  };
  
  // 格式化热度
  const formatHeat = (heat: number) => {
    if (heat >= 100000000) {
      return `${(heat / 100000000).toFixed(1)}亿`;
    }
    if (heat >= 10000) {
      return `${(heat / 10000).toFixed(1)}万`;
    }
    return heat.toString();
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>🔥 全网热点实时榜</h2>
          <span className={styles.subtitle}>聚合全平台最火话题</span>
        </div>
        <div className={styles.badges}>
          <span className={styles.badge}>实时</span>
          {totalPages > 1 && (
            <span className={styles.pageBadge}>
              {currentPage + 1}/{totalPages}
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        {topHotspots.length === 0 ? (
          <div className={styles.empty}>加载中...</div>
        ) : (
          <div className={styles.rankingList}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                className={styles.pageContainer}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 1.0 }}
              >
                {currentItems.map((item, index) => {
                  const globalIndex = currentPage * itemsPerPage + index;
                  return (
                    <motion.div
                      key={item.id}
                      className={styles.rankingItem}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      {/* 排名 */}
                      <div className={`${styles.rank} ${getRankClass(index)}`}>
                        {globalIndex < 3 ? (
                          <span className={styles.rankIcon}>
                            {globalIndex === 0 ? '👑' : globalIndex === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className={styles.rankNumber}>{globalIndex + 1}</span>
                        )}
                      </div>
                      
                      {/* 内容 */}
                      <div className={styles.itemContent}>
                        <div className={styles.itemTitle}>{item.title}</div>
                        <div className={styles.itemMeta}>
                          <span className={styles.platform}>{item.platform}</span>
                          <span 
                            className={styles.sentiment}
                            style={{ color: getSentimentColor(item.sentiment) }}
                          >
                            ● {getSentimentLabel(item.sentiment)}
                          </span>
                        </div>
                      </div>
                      
                      {/* 热度 */}
                      <div className={styles.heatSection}>
                        <div className={styles.heatValue}>{formatHeat(item.heat)}</div>
                        <div className={styles.heatLabel}>热度</div>
                      </div>
                      
                      {/* 热度条 - 绝对定位在底部 */}
                      <motion.div 
                        className={styles.heatBar}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1.6, delay: index * 0.2 + 0.4 }}
                      >
                        <div
                          className={styles.heatBarFill}
                          style={{
                            width: `${(item.heat / topHotspots[0].heat) * 100}%`,
                            background: globalIndex === 0 
                              ? 'linear-gradient(90deg, #ff9500, #ff6b00)'
                              : globalIndex === 1
                              ? 'linear-gradient(90deg, #3b82f6, #2563eb)'
                              : globalIndex === 2
                              ? 'linear-gradient(90deg, #a855f7, #9333ea)'
                              : 'linear-gradient(90deg, rgba(255, 149, 0, 0.5), rgba(255, 149, 0, 0.3))',
                          }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* 分页指示器 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentPage ? styles.dotActive : ''}`}
              onClick={() => setCurrentPage(i)}
              aria-label={`第 ${i + 1} 页`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
