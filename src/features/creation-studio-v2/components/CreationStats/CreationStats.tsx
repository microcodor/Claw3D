'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, FileText, Clock } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CreationStats as StatsType, StatsTimeRange } from '../../types';
import { CONTENT_TYPE_CONFIGS, STATS_TIME_RANGE_CONFIG } from '../../utils/constants';
import { generateMockSpeedTrend } from '../../services/statsCalculator';
import styles from './CreationStats.module.css';

interface CreationStatsProps {
  stats: StatsType;
}

export default function CreationStats({ stats }: CreationStatsProps) {
  const [timeRange, setTimeRange] = useState<StatsTimeRange>('today');
  const [activeChart, setActiveChart] = useState<'overview' | 'distribution' | 'trend'>('overview');

  // 准备饼图数据
  const pieData = [
    { name: '文章', value: stats.typeDistribution.article, color: CONTENT_TYPE_CONFIGS.article.color },
    { name: '视频', value: stats.typeDistribution.video, color: CONTENT_TYPE_CONFIGS.video.color },
    { name: '社交', value: stats.typeDistribution.social, color: CONTENT_TYPE_CONFIGS.social.color },
    { name: '广告', value: stats.typeDistribution.ad, color: CONTENT_TYPE_CONFIGS.ad.color },
  ].filter(item => item.value > 0);

  // 使用 Mock 趋势数据
  const trendData = stats.speedTrend.length > 0 
    ? stats.speedTrend 
    : generateMockSpeedTrend(timeRange);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <BarChart3 size={16} style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle', color: '#ff9500' }} />
          创作统计
        </h2>
        <div className={styles.headerRight}>
          <select
            className={styles.timeSelect}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as StatsTimeRange)}
          >
            {Object.entries(STATS_TIME_RANGE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 图表切换按钮 */}
      <div className={styles.chartTabs}>
        <button
          className={`${styles.chartTab} ${activeChart === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveChart('overview')}
        >
          概览
        </button>
        <button
          className={`${styles.chartTab} ${activeChart === 'distribution' ? styles.active : ''}`}
          onClick={() => setActiveChart('distribution')}
        >
          分布
        </button>
        <button
          className={`${styles.chartTab} ${activeChart === 'trend' ? styles.active : ''}`}
          onClick={() => setActiveChart('trend')}
        >
          趋势
        </button>
      </div>

      <div className={styles.content}>
        {/* 概览 */}
        {activeChart === 'overview' && (
          <motion.div
            className={styles.statsGrid}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FileText size={20} style={{ color: '#3b82f6' }} />
              </div>
              <div className={styles.statLabel}>任务数</div>
              <div className={styles.statValue}>{stats.today.taskCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FileText size={20} style={{ color: '#10b981' }} />
              </div>
              <div className={styles.statLabel}>字数</div>
              <div className={styles.statValue}>
                {stats.today.wordCount >= 1000 
                  ? `${(stats.today.wordCount / 1000).toFixed(1)}k`
                  : stats.today.wordCount
                }
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Clock size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div className={styles.statLabel}>耗时</div>
              <div className={styles.statValue}>
                {stats.today.duration >= 60
                  ? `${Math.floor(stats.today.duration / 60)}m`
                  : `${stats.today.duration}s`
                }
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BarChart3 size={20} style={{ color: '#a855f7' }} />
              </div>
              <div className={styles.statLabel}>完成率</div>
              <div className={styles.statValue}>
                {stats.today.completionRate}%
              </div>
            </div>
          </motion.div>
        )}

        {/* 类型分布 */}
        {activeChart === 'distribution' && (
          <motion.div
            className={styles.chartContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {pieData.length === 0 ? (
              <div className={styles.emptyChart}>
                <div className={styles.emptyIcon}>○</div>
                <div className={styles.emptyText}>暂无数据</div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="40%"
                      outerRadius="70%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(14, 10, 4, 0.9)',
                        border: '1px solid rgba(255, 149, 0, 0.3)',
                        borderRadius: '6px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.legend}>
                  {pieData.map((item, index) => (
                    <div key={index} className={styles.legendItem}>
                      <div
                        className={styles.legendColor}
                        style={{ backgroundColor: item.color }}
                      />
                      <span className={styles.legendLabel}>{item.name}</span>
                      <span className={styles.legendValue}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* 速度趋势 */}
        {activeChart === 'trend' && (
          <motion.div
            className={styles.chartContainer}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {trendData.length === 0 ? (
              <div className={styles.emptyChart}>
                <div className={styles.emptyIcon}>○</div>
                <div className={styles.emptyText}>暂无数据</div>
              </div>
            ) : (
              <>
                <div className={styles.chartTitle}>生成速度趋势（字/分钟）</div>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <Line
                      type="monotone"
                      dataKey="speed"
                      stroke="#ff9500"
                      strokeWidth={2}
                      dot={{ fill: '#ff9500', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(14, 10, 4, 0.9)',
                        border: '1px solid rgba(255, 149, 0, 0.3)',
                        borderRadius: '6px',
                        fontSize: '11px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
