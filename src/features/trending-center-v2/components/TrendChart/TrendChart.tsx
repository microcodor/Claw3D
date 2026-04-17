'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  fetchPlatforms,
  fetchPlatformFeeds,
  generateAnalysisData,
} from '@/features/trending-center/services/hotspotService';
import type { Platform } from '@/features/trending-center/types';
import styles from './TrendChart.module.css';

// Simple line chart component
function MiniLineChart({ data }: { data: { time: string; value: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = 120;
    ctx.scale(2, 2);
    
    const w = canvas.offsetWidth;
    const h = 60;
    const vals = data.map(d => d.value);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    
    const toX = (i: number) => (i / (vals.length - 1)) * w;
    const toY = (v: number) => h - ((v - min) / range) * (h - 12) - 4;
    
    ctx.clearRect(0, 0, w, h);
    
    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(255, 149, 0, 0.3)');
    grad.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.moveTo(toX(0), h);
    vals.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
    ctx.lineTo(toX(vals.length - 1), h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Line
    ctx.beginPath();
    vals.forEach((v, i) => {
      if (i === 0) ctx.moveTo(toX(i), toY(v));
      else ctx.lineTo(toX(i), toY(v));
    });
    ctx.strokeStyle = '#ff9500';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff9500';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Last point dot
    const lx = toX(vals.length - 1);
    const ly = toY(vals[vals.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ff9500';
    ctx.fill();
  }, [data]);
  
  return <canvas ref={canvasRef} className={styles.lineChart} style={{ height: 60 }} />;
}

export default function TrendChart() {
  const [trendData, setTrendData] = useState<{ time: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const platformList = await fetchPlatforms();
        
        if (platformList && platformList.length > 0) {
          const platform = platformList[0];
          const feedData = await fetchPlatformFeeds(platform.id, 20);
          
          if (feedData && feedData.data) {
            const analysisData = generateAnalysisData(feedData.data);
            setTrendData(analysisData.trendData);
          }
        }
      } catch (err) {
        console.error('[TrendChart] Load error:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📈 24小时讨论量趋势</h2>
        <span className={styles.badge}>每小时更新</span>
      </div>
      
      <div className={styles.chartContainer}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : trendData.length > 0 ? (
          <>
            <MiniLineChart data={trendData} />
            <div className={styles.chartLabels}>
              <span>{trendData[0]?.time}</span>
              <span>{trendData[Math.floor(trendData.length / 2)]?.time}</span>
              <span>{trendData[trendData.length - 1]?.time}</span>
            </div>
          </>
        ) : (
          <div className={styles.empty}>暂无趋势数据</div>
        )}
      </div>
    </div>
  );
}
