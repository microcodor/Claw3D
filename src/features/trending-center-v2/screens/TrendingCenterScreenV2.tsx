'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlatformTabs from '../components/PlatformTabs/PlatformTabs';
import CategoryChart from '../components/CategoryChart/CategoryChart';
import HotTopicsRanking from '../components/HotTopicsRanking/HotTopicsRanking';
import PublicOpinionMonitor from '../components/PublicOpinionMonitor/PublicOpinionMonitor';
import AudienceProfile from '../components/AudienceProfile/AudienceProfile';
import {
  fetchPlatforms,
  fetchPlatformFeeds,
  transformFeedToTrending,
} from '@/features/trending-center/services/hotspotService';
import type { TrendingItem } from '@/features/trending-center/types';
import {
  generateMockAudienceProfile,
} from '../services/mockDataGenerator';
import { analyzeTrendingSentiments } from '../utils/sentimentAnalyzer';
import styles from '../styles/trending-center-v2.module.css';

export default function TrendingCenterScreenV2() {
  // 数据状态
  const [trendingData, setTrendingData] = useState<TrendingItem[]>([]);
  const [audienceProfile, setAudienceProfile] = useState(generateMockAudienceProfile());

  // 加载热搜数据
  useEffect(() => {
    async function loadTrendingData() {
      try {
        const platformList = await fetchPlatforms();
        
        if (platformList && platformList.length > 0) {
          // 获取所有平台的热搜数据
          const allTrending: TrendingItem[] = [];
          
          for (const platform of platformList.slice(0, 5)) {
            const feedData = await fetchPlatformFeeds(platform.id, 20);
            
            if (feedData && feedData.data) {
              const items = feedData.data.map(feed =>
                transformFeedToTrending(feed, platform.displayName)
              );
              allTrending.push(...items);
            }
          }
          
          console.log('[TrendingCenterScreenV2] Raw trending data:', allTrending.length);
          
          // 使用情感分析工具重新分析情感
          const analyzedData = analyzeTrendingSentiments(allTrending);
          console.log('[TrendingCenterScreenV2] Analyzed data count:', analyzedData.length);
          setTrendingData(analyzedData);
        } else {
          console.warn('[TrendingCenterScreenV2] No platforms found');
        }
      } catch (err) {
        console.error('[TrendingCenterScreenV2] Failed to load trending data:', err);
      }
    }
    
    loadTrendingData();
    
    // 实时更新数据（每30秒）
    const interval = setInterval(() => {
      loadTrendingData();
      setAudienceProfile(generateMockAudienceProfile());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* 主要内容区域 - 无顶部标题 */}
      <div className={styles.mainContent}>
        {/* 左侧列 - 平台Tab热搜榜 + 24小时趋势 */}
        <div className={styles.leftColumn}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PlatformTabs />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CategoryChart />
          </motion.div>
        </div>

        {/* 中间列 - 全网热点实时榜 + 舆情监测与智能预警 */}
        <div className={styles.centerColumn}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <HotTopicsRanking trendingData={trendingData} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PublicOpinionMonitor trendingData={trendingData} />
          </motion.div>
        </div>

        {/* 右侧列 - 人群画像 */}
        <div className={styles.rightColumn}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ height: '100%' }}
          >
            <AudienceProfile data={audienceProfile} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
