/**
 * SCR-03 创作工作室 V2 - 行业模板数据
 */

import type { IndustryTemplate } from '../types';

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  // 电商行业
  {
    id: 'ecommerce-product-intro',
    name: '产品介绍文案',
    industry: '电商',
    description: '突出产品特点和优势的介绍文案',
    prompt: '为电商产品撰写一篇详细的介绍文案，突出产品的核心卖点、使用场景和用户价值。',
    type: 'article',
  },
  {
    id: 'ecommerce-promotion',
    name: '促销活动方案',
    industry: '电商',
    description: '设计吸引人的促销活动',
    prompt: '策划一场电商促销活动，包括活动主题、优惠力度、推广渠道和预期效果。',
    type: 'article',
  },
  {
    id: 'ecommerce-live-script',
    name: '直播带货脚本',
    industry: '电商',
    description: '直播销售的完整脚本',
    prompt: '为电商直播带货创作一个完整的脚本，包括开场、产品介绍、互动环节和促单话术。',
    type: 'video',
  },
  
  // 餐饮行业
  {
    id: 'food-menu-intro',
    name: '菜品介绍文案',
    industry: '餐饮',
    description: '让人垂涎欲滴的菜品描述',
    prompt: '为餐厅菜品撰写诱人的介绍文案，描述食材、口感、特色和推荐理由。',
    type: 'article',
  },
  {
    id: 'food-store-promo',
    name: '门店推广文案',
    industry: '餐饮',
    description: '吸引顾客到店的宣传内容',
    prompt: '为餐饮门店创作推广文案，突出环境、特色菜品、优惠活动和地理位置。',
    type: 'social',
  },
  {
    id: 'food-brand-story',
    name: '品牌故事视频',
    industry: '餐饮',
    description: '讲述餐饮品牌的故事',
    prompt: '为餐饮品牌创作一个品牌故事视频脚本，展现创始理念、发展历程和品牌价值。',
    type: 'video',
  },
  
  // 教育行业
  {
    id: 'edu-course-intro',
    name: '课程介绍文案',
    industry: '教育',
    description: '详细的课程介绍和招生文案',
    prompt: '为教育课程撰写介绍文案，包括课程内容、师资力量、学习收获和报名信息。',
    type: 'article',
  },
  {
    id: 'edu-success-story',
    name: '学员成功案例',
    industry: '教育',
    description: '展示学员的学习成果',
    prompt: '撰写教育培训学员的成功案例，展现学习前后的变化和取得的成就。',
    type: 'article',
  },
  {
    id: 'edu-promo-video',
    name: '招生宣传视频',
    industry: '教育',
    description: '吸引学员报名的视频',
    prompt: '为教育机构创作招生宣传视频脚本，展示教学环境、师资团队和学习氛围。',
    type: 'video',
  },
  
  // 科技行业
  {
    id: 'tech-product-launch',
    name: '产品发布文案',
    industry: '科技',
    description: '新产品发布的宣传内容',
    prompt: '为科技产品发布撰写宣传文案，突出技术创新、功能特点和市场价值。',
    type: 'article',
  },
  {
    id: 'tech-tutorial',
    name: '产品使用教程',
    industry: '科技',
    description: '详细的产品使用指南',
    prompt: '创作科技产品的使用教程，包括功能介绍、操作步骤和常见问题解答。',
    type: 'article',
  },
  {
    id: 'tech-demo-video',
    name: '产品演示视频',
    industry: '科技',
    description: '展示产品功能的视频',
    prompt: '为科技产品创作演示视频脚本，展示核心功能、使用场景和用户价值。',
    type: 'video',
  },
  
  // 美妆行业
  {
    id: 'beauty-product-review',
    name: '产品测评文案',
    industry: '美妆',
    description: '专业的美妆产品测评',
    prompt: '撰写美妆产品测评文案，包括成分分析、使用体验、效果展示和购买建议。',
    type: 'article',
  },
  {
    id: 'beauty-tutorial',
    name: '美妆教程文案',
    industry: '美妆',
    description: '详细的化妆教程',
    prompt: '创作美妆教程内容，包括妆容风格、产品选择、步骤讲解和技巧分享。',
    type: 'article',
  },
  {
    id: 'beauty-video-tutorial',
    name: '美妆视频教程',
    industry: '美妆',
    description: '视频形式的化妆教程',
    prompt: '为美妆教程创作视频脚本，展示化妆步骤、产品使用和效果对比。',
    type: 'video',
  },
  
  // 旅游行业
  {
    id: 'travel-guide',
    name: '旅游攻略文案',
    industry: '旅游',
    description: '详细的旅游目的地攻略',
    prompt: '撰写旅游目的地攻略，包括景点介绍、交通住宿、美食推荐和注意事项。',
    type: 'article',
  },
  {
    id: 'travel-vlog-script',
    name: '旅行Vlog脚本',
    industry: '旅游',
    description: '旅行视频的拍摄脚本',
    prompt: '为旅行Vlog创作脚本，包括行程安排、拍摄场景、解说词和剪辑思路。',
    type: 'video',
  },
  {
    id: 'travel-promotion',
    name: '旅游产品推广',
    industry: '旅游',
    description: '旅游线路或产品的推广文案',
    prompt: '为旅游产品创作推广文案，突出行程亮点、服务特色和性价比优势。',
    type: 'social',
  },
];

// 按行业分组
export function getTemplatesByIndustry(industry: string): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES.filter(t => t.industry === industry);
}

// 获取所有行业
export function getAllIndustries(): string[] {
  const industries = new Set(INDUSTRY_TEMPLATES.map(t => t.industry));
  return Array.from(industries);
}

// 按类型筛选
export function getTemplatesByType(type: string): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES.filter(t => t.type === type);
}

// 随机获取模板
export function getRandomTemplates(count: number = 6): IndustryTemplate[] {
  const shuffled = [...INDUSTRY_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
