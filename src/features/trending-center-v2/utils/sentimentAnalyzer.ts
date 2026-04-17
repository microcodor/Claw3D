/**
 * 情感分析工具
 * 根据热搜标题关键词判断情感倾向
 */

import type { TrendingItem } from '@/features/trending-center/types';

// 正面关键词
const POSITIVE_KEYWORDS = [
  // 成就类
  '突破', '成功', '胜利', '夺冠', '获奖', '冠军', '第一', '领先', '创新', '发明',
  '上市', '融资', '增长', '上涨', '盈利', '收益', '利好', '繁荣',
  
  // 情感类
  '喜欢', '爱', '感动', '温暖', '幸福', '快乐', '开心', '欢乐', '美好', '精彩',
  '赞', '支持', '点赞', '好评', '优秀', '棒', '厉害', '牛', '强',
  
  // 期待类
  '期待', '希望', '憧憬', '向往', '梦想', '目标', '未来', '前景', '机遇', '机会',
  
  // 正能量
  '正能量', '励志', '奋斗', '努力', '坚持', '加油', '鼓励', '激励',
  
  // 庆祝类
  '庆祝', '祝贺', '恭喜', '喜讯', '好消息', '佳音',
  
  // 美好事物
  '美丽', '漂亮', '帅', '可爱', '萌', '治愈', '暖心',
];

// 负面关键词
const NEGATIVE_KEYWORDS = [
  // 危机类
  '危机', '风险', '威胁', '隐患', '问题', '困难', '挑战', '危险', '灾难', '事故',
  '失败', '失误', '错误', '过失', '疏忽', '漏洞', '缺陷', '瑕疵',
  
  // 冲突类
  '争议', '质疑', '批评', '指责', '抨击', '谴责', '反对', '抗议', '冲突', '矛盾',
  '纠纷', '争执', '吵架', '打架', '斗殴', '暴力',
  
  // 负面情绪
  '愤怒', '生气', '不满', '失望', '沮丧', '悲伤', '痛苦', '难过', '伤心', '哭',
  '担心', '担忧', '焦虑', '恐慌', '害怕', '恐惧', '紧张',
  
  // 丑闻类
  '丑闻', '曝光', '爆料', '揭露', '黑幕', '内幕', '潜规则', '腐败', '贪污',
  '造假', '欺骗', '诈骗', '骗局', '陷阱', '套路',
  
  // 下降类
  '下跌', '暴跌', '下滑', '下降', '减少', '亏损', '损失', '赔', '跌',
  
  // 疾病灾害
  '疫情', '病毒', '感染', '确诊', '死亡', '伤亡', '地震', '洪水', '火灾',
  
  // 负面评价
  '差', '烂', '垃圾', '糟糕', '恶劣', '低劣', '劣质', '假', '黑',
];

// 中性关键词（用于降低情感强度）
const NEUTRAL_KEYWORDS = [
  '讨论', '分析', '解读', '观点', '看法', '评论', '报道', '消息', '新闻',
  '发布', '公布', '宣布', '通知', '公告', '声明',
  '数据', '统计', '调查', '研究', '报告', '结果',
  '会议', '活动', '仪式', '典礼', '展览', '展示',
  '更新', '升级', '改版', '调整', '变化', '改变',
];

/**
 * 计算文本的情感得分
 * @param text 要分析的文本
 * @returns 情感得分 { positive: number, negative: number, neutral: number }
 */
function calculateSentimentScore(text: string): { positive: number; negative: number; neutral: number } {
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  // 统计正面关键词
  POSITIVE_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      positiveScore += 1;
    }
  });
  
  // 统计负面关键词
  NEGATIVE_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      negativeScore += 1;
    }
  });
  
  // 统计中性关键词
  NEUTRAL_KEYWORDS.forEach(keyword => {
    if (text.includes(keyword)) {
      neutralScore += 0.5;
    }
  });
  
  return { positive: positiveScore, negative: negativeScore, neutral: neutralScore };
}

/**
 * 判断文本的情感倾向
 * @param text 要分析的文本
 * @returns 'positive' | 'negative' | 'neutral'
 */
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const scores = calculateSentimentScore(text);
  
  // 如果正面和负面得分都很低，判断为中性
  if (scores.positive === 0 && scores.negative === 0) {
    return 'neutral';
  }
  
  // 如果正面得分明显高于负面，判断为正面
  if (scores.positive > scores.negative * 1.5) {
    return 'positive';
  }
  
  // 如果负面得分明显高于正面，判断为负面
  if (scores.negative > scores.positive * 1.5) {
    return 'negative';
  }
  
  // 如果正面得分高于负面，判断为正面
  if (scores.positive > scores.negative) {
    return 'positive';
  }
  
  // 如果负面得分高于正面，判断为负面
  if (scores.negative > scores.positive) {
    return 'negative';
  }
  
  // 其他情况判断为中性
  return 'neutral';
}

/**
 * 批量分析热搜数据的情感
 * @param items 热搜数据列表
 * @returns 更新了情感字段的热搜数据列表
 */
export function analyzeTrendingSentiments(items: TrendingItem[]): TrendingItem[] {
  return items.map(item => ({
    ...item,
    sentiment: analyzeSentiment(item.title),
  }));
}

/**
 * 统计情感分布
 * @param items 热搜数据列表
 * @returns 情感分布百分比
 */
export function calculateSentimentDistribution(items: TrendingItem[]): {
  positive: number;
  neutral: number;
  negative: number;
} {
  if (!items || items.length === 0) {
    return { positive: 33, neutral: 34, negative: 33 };
  }
  
  const total = items.length;
  const positive = items.filter(item => item.sentiment === 'positive').length;
  const negative = items.filter(item => item.sentiment === 'negative').length;
  const neutral = total - positive - negative;
  
  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100),
  };
}

/**
 * 获取情感关键词
 * @param items 热搜数据列表
 * @returns 正面和负面关键词列表
 */
export function extractSentimentKeywords(items: TrendingItem[]): {
  positive: string[];
  negative: string[];
} {
  const positiveKeywords = new Set<string>();
  const negativeKeywords = new Set<string>();
  
  items.forEach(item => {
    const text = item.title;
    
    // 提取正面关键词
    POSITIVE_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        positiveKeywords.add(keyword);
      }
    });
    
    // 提取负面关键词
    NEGATIVE_KEYWORDS.forEach(keyword => {
      if (text.includes(keyword)) {
        negativeKeywords.add(keyword);
      }
    });
  });
  
  return {
    positive: Array.from(positiveKeywords).slice(0, 8),
    negative: Array.from(negativeKeywords).slice(0, 8),
  };
}
