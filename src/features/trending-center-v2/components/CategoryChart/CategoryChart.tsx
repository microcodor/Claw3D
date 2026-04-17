'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchPlatforms,
  fetchPlatformFeeds,
  generateAnalysisData,
} from '@/features/trending-center/services/hotspotService';
import styles from './CategoryChart.module.css';

// Horizontal bar chart
function HorizontalBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#ff9500', '#00ff88', '#3b82f6', '#a855f7', '#f59e0b'];
  
  return (
    <div className={styles.chartContainer}>
      {data.map((item, i) => {
        const percentage = (item.value / maxValue) * 100;
        const color = colors[i % colors.length];
        
        return (
          <div key={i} className={styles.barRow}>
            <div className={styles.barLabel}>{item.label}</div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{
                  width: `${percentage}%`,
                  background: color,
                  boxShadow: `0 0 8px ${color}88`,
                }}
              />
            </div>
            <div className={styles.barValue}>{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function CategoryChart() {
  const [categoryData, setCategoryData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const platformList = await fetchPlatforms();
        
        if (platformList && platformList.length > 0) {
          const platform = platformList[0];
          const feedData = await fetchPlatformFeeds(platform.id, 20);
          
          if (feedData && feedData.data) {
            const analysisData = generateAnalysisData(feedData.data);
            setCategoryData(analysisData.categoryData);
          }
        }
      } catch (err) {
        console.error('[CategoryChart] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📊 话题分类分布</h2>
        <span className={styles.badge}>实时统计</span>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : categoryData.length > 0 ? (
          <HorizontalBarChart data={categoryData} />
        ) : (
          <div className={styles.empty}>暂无分类数据</div>
        )}
      </div>
    </div>
  );
}
