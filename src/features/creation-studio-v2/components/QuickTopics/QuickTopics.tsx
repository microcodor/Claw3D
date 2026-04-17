'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreationTask, ContentType, Holiday } from '../../types';
import { createTaskFromHotspot, createTaskFromHoliday, createTaskFromIndustry } from '../../services/taskGenerator';
import { getUpcomingHolidays } from '../../data/holidays';
import { getRandomTemplates } from '../../data/industries';
import { fetchPlatforms, fetchPlatformFeeds, transformFeedToTrending } from '@/features/trending-center/services/hotspotService';
import type { TrendingItem } from '@/features/trending-center/types';
import { CONTENT_TYPE_CONFIGS } from '../../utils/constants';
import styles from './QuickTopics.module.css';

interface QuickTopicsProps {
  onCreateTask: (task: CreationTask) => void;
}

export default function QuickTopics({ onCreateTask }: QuickTopicsProps) {
  const [activeTab, setActiveTab] = useState<'hotspot' | 'holiday' | 'industry'>('hotspot');
  const [hotspots, setHotspots] = useState<TrendingItem[]>([]);
  const [holidays, setHolidays] = useState<Array<Holiday & { daysUntil: number; actualDate: Date }>>(
    getUpcomingHolidays(6) as any
  );
  const [templates, setTemplates] = useState(getRandomTemplates(6));
  const [loading, setLoading] = useState(false);

  // 自动轮播标签页
  useEffect(() => {
    const tabs: Array<'hotspot' | 'holiday' | 'industry'> = ['hotspot', 'holiday', 'industry'];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[currentIndex]);
    }, 10000); // 每10秒切换一次

    return () => clearInterval(interval);
  }, []);

  // 加载热点数据
  useEffect(() => {
    if (activeTab === 'hotspot') {
      loadHotspots();
    }
  }, [activeTab]);

  const loadHotspots = async () => {
    setLoading(true);
    try {
      const platformList = await fetchPlatforms();
      if (platformList && platformList.length > 0) {
        // 获取第一个平台的热搜
        const platform = platformList[0];
        const feedData = await fetchPlatformFeeds(platform.id, 6);
        
        if (feedData && feedData.data) {
          const items = feedData.data.map(feed =>
            transformFeedToTrending(feed, platform.displayName)
          );
          setHotspots(items);
        }
      }
    } catch (error) {
      console.error('[QuickTopics] Failed to load hotspots:', error);
    } finally {
      setLoading(false);
    }
  };

  // 创建任务
  const handleCreateFromHotspot = (hotspot: TrendingItem, type: ContentType) => {
    const task = createTaskFromHotspot({
      title: hotspot.title,
      type,
      heat: hotspot.heat,
    });
    onCreateTask(task);
  };

  const handleCreateFromHoliday = (holiday: typeof holidays[0], type: ContentType) => {
    const task = createTaskFromHoliday({
      holidayName: holiday.name,
      type,
      keywords: holiday.keywords,
    });
    onCreateTask(task);
  };

  const handleCreateFromTemplate = (template: typeof templates[0]) => {
    const task = createTaskFromIndustry({
      industryName: template.industry,
      templateName: template.name,
      type: template.type,
      customPrompt: template.prompt,
    });
    onCreateTask(task);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>⚡ 快速选题</h2>
        <div className={styles.autoIndicator}>
          <span className={styles.autoDot}></span>
          <span className={styles.autoText}>自动轮播</span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'hotspot' ? styles.active : ''}`}
          onClick={() => setActiveTab('hotspot')}
        >
          🔥 热点
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'holiday' ? styles.active : ''}`}
          onClick={() => setActiveTab('holiday')}
        >
          🎉 节日
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'industry' ? styles.active : ''}`}
          onClick={() => setActiveTab('industry')}
        >
          🏢 行业
        </button>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {/* 热点选题 */}
          {activeTab === 'hotspot' && (
            <motion.div
              key="hotspot"
              className={styles.tabContent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className={styles.loading}>加载中...</div>
              ) : hotspots.length === 0 ? (
                <div className={styles.empty}>暂无热点数据</div>
              ) : (
                <div className={styles.topicList}>
                  {hotspots.map((hotspot, index) => (
                    <motion.div
                      key={hotspot.id}
                      className={styles.topicCard}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <div className={styles.topicHeader}>
                        <span className={styles.topicRank}>#{hotspot.rank}</span>
                        <span className={styles.topicHeat}>
                          {(hotspot.heat / 10000).toFixed(1)}万
                        </span>
                      </div>
                      <div className={styles.topicTitle}>{hotspot.title}</div>
                      <div className={styles.topicActions}>
                        {Object.values(CONTENT_TYPE_CONFIGS).map(config => (
                          <button
                            key={config.type}
                            className={styles.actionBtn}
                            onClick={() => handleCreateFromHotspot(hotspot, config.type)}
                            title={`创建${config.label}`}
                          >
                            {config.icon}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* 节日选题 */}
          {activeTab === 'holiday' && (
            <motion.div
              key="holiday"
              className={styles.tabContent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.topicList}>
                {holidays.map((holiday, index) => (
                  <motion.div
                    key={holiday.id}
                    className={styles.topicCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className={styles.topicHeader}>
                      <span className={styles.topicIcon}>🎉</span>
                      <span className={styles.topicDays}>{holiday.daysUntil}天后</span>
                    </div>
                    <div className={styles.topicTitle}>{holiday.name}</div>
                    <div className={styles.topicDesc}>{holiday.description}</div>
                    <div className={styles.topicActions}>
                      {Object.values(CONTENT_TYPE_CONFIGS).map(config => (
                        <button
                          key={config.type}
                          className={styles.actionBtn}
                          onClick={() => handleCreateFromHoliday(holiday, config.type)}
                          title={`创建${config.label}`}
                        >
                          {config.icon}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 行业选题 */}
          {activeTab === 'industry' && (
            <motion.div
              key="industry"
              className={styles.tabContent}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.topicList}>
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    className={styles.topicCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className={styles.topicHeader}>
                      <span className={styles.topicIndustry}>{template.industry}</span>
                      <span className={styles.topicType}>
                        {CONTENT_TYPE_CONFIGS[template.type].icon}
                      </span>
                    </div>
                    <div className={styles.topicTitle}>{template.name}</div>
                    <div className={styles.topicDesc}>{template.description}</div>
                    <button
                      className={styles.createBtn}
                      onClick={() => handleCreateFromTemplate(template)}
                    >
                      创建任务
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
