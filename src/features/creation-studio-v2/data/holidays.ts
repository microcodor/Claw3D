/**
 * SCR-03 创作工作室 V2 - 节日数据
 */

import type { Holiday } from '../types';

export const HOLIDAYS: Holiday[] = [
  {
    id: 'spring-festival',
    name: '春节',
    date: '2026-01-29',
    description: '中国最重要的传统节日，象征团圆和新年',
    keywords: ['团圆', '红包', '年夜饭', '拜年', '春运', '新年'],
    templates: [
      '春节营销策略',
      '新年祝福文案',
      '年货促销方案',
      '春节活动策划',
    ],
  },
  {
    id: 'lantern-festival',
    name: '元宵节',
    date: '2026-02-12',
    description: '春节后的第一个重要节日，赏灯猜谜',
    keywords: ['元宵', '灯笼', '猜灯谜', '团圆', '汤圆'],
    templates: [
      '元宵节活动方案',
      '灯谜互动文案',
      '元宵促销策略',
    ],
  },
  {
    id: 'womens-day',
    name: '妇女节',
    date: '2026-03-08',
    description: '国际妇女节，关注女性权益',
    keywords: ['女性', '独立', '美丽', '关爱', '女神'],
    templates: [
      '女神节营销方案',
      '女性关怀文案',
      '美妆促销策略',
      '女性话题内容',
    ],
  },
  {
    id: 'qingming',
    name: '清明节',
    date: '2026-04-04',
    description: '传统祭祖节日，踏青时节',
    keywords: ['祭祖', '踏青', '缅怀', '春游', '传统'],
    templates: [
      '清明踏青攻略',
      '传统文化内容',
      '春游推荐文案',
    ],
  },
  {
    id: 'labor-day',
    name: '劳动节',
    date: '2026-05-01',
    description: '国际劳动节，五一黄金周',
    keywords: ['劳动', '假期', '旅游', '休闲', '出行'],
    templates: [
      '五一出行攻略',
      '假期促销方案',
      '旅游推荐内容',
      '劳动者致敬文案',
    ],
  },
  {
    id: 'youth-day',
    name: '青年节',
    date: '2026-05-04',
    description: '五四青年节，青春活力',
    keywords: ['青春', '活力', '梦想', '奋斗', '年轻'],
    templates: [
      '青年励志内容',
      '青春主题文案',
      '年轻人营销策略',
    ],
  },
  {
    id: 'childrens-day',
    name: '儿童节',
    date: '2026-06-01',
    description: '国际儿童节，关爱儿童',
    keywords: ['童年', '快乐', '成长', '亲子', '玩具'],
    templates: [
      '儿童节活动方案',
      '亲子互动文案',
      '玩具促销策略',
      '童年回忆内容',
    ],
  },
  {
    id: 'dragon-boat',
    name: '端午节',
    date: '2026-06-19',
    description: '传统节日，吃粽子赛龙舟',
    keywords: ['粽子', '龙舟', '屈原', '传统', '习俗'],
    templates: [
      '端午节营销方案',
      '粽子促销文案',
      '传统文化内容',
      '端午活动策划',
    ],
  },
  {
    id: 'mid-autumn',
    name: '中秋节',
    date: '2026-10-06',
    description: '传统团圆节日，赏月吃月饼',
    keywords: ['月饼', '团圆', '赏月', '思乡', '中秋'],
    templates: [
      '中秋营销策略',
      '月饼促销方案',
      '团圆主题文案',
      '中秋活动策划',
    ],
  },
  {
    id: 'national-day',
    name: '国庆节',
    date: '2026-10-01',
    description: '国庆黄金周，爱国主题',
    keywords: ['国庆', '爱国', '假期', '旅游', '祖国'],
    templates: [
      '国庆出行攻略',
      '爱国主题内容',
      '假期促销方案',
      '国庆活动策划',
    ],
  },
  {
    id: 'double-eleven',
    name: '双十一',
    date: '2026-11-11',
    description: '全球购物狂欢节',
    keywords: ['购物', '促销', '优惠', '狂欢', '电商'],
    templates: [
      '双十一营销策略',
      '促销活动方案',
      '购物攻略内容',
      '电商文案创作',
    ],
  },
  {
    id: 'double-twelve',
    name: '双十二',
    date: '2026-12-12',
    description: '年终购物节',
    keywords: ['购物', '年终', '促销', '优惠', '清仓'],
    templates: [
      '双十二促销方案',
      '年终清仓文案',
      '购物推荐内容',
    ],
  },
  {
    id: 'christmas',
    name: '圣诞节',
    date: '2026-12-25',
    description: '西方传统节日，浪漫温馨',
    keywords: ['圣诞', '礼物', '浪漫', '温馨', '节日'],
    templates: [
      '圣诞营销方案',
      '节日祝福文案',
      '礼物推荐内容',
      '圣诞活动策划',
    ],
  },
  {
    id: 'new-year',
    name: '元旦',
    date: '2027-01-01',
    description: '新年第一天，新的开始',
    keywords: ['新年', '新开始', '目标', '计划', '希望'],
    templates: [
      '新年营销策略',
      '新年祝福文案',
      '年度总结内容',
      '新年计划文案',
    ],
  },
];

// 获取即将到来的节日
export function getUpcomingHolidays(count: number = 6): Holiday[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  // 将所有节日转换为今年的日期
  const holidaysWithDates = HOLIDAYS.map(holiday => {
    const [year, month, day] = holiday.date.split('-').map(Number);
    const holidayDate = new Date(currentYear, month - 1, day);
    
    // 如果日期已过，使用明年的日期
    if (holidayDate < now) {
      holidayDate.setFullYear(currentYear + 1);
    }
    
    return {
      ...holiday,
      actualDate: holidayDate,
      daysUntil: Math.ceil((holidayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    };
  });
  
  // 按日期排序，取最近的几个
  return holidaysWithDates
    .sort((a, b) => a.actualDate.getTime() - b.actualDate.getTime())
    .slice(0, count);
}

// 获取当前月份的节日
export function getCurrentMonthHolidays(): Holiday[] {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  
  return HOLIDAYS.filter(holiday => {
    const [, month] = holiday.date.split('-').map(Number);
    return month === currentMonth;
  });
}
