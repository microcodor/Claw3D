/**
 * 话题网络生成器
 * 基于真实热搜数据生成话题关联网络
 */

import type { TrendingItem } from '@/features/trending-center/types';
import type { TopicNetwork, TopicNode, TopicEdge } from '../types';

/**
 * 提取文本中的关键词（改进版，支持中文）
 */
function extractKeywords(text: string): string[] {
  // 移除标点符号和特殊字符
  const cleaned = text.replace(/[，。！？、；：""''（）《》【】\s\-\+\=\*\/\\\|\[\]\{\}]/g, '');
  
  // 对于中文，使用滑动窗口提取2-4字的词组
  const keywords = new Set<string>();
  
  // 提取2字词
  for (let i = 0; i < cleaned.length - 1; i++) {
    keywords.add(cleaned.substring(i, i + 2));
  }
  
  // 提取3字词
  for (let i = 0; i < cleaned.length - 2; i++) {
    keywords.add(cleaned.substring(i, i + 3));
  }
  
  // 提取4字词
  for (let i = 0; i < cleaned.length - 3; i++) {
    keywords.add(cleaned.substring(i, i + 4));
  }
  
  return Array.from(keywords);
}

/**
 * 计算两个文本的相似度（基于共同关键词）
 */
function calculateSimilarity(text1: string, text2: string): number {
  const keywords1 = new Set(extractKeywords(text1));
  const keywords2 = new Set(extractKeywords(text2));
  
  if (keywords1.size === 0 || keywords2.size === 0) {
    return 0;
  }
  
  // 计算交集
  const intersection = new Set([...keywords1].filter(k => keywords2.has(k)));
  
  // Jaccard 相似度
  const union = new Set([...keywords1, ...keywords2]);
  return intersection.size / union.size;
}

/**
 * 从热搜数据生成话题网络
 * @param items 热搜数据列表
 * @param maxNodes 最大节点数
 * @param minSimilarity 最小相似度阈值
 */
export function generateTopicNetworkFromTrending(
  items: TrendingItem[],
  maxNodes: number = 15,
  minSimilarity: number = 0.15
): TopicNetwork {
  console.log('[TopicNetworkGenerator] Input items:', items.length);
  
  if (!items || items.length === 0) {
    console.log('[TopicNetworkGenerator] No items, returning empty network');
    // 返回空网络
    return {
      nodes: [],
      edges: [],
      centerNode: '',
    };
  }
  
  // 选择热度最高的作为中心节点
  const centerItem = items[0];
  const selectedItems = items.slice(0, maxNodes);
  
  console.log('[TopicNetworkGenerator] Selected items:', selectedItems.length);
  console.log('[TopicNetworkGenerator] Center item:', centerItem.title);
  
  // 创建节点
  const nodes: TopicNode[] = selectedItems.map((item, index) => {
    // 截取标题（最多10个字符）
    let label = item.title;
    if (label.length > 10) {
      label = label.substring(0, 10) + '...';
    }
    
    // 确定层级
    let level = 0;
    if (index === 0) {
      level = 0; // 中心节点
    } else if (index <= 5) {
      level = 1; // 一级节点
    } else {
      level = 2; // 二级节点
    }
    
    return {
      id: item.id,
      label,
      value: Math.max(20, Math.floor(item.heat / 1000)), // 确保最小值为 20
      category: item.platform,
      level,
    };
  });
  
  console.log('[TopicNetworkGenerator] Created nodes:', nodes.length);
  
  // 创建边（基于相似度）
  const edges: TopicEdge[] = [];
  
  for (let i = 0; i < selectedItems.length; i++) {
    for (let j = i + 1; j < selectedItems.length; j++) {
      const similarity = calculateSimilarity(
        selectedItems[i].title,
        selectedItems[j].title
      );
      
      if (similarity >= minSimilarity) {
        edges.push({
          source: selectedItems[i].id,
          target: selectedItems[j].id,
          weight: similarity,
        });
      }
    }
  }
  
  console.log('[TopicNetworkGenerator] Edges from similarity:', edges.length);
  
  // 如果边太少，添加一些基于排名的连接
  if (edges.length < selectedItems.length - 1) {
    // 确保中心节点至少连接到前5个节点
    for (let i = 1; i < Math.min(6, selectedItems.length); i++) {
      const existingEdge = edges.find(
        e => (e.source === centerItem.id && e.target === selectedItems[i].id) ||
             (e.target === centerItem.id && e.source === selectedItems[i].id)
      );
      
      if (!existingEdge) {
        edges.push({
          source: centerItem.id,
          target: selectedItems[i].id,
          weight: 0.5 - (i * 0.05), // 权重递减
        });
      }
    }
    
    // 一级节点连接到二级节点
    for (let i = 6; i < selectedItems.length; i++) {
      const parentIndex = Math.floor((i - 6) / 2) + 1;
      if (parentIndex < selectedItems.length) {
        const existingEdge = edges.find(
          e => (e.source === selectedItems[parentIndex].id && e.target === selectedItems[i].id) ||
               (e.target === selectedItems[parentIndex].id && e.source === selectedItems[i].id)
        );
        
        if (!existingEdge) {
          edges.push({
            source: selectedItems[parentIndex].id,
            target: selectedItems[i].id,
            weight: 0.3,
          });
        }
      }
    }
  }
  
  console.log('[TopicNetworkGenerator] Final edges:', edges.length);
  console.log('[TopicNetworkGenerator] Returning network with', nodes.length, 'nodes and', edges.length, 'edges');
  
  return {
    nodes,
    edges,
    centerNode: centerItem.id,
  };
}

/**
 * 更新话题网络（用于实时数据更新）
 */
export function updateTopicNetwork(
  currentNetwork: TopicNetwork,
  newItems: TrendingItem[]
): TopicNetwork {
  // 简单策略：重新生成
  return generateTopicNetworkFromTrending(newItems);
}
