'use client';

import { useState, useEffect, useRef } from 'react';
import {
  fetchPlatforms,
  fetchPlatformFeeds,
  transformFeedToTrending,
  generateAnalysisData,
} from '../services/hotspotService';
import type { Platform, TrendingItem, AnalysisData } from '../types';
import styles from '../styles/trending-center.module.css';

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
    grad.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
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
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#00d4ff';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Last point dot
    const lx = toX(vals.length - 1);
    const ly = toY(vals[vals.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00d4ff';
    ctx.fill();
  }, [data]);
  
  return <canvas ref={canvasRef} className={styles.lineChart} style={{ height: 60 }} />;
}

// Sentiment pie chart
function SentimentPie({ data }: { data: { positive: number; neutral: number; negative: number } }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = 80;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);
    
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.38;
    
    const segments = [
      { val: data.positive, color: '#00ff88' },
      { val: data.neutral, color: '#00d4ff' },
      { val: data.negative, color: '#ff2d78' },
    ];
    
    const total = segments.reduce((s, x) => s + x.val, 0);
    let angle = -Math.PI / 2;
    
    segments.forEach(seg => {
      const sweep = (seg.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + sweep);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = seg.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      angle += sweep;
    });
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = '#0a1520';
    ctx.fill();
  }, [data]);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <canvas ref={canvasRef} style={{ width: 80, height: 80, display: 'block' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'clamp(9px, 0.7vw, 11px)', color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff88' }} />
          <span>正面 {data.positive}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'clamp(9px, 0.7vw, 11px)', color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4ff' }} />
          <span>中性 {data.neutral}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 'clamp(9px, 0.7vw, 11px)', color: 'rgba(255,255,255,0.7)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff2d78' }} />
          <span>负面 {data.negative}%</span>
        </div>
      </div>
    </div>
  );
}

// Keyword cloud
function KeywordCloud({ keywords }: { keywords: string[] }) {
  const colors = ['cyan', 'green', 'orange', 'purple'];
  const sizes = ['sm', 'md', 'lg'];
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {keywords.map((k, i) => {
        const colorMap: Record<string, string> = {
          cyan: 'rgba(0, 212, 255, 0.9)',
          green: 'rgba(0, 255, 136, 0.9)',
          orange: 'rgba(255, 107, 53, 0.9)',
          purple: 'rgba(168, 85, 247, 0.9)',
        };
        const color = colorMap[colors[i % colors.length]];
        const sizeMap: Record<string, string> = {
          sm: 'clamp(8px, 0.65vw, 10px)',
          md: 'clamp(9px, 0.75vw, 12px)',
          lg: 'clamp(10px, 0.85vw, 13px)',
        };
        const fontSize = sizeMap[sizes[i % 3]];
        
        return (
          <span
            key={k}
            style={{
              padding: '2px 8px',
              borderRadius: 2,
              fontFamily: 'Courier New, monospace',
              border: `1px solid ${color}`,
              color,
              background: `${color}10`,
              fontSize,
              opacity: i % 3 === 0 ? 1 : i % 3 === 1 ? 0.85 : 0.7,
            }}
          >
            {k}
          </span>
        );
      })}
    </div>
  );
}

