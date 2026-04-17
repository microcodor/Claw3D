'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as echarts from 'echarts/core';
import { BarChart, PieChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { AudienceProfile as AudienceProfileType } from '../../types';
import styles from './AudienceProfile.module.css';

// 注册 ECharts 组件
echarts.use([
  BarChart,
  PieChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

interface AudienceProfileProps {
  data: AudienceProfileType;
}

export default function AudienceProfile({ data }: AudienceProfileProps) {
  const ageChartRef = useRef<HTMLDivElement>(null);
  const regionChartRef = useRef<HTMLDivElement>(null);
  const activeChartRef = useRef<HTMLDivElement>(null);
  const interactionChartRef = useRef<HTMLDivElement>(null);

  // 年龄分布图
  useEffect(() => {
    if (!ageChartRef.current) return;

    const chart = echarts.init(ageChartRef.current);
    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(14, 10, 4, 0.95)',
        borderColor: 'rgba(255, 149, 0, 0.5)',
        textStyle: { color: '#fff' },
      },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: data.ageDistribution.map(d => d.range),
        axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 },
        axisLine: { lineStyle: { color: 'rgba(255, 149, 0, 0.2)' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 10, formatter: '{value}%' },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      },
      series: [
        {
          type: 'bar',
          data: data.ageDistribution.map(d => d.percentage),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff9500' },
              { offset: 1, color: '#ff6b35' },
            ]),
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '60%',
        },
      ],
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  // 地域分布图
  useEffect(() => {
    if (!regionChartRef.current) return;

    const chart = echarts.init(regionChartRef.current);
    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
        backgroundColor: 'rgba(14, 10, 4, 0.95)',
        borderColor: 'rgba(255, 149, 0, 0.5)',
        textStyle: { color: '#fff' },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#0e0a04',
            borderWidth: 2,
          },
          label: {
            show: true,
            fontSize: 10,
            color: '#fff',
            formatter: '{b}\n{c}%',
          },
          data: data.regionDistribution.map((d, i) => ({
            value: d.percentage,
            name: d.region,
            itemStyle: {
              color: [
                '#ff9500',
                '#ff6b35',
                '#3b82f6',
                '#8b5cf6',
                '#10b981',
                '#f59e0b',
                '#6b7280',
              ][i % 7],
            },
          })),
        },
      ],
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  // 活跃时段图
  useEffect(() => {
    if (!activeChartRef.current) return;

    const chart = echarts.init(activeChartRef.current);
    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(14, 10, 4, 0.95)',
        borderColor: 'rgba(255, 149, 0, 0.5)',
        textStyle: { color: '#fff' },
      },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: data.activeHours.map(d => `${d.hour}:00`),
        axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 9, interval: 2 },
        axisLine: { lineStyle: { color: 'rgba(255, 149, 0, 0.2)' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
      },
      series: [
        {
          type: 'line',
          data: data.activeHours.map(d => d.activity),
          smooth: true,
          lineStyle: { color: '#3b82f6', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.4)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ]),
          },
        },
      ],
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  // 互动方式图
  useEffect(() => {
    if (!interactionChartRef.current) return;

    const chart = echarts.init(interactionChartRef.current);
    const option: echarts.EChartsCoreOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%',
        backgroundColor: 'rgba(14, 10, 4, 0.95)',
        borderColor: 'rgba(255, 149, 0, 0.5)',
        textStyle: { color: '#fff' },
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          data: [
            { value: data.interactionTypes.share, name: '分享', itemStyle: { color: '#ff9500' } },
            { value: data.interactionTypes.comment, name: '评论', itemStyle: { color: '#3b82f6' } },
            { value: data.interactionTypes.like, name: '点赞', itemStyle: { color: '#f87171' } },
          ],
          label: {
            show: true,
            fontSize: 11,
            color: '#fff',
            formatter: '{b}\n{c}%',
          },
          itemStyle: {
            borderRadius: 4,
            borderColor: '#0e0a04',
            borderWidth: 2,
          },
        },
      ],
    };
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>人群画像</h2>
        <span className={styles.badge}>分析</span>
      </div>

      <div className={styles.grid}>
        {/* 年龄分布 */}
        <motion.div
          className={styles.chartBox}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className={styles.chartTitle}>年龄分布</h3>
          <div ref={ageChartRef} className={styles.chart} />
        </motion.div>

        {/* 地域分布 */}
        <motion.div
          className={styles.chartBox}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className={styles.chartTitle}>地域分布</h3>
          <div ref={regionChartRef} className={styles.chart} />
        </motion.div>

        {/* 活跃时段 */}
        <motion.div
          className={styles.chartBox}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className={styles.chartTitle}>活跃时段</h3>
          <div ref={activeChartRef} className={styles.chart} />
        </motion.div>

        {/* 互动方式 */}
        <motion.div
          className={styles.chartBox}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className={styles.chartTitle}>互动方式</h3>
          <div ref={interactionChartRef} className={styles.chart} />
        </motion.div>
      </div>
    </div>
  );
}
