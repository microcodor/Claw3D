'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  fetchPlatforms,
  fetchPlatformFeeds,
  transformFeedToTrending,
} from '@/features/trending-center/services/hotspotService';
import type { Platform, TrendingItem } from '@/features/trending-center/types';
import styles from './PlatformTabs.module.css';

export default function PlatformTabs() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Initialize: fetch platforms
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const platformList = await fetchPlatforms();
        
        if (platformList && platformList.length > 0) {
          setPlatforms(platformList);
          loadPlatformData(platformList[0].id, platformList[0].displayName);
        }
      } catch (err) {
        console.error('[PlatformTabs] Init error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    init();
  }, []);
  
  // Load platform data
  async function loadPlatformData(platformId: string, platformName: string) {
    try {
      const feedData = await fetchPlatformFeeds(platformId, 20);
      
      if (feedData && feedData.data) {
        const trendingItems = feedData.data.map(feed =>
          transformFeedToTrending(feed, platformName)
        );
        
        setTrending(trendingItems);
        setScrollOffset(0);
      }
    } catch (err) {
      console.error(`[PlatformTabs] Failed to load platform data:`, err);
    }
  }
  
  // Auto-scroll trending list
  useEffect(() => {
    if (trending.length === 0) return;
    
    const scrollInterval = setInterval(() => {
      setScrollOffset(prev => {
        const itemHeight = 60;
        const newOffset = prev + 1;
        
        if (newOffset >= trending.length * itemHeight) {
          return 0;
        }
        
        return newOffset;
      });
    }, 50);
    
    return () => clearInterval(scrollInterval);
  }, [trending]);
  
  // Auto-rotate platforms
  useEffect(() => {
    if (platforms.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentPlatformIndex(prev => {
        const next = (prev + 1) % platforms.length;
        const platform = platforms[next];
        loadPlatformData(platform.id, platform.displayName);
        return next;
      });
    }, 30000);
    
    return () => clearInterval(interval);
  }, [platforms]);
  
  const currentPlatform = platforms[currentPlatformIndex];
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🔥 实时热搜榜</h2>
        <span className={styles.badge}>实时</span>
      </div>
      
      {/* Platform Tabs */}
      <div className={styles.tabs}>
        {platforms.map((platform, i) => (
          <button
            key={platform.id}
            className={`${styles.tab} ${i === currentPlatformIndex ? styles.active : ''}`}
            onClick={() => {
              setCurrentPlatformIndex(i);
              loadPlatformData(platform.id, platform.displayName);
            }}
          >
            {platform.displayName}
          </button>
        ))}
      </div>
      
      {/* Trending List */}
      <div className={styles.trendList}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : trending.length === 0 ? (
          <div className={styles.empty}>暂无数据</div>
        ) : (
          <div
            className={styles.scrollWrapper}
            style={{ transform: `translateY(-${scrollOffset}px)` }}
          >
            {[...trending, ...trending].map((item, i) => {
              const rank = (i % trending.length) + 1;
              const deltaColor = item.delta.startsWith('+') ? '#4ade80' : '#f87171';
              const sentColor = {
                positive: '#4ade80',
                negative: '#f87171',
                neutral: 'rgba(255,255,255,0.7)',
              }[item.sentiment];
              
              return (
                <div key={`${item.id}-${i}`} className={styles.trendRow}>
                  <div className={`${styles.rank} ${rank <= 3 ? styles.rankTop : ''}`}>
                    {rank}
                  </div>
                  <div className={styles.info}>
                    <div className={styles.trendTitle}>{item.title}</div>
                    <div className={styles.meta}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{item.platform}</span>
                      <span style={{ color: sentColor }}>
                        ● {item.sentiment === 'positive' ? '正面' : item.sentiment === 'negative' ? '负面' : '中性'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.heat}>{(item.heat / 10000).toFixed(0)}万</div>
                    <div className={styles.delta} style={{ color: deltaColor }}>{item.delta}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
