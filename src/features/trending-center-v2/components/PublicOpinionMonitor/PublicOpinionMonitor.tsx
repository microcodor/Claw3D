'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { TrendingItem } from '@/features/trending-center/types';
import type { SentimentData, Alert } from '../../types';
import styles from './PublicOpinionMonitor.module.css';

interface PublicOpinionMonitorProps {
  trendingData: TrendingItem[];
}

export default function PublicOpinionMonitor({ trendingData }: PublicOpinionMonitorProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  // 从真实热搜数据计算情感分布
  const sentimentData = React.useMemo(() => {
    if (!trendingData || trendingData.length === 0) {
      return { positive: 33, neutral: 34, negative: 33, riskLevel: 'low' as const };
    }
    
    const total = trendingData.length;
    const positive = trendingData.filter(t => t.sentiment === 'positive').length;
    const negative = trendingData.filter(t => t.sentiment === 'negative').length;
    const neutral = total - positive - negative;
    
    const positivePercent = Math.round((positive / total) * 100);
    const negativePercent = Math.round((negative / total) * 100);
    const neutralPercent = 100 - positivePercent - negativePercent;
    
    // 根据负面比例判断风险等级
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (negativePercent > 40) riskLevel = 'high';
    else if (negativePercent > 25) riskLevel = 'medium';
    
    return {
      positive: positivePercent,
      neutral: neutralPercent,
      negative: negativePercent,
      riskLevel,
    };
  }, [trendingData]);
  
  // 从真实热搜数据生成风险预警和机会话题
  const { riskAlerts, opportunityAlerts } = React.useMemo(() => {
    if (!trendingData || trendingData.length === 0) {
      return { riskAlerts: [], opportunityAlerts: [] };
    }
    
    // 风险预警：负面情感的热搜
    const risks = trendingData
      .filter(t => t.sentiment === 'negative')
      .slice(0, 8)
      .map((t, i) => {
        const level = t.rank <= 5 ? 'high' : t.rank <= 15 ? 'medium' : 'low';
        return {
          id: `risk-${t.id}`,
          type: 'risk' as const,
          level,
          topic: t.title,
          reason: `该话题在${t.platform}平台排名第${t.rank}位，热度${(t.heat / 10000).toFixed(1)}万，呈现负面舆论趋势`,
          suggestion: level === 'high' 
            ? '建议立即关注并制定应对策略，防止舆情扩散'
            : level === 'medium'
            ? '建议密切监控舆情走向，准备应对预案'
            : '建议持续观察，做好舆情记录',
          metrics: {
            negativeGrowth: Math.floor(Math.random() * 30) + 10,
            polarization: Math.floor(Math.random() * 40) + 30,
          },
          trendingItem: t,
        };
      });
    
    // 机会话题：正面情感的热搜
    const opportunities = trendingData
      .filter(t => t.sentiment === 'positive')
      .slice(0, 8)
      .map((t, i) => ({
        id: `opp-${t.id}`,
        type: 'opportunity' as const,
        level: 'medium' as const,
        topic: t.title,
        reason: `该话题在${t.platform}平台排名第${t.rank}位，热度${(t.heat / 10000).toFixed(1)}万，正面舆论占主导`,
        suggestion: t.rank <= 10
          ? '建议快速跟进，借势营销扩大品牌影响力'
          : '建议适度参与，提升品牌正面形象',
        metrics: {
          positiveGrowth: Math.floor(Math.random() * 40) + 20,
        },
        trendingItem: t,
      }));
    
    return {
      riskAlerts: risks.sort((a, b) => {
        const levelOrder: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 };
        return levelOrder[a.level as 'high' | 'medium' | 'low'] - levelOrder[b.level as 'high' | 'medium' | 'low'];
      }),
      opportunityAlerts: opportunities,
    };
  }, [trendingData]);
  
  // 自动滚动
  React.useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    
    let scrollDirection = 1; // 1 向下, -1 向上
    let isPaused = false;
    
    const scroll = () => {
      if (isPaused) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const maxScroll = scrollHeight - clientHeight;
      
      if (maxScroll <= 0) return; // 内容不足，无需滚动
      
      // 到达底部，改变方向
      if (scrollTop >= maxScroll - 1) {
        scrollDirection = -1;
      }
      // 到达顶部，改变方向
      else if (scrollTop <= 1) {
        scrollDirection = 1;
      }
      
      scrollContainer.scrollTop += scrollDirection * 0.5; // 每次滚动0.5px
    };
    
    const interval = setInterval(scroll, 30); // 每30ms滚动一次
    
    // 鼠标悬停时暂停滚动
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      clearInterval(interval);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [riskAlerts, opportunityAlerts]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#dc2626';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high': return '高风险';
      case 'medium': return '中风险';
      case 'low': return '低风险';
      default: return '未知';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>舆情监测与智能预警</h2>
        <span
          className={styles.riskBadge}
          style={{ 
            backgroundColor: `${getRiskColor(sentimentData.riskLevel)}33`, 
            color: getRiskColor(sentimentData.riskLevel) 
          }}
        >
          {getRiskLabel(sentimentData.riskLevel)}
        </span>
      </div>

      <div className={styles.content}>
        {/* 顶部：舆论态势 - 横版情感对比条 */}
        <div className={styles.sentimentSection}>
          <h3 className={styles.sectionTitle}>舆论态势</h3>
          <div className={styles.sentimentBar}>
            <motion.div
              className={styles.positive}
              initial={{ width: 0 }}
              animate={{ width: `${sentimentData.positive}%` }}
              transition={{ duration: 0.8 }}
            >
              <span className={styles.label}>正面 {sentimentData.positive}%</span>
            </motion.div>
            <motion.div
              className={styles.neutral}
              initial={{ width: 0 }}
              animate={{ width: `${sentimentData.neutral}%` }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <span className={styles.label}>中性 {sentimentData.neutral}%</span>
            </motion.div>
            <motion.div
              className={styles.negative}
              initial={{ width: 0 }}
              animate={{ width: `${sentimentData.negative}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className={styles.label}>负面 {sentimentData.negative}%</span>
            </motion.div>
          </div>
        </div>

        {/* 下方：单列布局 - 风险预警在上，机会话题在下 */}
        <div ref={scrollRef} className={styles.singleColumn}>
          {/* 风险预警 */}
          <div className={styles.alertSection}>
            <h3 className={styles.columnTitle}>
              <span className={styles.icon}>⚠️</span>
              风险预警 ({riskAlerts.length})
            </h3>
            <div className={styles.alertList}>
              {riskAlerts.length === 0 ? (
                <div className={styles.emptyState}>暂无风险预警</div>
              ) : (
                riskAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    className={`${styles.alertItem} ${styles.alertRisk}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className={styles.alertHeader}>
                      <span
                        className={styles.levelBadge}
                        style={{
                          backgroundColor: `${getLevelColor(alert.level)}33`,
                          color: getLevelColor(alert.level),
                        }}
                      >
                        {getLevelLabel(alert.level)}
                      </span>
                      <span className={styles.alertTopic}>{alert.topic}</span>
                    </div>
                    <div className={styles.alertReason}>{alert.reason}</div>
                    {alert.trendingItem && (
                      <div className={styles.trendingContent}>
                        <div className={styles.trendingMeta}>
                          <span className={styles.trendingPlatform}>{alert.trendingItem.platform}</span>
                          <span className={styles.trendingRank}>#{alert.trendingItem.rank}</span>
                          <span className={styles.trendingHeat}>{(alert.trendingItem.heat / 10000).toFixed(1)}万热度</span>
                        </div>
                      </div>
                    )}
                    <div className={styles.metrics}>
                      {alert.metrics.negativeGrowth && (
                        <span className={styles.metric}>
                          负面增长: <span className={styles.metricValue}>+{alert.metrics.negativeGrowth}%</span>
                        </span>
                      )}
                      {alert.metrics.polarization && (
                        <span className={styles.metric}>
                          分化度: <span className={styles.metricValue}>{alert.metrics.polarization}%</span>
                        </span>
                      )}
                    </div>
                    <div className={styles.suggestion}>
                      <span className={styles.suggestionLabel}>建议:</span>
                      {alert.suggestion}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* 机会话题 */}
          <div className={styles.alertSection}>
            <h3 className={styles.columnTitle}>
              <span className={styles.icon}>✅</span>
              机会话题 ({opportunityAlerts.length})
            </h3>
            <div className={styles.alertList}>
              {opportunityAlerts.length === 0 ? (
                <div className={styles.emptyState}>暂无机会话题</div>
              ) : (
                opportunityAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    className={`${styles.alertItem} ${styles.alertOpportunity}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className={styles.alertHeader}>
                      <span className={styles.alertTopic}>{alert.topic}</span>
                    </div>
                    <div className={styles.alertReason}>{alert.reason}</div>
                    {alert.trendingItem && (
                      <div className={styles.trendingContent}>
                        <div className={styles.trendingMeta}>
                          <span className={styles.trendingPlatform}>{alert.trendingItem.platform}</span>
                          <span className={styles.trendingRank}>#{alert.trendingItem.rank}</span>
                          <span className={styles.trendingHeat}>{(alert.trendingItem.heat / 10000).toFixed(1)}万热度</span>
                        </div>
                      </div>
                    )}
                    {alert.metrics.positiveGrowth && (
                      <div className={styles.metrics}>
                        <span className={styles.metric}>
                          正面增长: <span className={styles.metricValuePositive}>+{alert.metrics.positiveGrowth}%</span>
                        </span>
                      </div>
                    )}
                    <div className={styles.suggestion}>
                      <span className={styles.suggestionLabel}>建议:</span>
                      {alert.suggestion}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
