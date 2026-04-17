'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { HeatMapData } from '../../types';
import styles from './HeatMap.module.css';

// 注册 ECharts 组件
echarts.use([HeatmapChart, GridComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

interface HeatMapProps {
  data: HeatMapData[];
}

export default function HeatMap({ data }: HeatMapProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 提取类别和时间点
    const categories = Array.from(new Set(data.map(d => d.category)));
    const timePoints = Array.from(new Set(data.map(d => d.time)));

    // 转换数据格式 [时间索引, 类别索引, 值]
    const chartData = data.map(d => {
      const timeIndex = timePoints.indexOf(d.time);
      const categoryIndex = categories.indexOf(d.category);
      return [timeIndex, categoryIndex, Math.round(d.value)];
    });

    // 找出最大值用于颜色映射
    const maxValue = Math.max(...data.map(d => d.value));

    // 配置图表
    const option: echarts.EChartsCoreOption = {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const [timeIdx, catIdx, value] = params.data;
          return `${categories[catIdx]}<br/>${timePoints[timeIdx]}<br/>热度: ${value.toLocaleString()}`;
        },
        backgroundColor: 'rgba(14, 10, 4, 0.95)',
        borderColor: 'rgba(255, 149, 0, 0.5)',
        textStyle: {
          color: '#fff',
        },
      },
      grid: {
        left: 60,
        right: 20,
        top: 20,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: timePoints,
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)'],
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 10,
          interval: 2,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 149, 0, 0.2)',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.02)', 'rgba(255, 255, 255, 0.05)'],
          },
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 11,
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 149, 0, 0.2)',
          },
        },
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: ['#1e3a8a', '#3b82f6', '#fbbf24', '#f97316', '#dc2626'],
        },
        textStyle: {
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 10,
        },
      },
      series: [
        {
          name: '热度',
          type: 'heatmap',
          data: chartData,
          label: {
            show: false,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(255, 149, 0, 0.5)',
            },
          },
        },
      ],
    };

    chartInstance.current.setOption(option);

    // 响应式调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  // 清理
  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>24小时热度热力图</h2>
        <span className={styles.badge}>趋势</span>
      </div>
      <div ref={chartRef} className={styles.chart} />
    </div>
  );
}
