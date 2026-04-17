'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Alert } from '../../types';
import styles from './AlertSystem.module.css';

interface AlertSystemProps {
  data: Alert[];
}

export default function AlertSystem({ data }: AlertSystemProps) {
  // 按类型和级别分组
  const riskAlerts = data.filter(a => a.type === 'risk').sort((a, b) => {
    const levelOrder = { high: 0, medium: 1, low: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  const opportunityAlerts = data.filter(a => a.type === 'opportunity');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'risk' ? '⚠️' : '💡';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>智能预警</h2>
        <span className={styles.badge}>{data.length}条</span>
      </div>

      <div className={styles.content}>
        {/* 风险预警 */}
        {riskAlerts.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.icon}>⚠️</span>
              风险预警
            </h3>
            <div className={styles.alertList}>
            {riskAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className={`${styles.alertItem} ${styles.alertRisk}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
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
                {alert.metrics.negativeGrowth && (
                  <div className={styles.metric}>
                    负面情绪增长: <span className={styles.metricValue}>+{alert.metrics.negativeGrowth}%</span>
                  </div>
                )}
                {alert.metrics.polarization && (
                  <div className={styles.metric}>
                    观点分化度: <span className={styles.metricValue}>{alert.metrics.polarization}%</span>
                  </div>
                )}
                <div className={styles.suggestion}>
                  <span className={styles.suggestionLabel}>建议:</span>
                  {alert.suggestion}
                </div>
              </motion.div>
            ))}
            </div>
          </div>
        )}

        {/* 机会话题 */}
        {opportunityAlerts.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.icon}>💡</span>
              机会话题
            </h3>
            <div className={styles.alertList}>
              {opportunityAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  className={`${styles.alertItem} ${styles.alertOpportunity}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className={styles.alertHeader}>
                    <span className={styles.alertTopic}>{alert.topic}</span>
                  </div>
                  <div className={styles.alertReason}>{alert.reason}</div>
                  {alert.metrics.positiveGrowth && (
                    <div className={styles.metric}>
                      正面情绪增长: <span className={styles.metricValuePositive}>+{alert.metrics.positiveGrowth}%</span>
                    </div>
                  )}
                  <div className={styles.suggestion}>
                    <span className={styles.suggestionLabel}>建议:</span>
                    {alert.suggestion}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
