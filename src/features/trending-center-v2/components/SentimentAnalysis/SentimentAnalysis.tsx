'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { SentimentData } from '../../types';
import styles from './SentimentAnalysis.module.css';

// 注册 ECharts 组件
echarts.use([LineChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

interface SentimentAnalysisProps {
  data: SentimentData;
}

export default function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // 渲染趋势图表
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(14, 10, 4, 0.95)',
        borderColor: 'rgba(255, 149, 0, 0.5)',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: ['正面', '负面'],
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
        top: 0,
      },
      grid: {
        left: 40,
        right: 20,
        top: 40,
        bottom: 30,
      },
      xAxis: {
        type: 'category',
        data: data.history.map(h => h.time),
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 10,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 149, 0, 0.2)',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 10,
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      series: [
        {
          name: '正面',
          type: 'line',
          data: data.history.map(h => h.positive),
          smooth: true,
          lineStyle: {
            color: '#4ade80',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(74, 222, 128, 0.3)' },
              { offset: 1, color: 'rgba(74, 222, 128, 0.05)' },
            ]),
          },
        },
        {
          name: '负面',
          type: 'line',
          data: data.history.map(h => h.negative),
          smooth: true,
          lineStyle: {
            color: '#f87171',
            width: 2,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(248, 113, 113, 0.3)' },
              { offset: 1, color: 'rgba(248, 113, 113, 0.05)' },
            ]),
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  // 风险等级颜色
  const getRiskColor = (level: string) => {
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

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'high':
        return '高风险';
      case 'medium':
        return '中风险';
      case 'low':
        return '低风险';
      default:
        return '未知';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>情感分析</h2>
        <span
          className={styles.riskBadge}
          style={{ backgroundColor: `${getRiskColor(data.riskLevel)}33`, color: getRiskColor(data.riskLevel) }}
        >
          {getRiskLabel(data.riskLevel)}
        </span>
      </div>

      {/* 情感分布条 */}
      <div className={styles.sentimentBar}>
        <motion.div
          className={styles.positive}
          initial={{ width: 0 }}
          animate={{ width: `${data.positive}%` }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.label}>正面 {data.positive}%</span>
        </motion.div>
        <motion.div
          className={styles.neutral}
          initial={{ width: 0 }}
          animate={{ width: `${data.neutral}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className={styles.label}>中性 {data.neutral}%</span>
        </motion.div>
        <motion.div
          className={styles.negative}
          initial={{ width: 0 }}
          animate={{ width: `${data.negative}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className={styles.label}>负面 {data.negative}%</span>
        </motion.div>
      </div>

      {/* 趋势指示器 */}
      <div className={styles.trendIndicator}>
        <span className={styles.trendLabel}>情感趋势:</span>
        <span
          className={`${styles.trendValue} ${
            data.trend === 'up' ? styles.trendUp : data.trend === 'down' ? styles.trendDown : ''
          }`}
        >
          {data.trend === 'up' ? '↑' : data.trend === 'down' ? '↓' : '→'} {Math.abs(data.trendValue)}%
        </span>
      </div>

      {/* 关键词云 */}
      <div className={styles.keywords}>
        <div className={styles.keywordSection}>
          <h3 className={styles.keywordTitle}>正面关键词</h3>
          <div className={styles.keywordList}>
            {data.keywords.positive.map((keyword, index) => (
              <motion.span
                key={index}
                className={`${styles.keyword} ${styles.keywordPositive}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
        <div className={styles.keywordSection}>
          <h3 className={styles.keywordTitle}>负面关键词</h3>
          <div className={styles.keywordList}>
            {data.keywords.negative.map((keyword, index) => (
              <motion.span
                key={index}
                className={`${styles.keyword} ${styles.keywordNegative}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {keyword}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* 趋势图表 */}
      <div className={styles.chartSection}>
        <h3 className={styles.chartTitle}>情感变化趋势</h3>
        <div ref={chartRef} className={styles.chart} />
      </div>
    </div>
  );
}