// Horizontal bar chart
function HorizontalBarChart({ data }: { data: { label: string; value: number }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#00d4ff', '#00ff88', '#ff6b35', '#a855f7'];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
      {data.map((item, i) => {
        const percentage = (item.value / maxValue) * 100;
        const color = colors[i % colors.length];
        
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 70, flexShrink: 0, fontSize: 'clamp(9px, 0.7vw, 11px)', color: 'rgba(255,255,255,0.7)', textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
              {item.label}
            </div>
            <div style={{ flex: 1, height: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              <div
                style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: color,
                  boxShadow: `0 0 8px ${color}88`,
                  borderRadius: 2,
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
            <div style={{ width: 30, flexShrink: 0, fontSize: 'clamp(9px, 0.7vw, 11px)', color: 'rgba(255,255,255,0.9)', textAlign: 'right', fontFamily: 'Courier New, monospace' }}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Trending row component
function TrendingRow({ item, rank }: { item: TrendingItem; rank: number }) {
  const deltaColor = item.delta.startsWith('+') ? 'rgba(0, 255, 136, 0.9)' : 'rgba(255, 45, 120, 0.9)';
  const sentColor = {
    positive: 'rgba(0, 255, 136, 0.9)',
    negative: 'rgba(255, 45, 120, 0.9)',
    neutral: 'rgba(255, 255, 255, 0.7)',
  }[item.sentiment];
  
  return (
    <div className={styles.trendRow}>
      <div className={`${styles.trendRank} ${rank <= 3 ? styles.rankTop : ''} ${rank === 1 ? styles.rank1 : rank === 2 ? styles.rank2 : rank === 3 ? styles.rank3 : ''}`}>
        {rank}
      </div>
      <div className={styles.trendInfo}>
        <div className={styles.trendTitle}>{item.title}</div>
        <div className={styles.trendSub}>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{item.platform}</span>
          <span style={{ color: sentColor }}>
            ● {item.sentiment === 'positive' ? '正面' : item.sentiment === 'negative' ? '负面' : '中性'}
          </span>
        </div>
      </div>
      <div className={styles.trendRight}>
        <div className={styles.trendHeat}>{(item.heat / 10000).toFixed(0)}万</div>
        <div className={styles.trendDelta} style={{ color: deltaColor }}>{item.delta}</div>
      </div>
    </div>
  );
}

// Main component
export default function TrendingCenterScreen() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisData>({
    trendData: [],
    sentiment: { positive: 50, neutral: 30, negative: 20 },
    keywords: [],
    categoryData: [],
  });
  const [nextRefresh, setNextRefresh] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Initialize: fetch platforms
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        setError(null);
        
        const platformList = await fetchPlatforms();
        
        if (platformList && platformList.length > 0) {
          setPlatforms(platformList);
          console.log(`[SCR-02] Loaded ${platformList.length} platforms`);
          
          // Load first platform data immediately
          loadPlatformData(platformList[0].id, platformList[0].displayName);
        } else {
          setError('未能获取平台列表');
        }
      } catch (err) {
        console.error('[SCR-02] Init error:', err);
        setError('初始化失败: ' + (err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    
    init();
  }, []);
  
  // Load platform data
  async function loadPlatformData(platformId: string, platformName: string) {
    try {
      console.log(`[SCR-02] Loading data for platform: ${platformId}`);
      
      const feedData = await fetchPlatformFeeds(platformId, 20);
      
      if (feedData && feedData.data) {
        const trendingItems = feedData.data.map(feed =>
          transformFeedToTrending(feed, platformName)
        );
        
        setTrending(trendingItems);
        
        const analysisData = generateAnalysisData(feedData.data);
        setAnalysis(analysisData);
        
        setScrollOffset(0);
        
        console.log(`[SCR-02] Loaded ${trendingItems.length} items for ${platformName}`);
      }
    } catch (err) {
      console.error(`[SCR-02] Failed to load platform data:`, err);
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
        
        console.log(`[SCR-02] Switching to platform: ${platform.displayName}`);
        loadPlatformData(platform.id, platform.displayName);
        
        return next;
      });
      
      setNextRefresh(30);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [platforms]);
  
  // Refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setNextRefresh(n => Math.max(0, n - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const currentPlatform = platforms[currentPlatformIndex];
  
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.title}>◈ 热搜舆情中心</div>
          {loading ? (
            <div className={`${styles.badge} ${styles.badgeCyan}`}>加载中...</div>
          ) : error ? (
            <div className={`${styles.badge} ${styles.badgeCyan}`}>{error}</div>
          ) : (
            <>
              <div className={`${styles.badge} ${styles.badgeOrange}`}>实时数据</div>
              {currentPlatform && (
                <div className={`${styles.badge} ${styles.badgeCyan}`}>{currentPlatform.displayName}</div>
              )}
            </>
          )}
        </div>
        <div className={styles.headerRight}>
          <span>
            平台: <span className={styles.glowCyan}>{currentPlatformIndex + 1}/{platforms.length}</span>
          </span>
          <span>
            下次切换: <span className={styles.glowOrange}>{nextRefresh}s</span>
          </span>
        </div>
      </div>
      
      <div className={styles.body}>
        {/* Left: Hot list */}
        <div className={`${styles.col} ${styles.colList}`}>
          <div className={`${styles.card} ${styles.trendingPanel}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>🔥 实时热搜榜</span>
              <div className={styles.sourceTabs}>
                {platforms.map((platform, i) => (
                  <span
                    key={platform.id}
                    className={`${styles.sourceTab} ${i === currentPlatformIndex ? styles.active : ''}`}
                    onClick={() => {
                      setCurrentPlatformIndex(i);
                      loadPlatformData(platform.id, platform.displayName);
                      setNextRefresh(30);
                    }}
                  >
                    {platform.displayName}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.trendList}>
              {loading ? (
                <div className={styles.loading}>加载中...</div>
              ) : trending.length === 0 ? (
                <div className={styles.empty}>暂无数据</div>
              ) : (
                <div
                  className={styles.trendScrollWrapper}
                  style={{ transform: `translateY(-${scrollOffset}px)` }}
                >
                  {[...trending, ...trending].map((item, i) => (
                    <TrendingRow
                      key={`${item.id}-${i}`}
                      item={item}
                      rank={(i % trending.length) + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right: Analysis */}
        <div className={`${styles.col} ${styles.colAnalysis}`}>
          {/* Trend chart */}
          <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>📈 24小时讨论量趋势</span>
              <span className={`${styles.badge} ${styles.badgeCyan}`}>每小时更新</span>
            </div>
            <div className={styles.chartContainer}>
              {analysis.trendData.length > 0 ? (
                <>
                  <MiniLineChart data={analysis.trendData} />
                  <div className={styles.chartLabels}>
                    <span>{analysis.trendData[0]?.time}</span>
                    <span>{analysis.trendData[Math.floor(analysis.trendData.length / 2)]?.time}</span>
                    <span>{analysis.trendData[analysis.trendData.length - 1]?.time}</span>
                  </div>
                </>
              ) : (
                <div className={styles.empty}>暂无趋势数据</div>
              )}
            </div>
          </div>
          
          {/* Category distribution */}
          <div className={`${styles.card} ${styles.chartCard}`}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>📊 话题分类分布</span>
              <span className={`${styles.badge} ${styles.badgeCyan}`}>实时统计</span>
            </div>
            <div className={styles.chartContainer}>
              {analysis.categoryData.length > 0 ? (
                <HorizontalBarChart data={analysis.categoryData} />
              ) : (
                <div className={styles.empty}>暂无分类数据</div>
              )}
            </div>
          </div>
          
          {/* Analysis card */}
          <div className={`${styles.card} ${styles.analysisCard}`}>
            <div className={styles.videoHeader}>
              <div className={`${styles.badge} ${styles.badgeOrange}`}>
                {currentPlatform?.displayName || '热点分析'}
              </div>
              <div className={styles.videoTitle}>
                {currentPlatform?.category || '综合'} · 实时热点数据分析
              </div>
            </div>
            <div className={styles.videoMeta}>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                数据源: {currentPlatform?.name || 'N/A'}
              </span>
              <span className={styles.glowCyan}>
                条目: {trending.length}
              </span>
              <span className={styles.glowGreen}>
                更新: {currentPlatform?.updatedAt ? new Date(currentPlatform.updatedAt).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
            <div className={styles.videoAnalysis}>
              <div className={styles.analysisCol}>
                <div className={styles.sectionTitle}>舆情分析</div>
                <SentimentPie data={analysis.sentiment} />
              </div>
              <div className={styles.analysisCol}>
                <div className={styles.sectionTitle}>关键词云</div>
                {analysis.keywords.length > 0 ? (
                  <KeywordCloud keywords={analysis.keywords} />
                ) : (
                  <div className={styles.empty}>暂无关键词</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
