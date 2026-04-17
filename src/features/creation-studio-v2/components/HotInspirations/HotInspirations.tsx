'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingUp } from 'lucide-react';
import type { CreationTask, ContentType } from '../../types';
import { createTaskFromHotspot } from '../../services/taskGenerator';
import { fetchPlatforms, fetchPlatformFeeds, transformFeedToTrending } from '@/features/trending-center/services/hotspotService';
import type { TrendingItem } from '@/features/trending-center/types';
import { CONTENT_TYPE_CONFIGS } from '../../utils/constants';
import styles from './HotInspirations.module.css';

interface HotInspirationsProps {
  onCreateTask: (task: CreationTask) => void;
}

export default function HotInspirations({ onCreateTask }: HotInspirationsProps) {
  const [hotTopics, setHotTopics] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<ContentType>('article');

  // 加载热点数据
  useEffect(() => {
    loadHotTopics();
    
    // 每30秒更新一次
    const interval = setInterval(loadHotTopics, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadHotTopics = async () => {
    try {
      const platformList = await fetchPlatforms();
      if (platformList && platformList.length > 0) {
        const allTopics: TrendingItem[] = [];
        
        // 获取前3个平台的热搜
        for (const platform of platformList.slice(0, 3)) {
          const feedData = await fetchPlatformFeeds(platform.id, 3);
          
          if (feedData && feedData.data) {
            const items = feedData.data.map(feed =>
              transformFeedToTrending(feed, platform.displayName)
            );
            allTopics.push(...items);
          }
        }
        
        // 按热度排序，取前8个
        const sorted = allTopics
          .sort((a, b) => b.heat - a.heat)
          .slice(0, 8);
        
        setHotTopics(sorted);
      }
    } catch (error) {
      console.error('[HotInspirations] Failed to load hot topics:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建任务
  const handleCreateTask = (topic: TrendingItem) => {
    const task = createTaskFromHotspot({
      title: topic.title,
      type: selectedType,
      heat: topic.heat,
    });
    onCreateTask(task);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Lightbulb size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle', color: '#ff9500' }} />
          热点灵感
        </h2>
        <span className={styles.badge}>实时</span>
      </div>

      {/* 内容类型选择 */}
      <div className={styles.typeSelector}>
        {Object.values(CONTENT_TYPE_CONFIGS).map(config => (
          <button
            key={config.type}
            className={`${styles.typeBtn} ${selectedType === config.type ? styles.active : ''}`}
            onClick={() => setSelectedType(config.type)}
            style={{
              borderColor: selectedType === config.type ? config.color : 'rgba(255, 255, 255, 0.1)',
              color: selectedType === config.type ? config.color : 'rgba(255, 255, 255, 0.6)',
            }}
          >
            {config.icon}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingIcon}>◌</div>
            <div className={styles.loadingText}>加载热点中...</div>
          </div>
        ) : hotTopics.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>○</div>
            <div className={styles.emptyText}>暂无热点数据</div>
          </div>
        ) : (
          <div className={styles.topicList}>
            {hotTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                className={styles.topicItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => handleCreateTask(topic)}
              >
                <div className={styles.topicRank}>
                  {index < 3 ? (
                    <span className={styles.topRank}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className={styles.normalRank}>{index + 1}</span>
                  )}
                </div>
                <div className={styles.topicContent}>
                  <div className={styles.topicTitle}>{topic.title}</div>
                  <div className={styles.topicMeta}>
                    <span className={styles.topicPlatform}>{topic.platform}</span>
                    <span className={styles.topicHeat}>
                      <TrendingUp size={12} style={{ display: 'inline-block', marginRight: '2px', verticalAlign: 'middle', color: '#ef4444' }} />
                      {(topic.heat / 10000).toFixed(1)}万
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
