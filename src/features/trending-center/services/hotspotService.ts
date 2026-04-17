import hotspotData from '../data/hotspotData.json';
import type {
  Platform,
  PlatformFeedData,
  TrendingItem,
  AnalysisData,
  CacheStatus,
  Feed,
} from '../types';

/**
 * Fetch all available platforms
 */
export async function fetchPlatforms(): Promise<Platform[]> {
  try {
    console.log('[Hotspot] Loading platforms from local data');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const platforms = hotspotData.platforms as Platform[];
    console.log(`[Hotspot] Loaded ${platforms.length} platforms from local data`);
    
    return platforms;
  } catch (error) {
    console.error('[Hotspot] Failed to load platforms:', error);
    return [];
  }
}

/**
 * Fetch feeds for a specific platform
 */
export async function fetchPlatformFeeds(
  platformId: string,
  limit = 50,
  offset = 0
): Promise<PlatformFeedData | null> {
  try {
    console.log(`[Hotspot] Loading feeds for ${platformId} from local data`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const feedData = (hotspotData.feeds as any)[platformId] as PlatformFeedData | undefined;
    
    if (feedData) {
      console.log(`[Hotspot] Loaded ${feedData.data.length} feeds for ${platformId}`);
      return feedData;
    }
    
    console.warn(`[Hotspot] No data found for platform: ${platformId}`);
    return null;
  } catch (error) {
    console.error(`[Hotspot] Failed to load feeds for ${platformId}:`, error);
    return null;
  }
}

/**
 * Fetch feeds from multiple platforms concurrently
 */
export async function fetchMultiplePlatformFeeds(
  platformIds: string[],
  limit = 20
): Promise<Record<string, PlatformFeedData>> {
  const results: Record<string, PlatformFeedData> = {};
  
  // Load all platforms concurrently
  const promises = platformIds.map(async (platformId) => {
    const data = await fetchPlatformFeeds(platformId, limit);
    if (data) {
      results[platformId] = data;
    }
  });
  
  await Promise.all(promises);
  
  console.log(`[Hotspot] Loaded feeds for ${Object.keys(results).length}/${platformIds.length} platforms`);
  return results;
}

/**
 * Get cache status
 */
export function getCacheStatus(): CacheStatus {
  return {
    source: 'local-json',
    platforms: hotspotData.platforms.length,
    feeds: Object.keys(hotspotData.feeds).length,
    updatedAt: hotspotData.updatedAt,
  };
}

/**
 * Transform feed data to trending item format
 */
export function transformFeedToTrending(feed: Feed, platformName: string): TrendingItem {
  return {
    id: feed.id || `${platformName}-${feed.rank}`,
    title: feed.title,
    platform: platformName,
    heat: feed.hotValue || 0,
    rank: feed.rank || 0,
    url: feed.url,
    delta: '+0%', // Requires historical data to calculate
    sentiment: 'neutral', // Requires sentiment analysis
    isNew: false, // Requires historical data to determine
  };
}

/**
 * Generate analysis data from feeds
 */
export function generateAnalysisData(feeds: Feed[]): AnalysisData {
  if (!feeds || feeds.length === 0) {
    return {
      trendData: [],
      sentiment: { positive: 33, neutral: 34, negative: 33 },
      keywords: [],
      categoryData: [],
    };
  }

  // Generate 24-hour trend data (simulated)
  const trendData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date().getHours() - (23 - i);
    const time = `${(hour + 24) % 24}:00`;
    const value = Math.floor(Math.random() * 5000) + 1000;
    return { time, value };
  });

  // Extract keywords from titles
  const allWords = feeds.flatMap(f => f.title.split(/[\s,，、。！？]+/));
  const wordCount: Record<string, number> = {};
  allWords.forEach(word => {
    if (word.length >= 2) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  
  const keywords = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([word]) => word);

  // Sentiment analysis (simple simulation)
  const sentiment = {
    positive: Math.floor(Math.random() * 30) + 40,
    neutral: Math.floor(Math.random() * 20) + 20,
    negative: 0,
  };
  sentiment.negative = 100 - sentiment.positive - sentiment.neutral;

  // Topic category distribution (based on keyword analysis)
  const categories = [
    { label: '科技创新', keywords: ['AI', '技术', '科技', '智能', '数字', '芯片', '量子'] },
    { label: '社会民生', keywords: ['教育', '健康', '医疗', '养生', '生活', '社会'] },
    { label: '娱乐文化', keywords: ['明星', '电影', '音乐', '游戏', '动画', '视频'] },
    { label: '经济财经', keywords: ['经济', '市场', '投资', '融资', '股', '金融'] },
    { label: '时事热点', keywords: ['新闻', '事件', '政策', '国际', '热搜', '话题'] },
  ];

  const categoryData = categories.map(cat => {
    let count = 0;
    feeds.forEach(feed => {
      if (cat.keywords.some(kw => feed.title.includes(kw))) {
        count++;
      }
    });
    // If no matches, give a random small value
    if (count === 0) {
      count = Math.floor(Math.random() * 3) + 1;
    }
    return { label: cat.label, value: count };
  });

  return {
    trendData,
    sentiment,
    keywords,
    categoryData,
  };
}
