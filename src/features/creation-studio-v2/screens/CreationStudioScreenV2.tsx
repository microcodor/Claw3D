'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import TaskQueue from '../components/TaskQueue/TaskQueue';
import GenerationPanel from '../components/GenerationPanel/GenerationPanel';
import HistoryPanel from '../components/HistoryPanel/HistoryPanel';
import CreationStats from '../components/CreationStats/CreationStats';
import HotInspirations from '../components/HotInspirations/HotInspirations';
import ErrorBoundary from '../components/common/ErrorBoundary/ErrorBoundary';
import type { CreationTask, CreationStats as StatsType } from '../types';
import { calculateStats } from '../services/statsCalculator';
import { ANIMATION_CONFIG } from '../utils/constants';
import styles from '../styles/creation-studio-v2.module.css';

// V2 Mock 数据（10个网络热点事件选题）
// 主题：网红事件、正能量事件、新奇特话题
const MOCK_MESSAGES = [
  {
    user: '某顶流网红直播带货翻车，虚假宣传被罚500万',
    assistant: `【选题背景】
某拥有3000万粉丝的头部网红在直播间宣传"纯天然无添加"护肤品，实际产品含有违禁成分，被市场监管部门罚款500万元，引发全网热议。

【口播文案】
各位老铁，今天要跟大家聊一个大瓜！你们知道吗，那个天天喊着"姐妹们相信我"的某顶流网红，这次真的翻车了！直播间卖的所谓"纯天然"护肤品，被查出含有违禁成分，直接被罚了500万！

这事儿告诉我们什么？网红带货水有多深！那些动不动就"我自己也在用""闭眼入"的话，你还敢信吗？评论区说说，你们被网红坑过吗？

【视频创作脚本】
[钩子 0-3秒]
画面：网红直播间截图+震惊表情包
文案：500万罚单！顶流网红带货翻车了！

[冲突 3-15秒]
画面：对比网红宣传话术 vs 产品检测报告
文案：她说"纯天然无添加"，结果呢？违禁成分超标！3000万粉丝被当韭菜割！

[反转 15-30秒]
画面：网友评论截图+受害者自述
文案：有姐妹用了之后脸都烂了，找客服？拉黑！退货？不可能！现在好了，市场监管出手，直接罚款500万！

[金句 30-45秒]
画面：博主出镜+字幕强调
文案：记住了！网红推荐≠产品靠谱！别再被"姐妹们相信我"洗脑了！你的钱包，要自己守护！

[互动 45-60秒]
画面：引导关注+评论区互动
文案：你们还遇到过哪些翻车的网红？评论区见！关注我，带你避坑不迷路！

#网红翻车 #直播带货 #消费者权益 #避坑指南`,
  },
  {
    user: '外卖小哥冒雨送餐摔倒，顾客暖心举动感动全网',
    assistant: `【选题背景】
暴雨天，外卖小哥为按时送达，在小区门口摔倒，餐食洒落一地。顾客不仅没有差评，还主动给小哥转了200元，并留言"辛苦了，注意安全"。视频在抖音获赞800万。

【口播文案】
家人们，今天看到一个视频真的破防了！暴雨天，外卖小哥为了准时送餐，在小区门口摔了一跤，饭菜洒了一地。他当时都快哭了，以为要被投诉、被罚款。

结果你猜怎么着？顾客下楼看到这一幕，不仅没生气，还主动给他转了200块，说"辛苦了，注意安全，饭我不要了"。小哥当场红了眼眶！

这才是人间真情啊！给这位顾客点赞！也给所有风雨无阻的外卖小哥点赞！

【视频创作脚本】
[钩子 0-3秒]
画面：外卖小哥摔倒瞬间（慢动作）
文案：暴雨中摔倒，他以为完了...结果万万没想到！

[情感铺垫 3-15秒]
画面：小哥蹲在地上收拾餐盒+雨水特写
文案：饭菜洒了一地，他急得快哭了。要被投诉、要被罚款、这单白送了...

[反转高潮 15-35秒]
画面：顾客撑伞下楼+转账截图+对话记录
文案：没想到！顾客不仅没生气，还转了200块！"辛苦了，注意安全，饭我不要了"。小哥当场红了眼眶！

[情感升华 35-50秒]
画面：网友评论+正能量画面剪辑
文案：这就是人间温暖！每个外卖小哥都不容易，风里来雨里去，只为多赚几块钱。遇到这样的顾客，真的太幸运了！

[互动呼吁 50-60秒]
画面：博主出镜+引导互动
文案：如果你也被感动了，请给外卖小哥多一份理解！点赞让更多人看到这份温暖！

#正能量 #外卖小哥 #人间真情 #暖心故事`,
  },
  {
    user: '95后女孩辞职回乡养猪，年入300万成为致富带头人',
    assistant: `【选题背景】
95后女孩从大厂辞职回农村养猪，被亲戚嘲笑"读书无用"。3年后，她用科学养殖方法年入300万，还带动全村20户农民致富，成为当地创业典范。

【口播文案】
兄弟们，今天必须给你们讲个励志故事！95后女孩，大厂年薪30万，结果辞职回农村养猪！当时全家人都觉得她疯了，亲戚更是冷嘲热讽："读了这么多年书，回来养猪？"

结果呢？3年后，年入300万！不仅自己发财了,还带动全村20户农民一起致富！现在那些当初嘲笑她的人，都来求着学技术！

这才叫真本事！谁说养猪就低人一等？行行出状元！

【视频创作脚本】
[钩子 0-3秒]
画面：女孩在猪圈工作+豪车钥匙特写
文案：大厂辞职回村养猪，3年后开上百万豪车！

[冲突设置 3-18秒]
画面：对比城市办公室 vs 农村猪圈
文案：年薪30万不要，回村养猪？全家人炸了！亲戚嘲讽："读书读傻了吧？"男朋友也因此分手...

[过程展示 18-35秒]
画面：科学养殖设备+数据监控+学习笔记
文案：但她不在乎！用大学学的知识搞科学养殖：智能温控、营养配比、疾病预防...别人养猪靠经验，她养猪靠数据！

[成果反转 35-50秒]
画面：收入流水+新房+带动村民
文案：3年后，年入300万！买房买车，还带动全村20户农民致富！当初嘲笑她的人，现在排队来学技术！

[金句收尾 50-60秒]
画面：女孩自信出镜+励志文案
文案：谁说养猪就低人一等？用知识改变命运，用实力打脸质疑！你的人生，你做主！点赞支持新农人！

#返乡创业 #新农人 #励志故事 #科学养殖`,
  },
  {
    user: '网红餐厅排队5小时，顾客吃完直呼"智商税"',
    assistant: `【选题背景】
某网红餐厅靠小红书营销爆火，每天排队5小时起步。实际体验后，顾客发现菜品普通、价格虚高，人均300元的套餐成本不到50元，引发大规模吐槽。

【口播文案】
家人们，今天要曝光一个网红餐厅的真相！小红书上全是好评，什么"人生必吃""排队5小时也值"。我今天真去排了5小时，结果呢？

一个字：坑！人均300的套餐，味道还不如楼下20块的快餐！关键是，我发现他们雇了一堆托儿在排队，制造火爆假象！评论区的好评？全是刷的！

这就是妥妥的智商税啊！姐妹们长点心吧！

【视频创作脚本】
[钩子 0-3秒]
画面：超长排队队伍+震惊表情
文案：排队5小时的网红店，竟然是这样的？

[期待铺垫 3-15秒]
画面：小红书好评截图+探店博主推荐
文案：小红书上全是5星好评！"人生必吃""排队再久也值"！我信了，排了整整5小时！

[反转打脸 15-35秒]
画面：实际菜品vs宣传图对比+价格标签
文案：结果上菜我傻眼了！宣传图 vs 实物，这是同一道菜？人均300，味道还不如外卖！更离谱的是，我发现排队的人里，好多都是托儿！

[揭秘真相 35-50秒]
画面：暗访拍摄+雇托证据+刷单记录
文案：真相来了！他们雇人排队制造火爆假象，小红书好评全是刷的，探店博主都是收钱推广！这就是网红餐厅的套路！

[避坑指南 50-60秒]
画面：博主出镜+避坑建议
文案：记住了！网红≠好吃！别再交智商税了！真正的好店，靠的是口碑，不是营销！点赞让更多人避坑！

#网红餐厅 #智商税 #避坑指南 #消费陷阱`,
  },
  {
    user: '00后小伙发明"懒人神器"，月销百万成为创业黑马',
    assistant: `【选题背景】
00后大学生发明一款"懒人晾衣架"，可自动升降、烘干、除菌。产品在抖音爆火，首月销售额破百万，获得多家投资机构青睐，成为年轻创业者典范。

【口播文案】
兄弟们，00后真的太卷了！有个小伙子在宿舍发明了一个"懒人晾衣架"，能自动升降、烘干、还能除菌！听起来很普通？

但人家把它做成爆款了！在抖音上一个月卖了100多万！现在好几家投资公司抢着要投资！这才叫真正的"躺赚"啊！

关键是，这个创意其实很简单，但就是没人想到！有时候赚钱就是这么简单！

【视频创作脚本】
[钩子 0-3秒]
画面：产品演示+销售数据跳动
文案：00后宿舍发明，一个月卖了100万！

[痛点切入 3-15秒]
画面：传统晾衣痛点场景（下雨收衣服、衣服发霉等）
文案：你有没有遇到过这些烦恼？下雨天衣服没收，全湿了！阴天晾不干，还有霉味！每次晾衣服都要爬高，太危险！

[产品展示 15-35秒]
画面：产品功能演示（自动升降、烘干、除菌、手机控制）
文案：这个00后小伙就想到了！做了一个智能晾衣架：手机一键控制，自动升降！内置烘干功能，2小时速干！还有紫外线除菌，比太阳晒还干净！

[成功案例 35-50秒]
画面：销售数据+用户好评+投资人采访
文案：产品一上线就爆了！抖音首月销售破百万！用户好评率99%！现在好几家投资公司抢着投资,估值已经上千万了！

[启发互动 50-60秒]
画面：博主出镜+创业建议
文案：看到了吗？创业不一定要高科技！解决生活中的小痛点，就是大商机！你有什么好点子？评论区聊聊！

#00后创业 #懒人神器 #创业黑马 #智能家居`,
  },
  {
    user: '网红主播连续直播48小时猝死，平台被质疑监管不力',
    assistant: `【选题背景】
某平台网红主播为冲榜连续直播48小时，期间多次出现身体不适仍坚持播出，最终猝死在直播间。事件引发对直播平台监管机制和主播健康保护的大讨论。

【口播文案】
家人们，今天要说一个让人心痛的事！某平台一个主播，为了冲榜连续直播48小时，中间多次说头晕、胸闷，但还是坚持播。结果，直播到第48小时的时候，人直接倒下了，再也没醒来...

这事儿太让人难受了！为了流量、为了礼物,真的要拼命吗？平台就不管吗？这背后到底是谁的责任？

【视频创作脚本】
[钩子 0-3秒]
画面：直播间截图+倒计时特效
文案：连播48小时，他倒在了直播间...

[事件回顾 3-20秒]
画面：主播直播片段+身体不适画面
文案：为了冲榜拿奖金，他连续直播48小时！期间多次说头晕、胸闷，粉丝劝他休息，他说"没事，再坚持一下"。第48小时，他突然倒下，再也没醒来...

[深度分析 20-40秒]
画面：平台规则+主播收入结构+医学专家解读
文案：为什么会这样？平台的榜单机制，让主播们疯狂内卷！播得越久、礼物越多，排名越高！但平台有监管吗？没有！主播健康预警？不存在的！

[责任追问 40-52秒]
画面：网友评论+专家观点+法律条文
文案：这是谁的责任？主播自己不爱惜身体？还是平台监管缺失？还是粉丝的推波助澜？这个问题,值得每个人深思！

[呼吁反思 52-60秒]
画面：博主出镜+严肃表情
文案：流量再重要,也没有生命重要！希望平台能完善监管,也希望主播们爱惜自己！点赞让更多人看到！

#主播猝死 #直播乱象 #平台监管 #生命可贵`,
  },
  {
    user: '退休教师免费辅导留守儿童10年，感动无数网友',
    assistant: `【选题背景】
67岁退休教师在乡村免费开办"留守儿童课堂"，10年来辅导超过500名孩子，其中30多人考上重点大学。老师自费购买教材，从不收一分钱，被称为"乡村守护者"。

【口播文案】
今天要给大家讲一个真正的"人民教师"！67岁的退休老师，本来可以在城里享清福，结果他回到农村，免费给留守儿童补课，一干就是10年！

500多个孩子被他辅导过，30多个考上了重点大学！关键是，他从来不收一分钱，教材都是自己掏钱买的！这才是真正的师者仁心啊！

【视频创作脚本】
[钩子 0-3秒]
画面：老教师和孩子们的合影+感人BGM
文案：67岁老人坚持10年，只为这群孩子...

[人物介绍 3-18秒]
画面：老师年轻时照片+退休证+乡村学校
文案：他叫张老师，教了一辈子书。退休后本可以在城里享福，但他选择回到农村，因为这里有一群留守儿童，没人管、没人教...

[感人事迹 18-38秒]
画面：上课场景+批改作业+家访画面
文案：10年来，他每天早上6点起床备课，晚上10点还在批改作业。教材自己买，午饭自己做，从不收一分钱！有孩子家里困难，他还自掏腰包买文具、买衣服...

[成果展示 38-50秒]
画面：学生录取通知书+感谢信+学生回访
文案：10年，500多个孩子，30多个考上重点大学！很多学生毕业后专程回来看他，说"没有张老师,就没有我的今天"！

[情感升华 50-60秒]
画面：老师和孩子们一起+网友评论
文案：这才是真正的人民教师！不为名、不为利，只为孩子们能有更好的未来！致敬！点赞让更多人看到这份大爱！

#退休教师 #留守儿童 #正能量 #师者仁心`,
  },
  {
    user: '网红打卡地实为危险禁区，已有3人因拍照坠亡',
    assistant: `【选题背景】
某"天空之境"网红打卡点实为废弃工地，地面湿滑且无护栏。为拍出"悬空"效果，已有3名游客坠落身亡。当地多次警告无效，网红仍在推广该地点。

【口播文案】
家人们，这个必须曝光！小红书上超火的"天空之境"打卡点，看起来仙气飘飘，实际上是个要命的地方！已经有3个人为了拍照掉下去没了！

更可怕的是，明明当地已经警告了，还有网红在推广这个地方！为了流量真的什么都不顾了吗？这些网红该负什么责任？

【视频创作脚本】
[钩子 0-3秒]
画面：唯美打卡照+突然切换事故现场
文案：小红书爆火打卡地，已有3人因此丧命！

[美好假象 3-15秒]
画面：网红打卡照片+小红书推荐
文案：看这些照片，仙气飘飘、美轮美奂！小红书上全是推荐："人生必去""出片率超高"！每天都有人慕名而来...

[残酷真相 15-35秒]
画面：实地探访+危险警示+事故报道
文案：但真相是什么？这是个废弃工地！地面湿滑、没有护栏、下面就是悬崖！为了拍出"悬空"效果，已经有3个人掉下去了！当地贴了警示牌、拉了警戒线，但还是有人翻进去！

[责任追问 35-50秒]
画面：网红推广视频+平台规则+法律专家
文案：更可怕的是，明知道危险，还有网红在推广！为了流量、为了广告费，完全不顾别人的安全！这些网红该不该负责？平台该不该管？

[警示呼吁 50-60秒]
画面：博主严肃出镜+安全提示
文案：记住了！再美的照片也不值得用命去换！别再盲目跟风打卡了！转发出去，救人一命！

#网红打卡 #安全警示 #盲目跟风 #生命可贵`,
  },
  {
    user: '大学生发明"防诈神器"，帮父母拦截诈骗电话获奖',
    assistant: `【选题背景】
大学生因父母差点被电信诈骗，发明一款AI防诈骗APP，能实时识别诈骗电话和短信。产品免费开放，已帮助10万老年人避免损失，获得全国大学生创新创业大赛金奖。

【口播文案】
兄弟们，这个大学生真的太牛了！他爸妈差点被诈骗，他一气之下做了个"防诈神器"APP，能自动识别诈骗电话和短信！

关键是，这个APP完全免费！已经帮10万老年人避免了被骗！还拿了全国大学生创新创业大赛金奖！这才是真正的科技向善啊！

【视频创作脚本】
[钩子 0-3秒]
画面：APP界面+拦截成功提示音
文案：大学生发明防诈神器，10万老人因此避免被骗！

[创作动机 3-18秒]
画面：诈骗电话场景+父母差点被骗经历
文案：事情是这样的：他父母接到"公检法"电话，差点把养老钱全转出去！幸好他及时发现！这件事让他意识到，太多老人在遭受电信诈骗！

[产品展示 18-38秒]
画面：APP功能演示（来电识别、短信拦截、诈骗话术库、一键报警）
文案：于是他花了半年时间，开发了这款APP！功能超强：来电自动识别诈骗号码、短信智能拦截、内置诈骗话术库、一键报警功能！最重要的是，完全免费！

[社会影响 38-50秒]
画面：用户感谢信+数据统计+获奖证书
文案：上线半年，已经有10万老人在用！成功拦截诈骗电话50万次，避免经济损失超过2亿元！还获得了全国大学生创新创业大赛金奖！

[价值升华 50-60秒]
画面：博主出镜+下载二维码
文案：这才是科技的正确打开方式！用技术保护我们的父母！赶紧转给家里老人！点赞让更多人看到！

#防诈骗 #科技向善 #大学生创业 #保护老人`,
  },
  {
    user: '网红为拍视频虐待动物，被全网封杀并立案调查',
    assistant: `【选题背景】
某宠物博主为制造"反差萌"效果，在视频中多次虐待猫狗（强迫进食、高空抛掷等）。网友举报后，平台封禁账号，警方以虐待动物罪立案调查，引发动物保护大讨论。

【口播文案】
家人们，今天必须曝光这个人渣！某宠物博主，表面上是"爱宠人士"，背地里各种虐待动物！为了拍视频，强迫猫吃辣椒、把狗从高处扔下去...

现在好了，被全网举报，账号全部封禁，警方已经立案调查！这种人就该受到法律制裁！

【视频创作脚本】
[钩子 0-3秒]
画面：博主账号被封截图+警方通报
文案：虐待动物拍视频，她终于被抓了！

[罪行曝光 3-20秒]
画面：虐待动物视频片段（打码处理）+网友举报
文案：这个博主，表面上是"宠物达人"，实际上呢？强迫猫吃辣椒、把狗从高处扔下去、用胶带捆绑动物...全是为了拍"搞笑视频"！动物痛苦的叫声，在她眼里就是流量！

[网友行动 20-38秒]
画面：网友评论+举报截图+平台回应
文案：网友们看不下去了！集体举报！提供证据！终于，平台封禁了她所有账号！警方也介入调查，以虐待动物罪立案！

[法律科普 38-50秒]
画面：法律条文+律师解读+案例对比
文案：很多人不知道，虐待动物是犯法的！根据最新法律，虐待动物情节严重的，可以判刑！这次就是一个典型案例！

[呼吁保护 50-60秒]
画面：可爱动物画面+保护动物宣传
文案：动物也是生命！不是你博取流量的工具！希望法律能严惩这种行为！点赞支持动物保护！

#虐待动物 #全网封杀 #动物保护 #法律制裁`,
  },
];

// 任务类型和优先级配置（固定顺序）
// 10个网络热点事件选题，包含视频脚本和口播文案
const TASK_CONFIGS = [
  { type: 'video' as const, priority: 5 as const },  // 1. 网红带货翻车
  { type: 'video' as const, priority: 4 as const },  // 2. 外卖小哥暖心故事
  { type: 'article' as const, priority: 4 as const },  // 3. 95后回乡养猪
  { type: 'video' as const, priority: 5 as const },  // 4. 网红餐厅智商税
  { type: 'video' as const, priority: 3 as const },  // 5. 00后发明懒人神器
  { type: 'video' as const, priority: 5 as const },  // 6. 主播猝死事件
  { type: 'article' as const, priority: 4 as const },  // 7. 退休教师辅导儿童
  { type: 'video' as const, priority: 5 as const },  // 8. 网红打卡地危险
  { type: 'video' as const, priority: 3 as const },  // 9. 大学生防诈神器
  { type: 'video' as const, priority: 5 as const },  // 10. 网红虐待动物
];

// 自动任务生成器（使用 V2 数据，固定顺序）
// 使用闭包来保持 messageIndex 的状态
const createTaskGenerator = () => {
  let messageIndex = 0;
  
  return (): CreationTask => {
    // 从 V2 Mock 数据中按顺序获取选题
    const index = messageIndex % MOCK_MESSAGES.length;
    const message = MOCK_MESSAGES[index];
    const config = TASK_CONFIGS[index];
    
    messageIndex++;
    
    return {
      id: `task-${Date.now()}-${Math.random()}`,
      title: message.user,
      type: config.type,
      status: 'pending',
      priority: config.priority,
      source: 'custom',
      createdAt: new Date(),
      prompt: message.user,
      // 存储对应的生成结果
      metadata: {
        mockOutput: message.assistant,
      },
    };
  };
};

const autoGenerateTask = createTaskGenerator();

// 生成 Mock 内容（使用 V1 数据）
function generateMockContent(task: CreationTask): string {
  // 如果任务有预设的 mock 输出，使用它
  if (task.metadata?.mockOutput) {
    return task.metadata.mockOutput;
  }
  
  // 否则使用默认模板
  return `# ${task.title}

这是一个自动生成的内容示例。

## 核心观点

基于当前热点和用户需求，我们提供以下分析和建议。

## 详细内容

内容正在生成中...`;
}

// 延迟函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// LocalStorage 键名
const STORAGE_KEYS = {
  TASKS: 'scr03_tasks',
  HISTORY: 'scr03_history',
  STATS: 'scr03_stats',
  INITIALIZED: 'scr03_initialized', // 标记是否已初始化
};

// 生成初始任务队列（10个选题全部显示）
function generateInitialTasks(): CreationTask[] {
  const tasks = Array.from({ length: 10 }, () => autoGenerateTask());
  console.log('[SCR-03 V2] Generated initial tasks:');
  tasks.forEach((task, index) => {
    console.log(`  ${index + 1}. ${task.title} (${task.type}, P${task.priority})`);
  });
  return tasks;
}

// 从 localStorage 加载数据（页面刷新时不加载历史）
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  // 页面刷新时清空历史记录
  if (key === STORAGE_KEYS.HISTORY) {
    localStorage.removeItem(key);
    return defaultValue;
  }
  
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    const parsed = JSON.parse(stored);
    // 转换日期字符串回 Date 对象
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
        startedAt: item.startedAt ? new Date(item.startedAt) : undefined,
        completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
      })) as T;
    }
    return parsed;
  } catch (error) {
    console.error(`[Storage] Failed to load ${key}:`, error);
    return defaultValue;
  }
}

// 保存到 localStorage
function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error);
  }
}

export default function CreationStudioScreenV2() {
  // 状态管理 - 页面刷新时重置
  const [tasks, setTasks] = useState<CreationTask[]>(() => {
    // 页面刷新时重置为初始队列
    const initialTasks = generateInitialTasks();
    return initialTasks;
  });
  const [currentTask, setCurrentTask] = useState<CreationTask | null>(null);
  const [history, setHistory] = useState<CreationTask[]>([]); // 页面刷新时清空历史
  const [isRunning, setIsRunning] = useState(true);
  const isExecutingRef = useRef(false);
  const [showingResult, setShowingResult] = useState(false); // 是否正在展示结果
  
  const [stats, setStats] = useState<StatsType>({
    today: {
      taskCount: 0,
      wordCount: 0,
      duration: 0,
      completionRate: 0,
    },
    typeDistribution: {
      article: 0,
      video: 0,
      social: 0,
      ad: 0,
    },
    speedTrend: [],
  });

  // 页面刷新时清空localStorage
  useEffect(() => {
    console.log('[SCR-03 V2] Page loaded, clearing history from localStorage');
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.STATS);
  }, []);

  // 自动执行任务
  const executeTask = useCallback(async (task: CreationTask) => {
    if (isExecutingRef.current) return;
    isExecutingRef.current = true;
    
    console.log('[SCR-03 V2] ========================================');
    console.log('[SCR-03 V2] Starting task execution:', task.title);
    console.log('[SCR-03 V2] Task type:', task.type, 'Priority:', task.priority);
    
    try {
      // 1. 设置为当前任务（思考阶段）
      setCurrentTask({
        ...task,
        status: 'processing',
        startedAt: new Date(),
      });

      // 2. 思考过程（16秒：4步 × 4秒，速度调慢一倍）
      console.log('[SCR-03 V2] Phase 1: Thinking (16s)...');
      await sleep(16000);

      // 3. 生成内容
      console.log('[SCR-03 V2] Phase 2: Generating content (12s)...');
      const content = generateMockContent(task);
      const wordCount = content.length;

      // 4. 流式输出（12秒 - 慢速打字机效果，速度调慢一倍）
      await sleep(12000);

      // 5. 完成动画（2秒，速度调慢一倍）
      console.log('[SCR-03 V2] Phase 3: Completion animation (2s)...');
      await sleep(2000);

      // 6. 完成任务
      const completedTask: CreationTask = {
        ...task,
        status: 'completed',
        completedAt: new Date(),
        output: content,
        metadata: {
          wordCount,
          duration: 30, // 总耗时30秒（16+12+2），速度调慢一倍
        },
      };

      console.log('[SCR-03 V2] Task completed, adding to history and removing from queue');
      
      // 7. 立即添加到历史记录（添加到顶部）
      setHistory(prev => {
        const newHistory = [completedTask, ...prev].slice(0, 50);
        console.log('[SCR-03 V2] History updated, count:', newHistory.length);
        return newHistory;
      });
      
      // 8. 从队列中移除该任务
      setTasks(prev => {
        const newQueue = prev.filter(t => t.id !== task.id);
        console.log('[SCR-03 V2] Task removed from queue, new length:', newQueue.length);
        return newQueue;
      });
      
      // 9. 清除当前任务
      console.log('[SCR-03 V2] Clearing current task');
      setCurrentTask(null);

      console.log('[SCR-03 V2] Task cycle completed');
      console.log('[SCR-03 V2] ========================================');

    } catch (error) {
      console.error('[SCR-03 V2] Task execution error:', error);
      setCurrentTask(null);
    } finally {
      // 10. 重置执行标志并等待间隔
      console.log('[SCR-03 V2] Finally: setting isExecutingRef.current = false');
      isExecutingRef.current = false;
      
      // 等待4秒后，useEffect 会自动触发下一个任务（速度调慢一倍）
      console.log('[SCR-03 V2] Waiting 4s before next task can start...');
      await sleep(4000);
      console.log('[SCR-03 V2] Ready for next task');
    }
  }, []); // 空依赖数组，因为我们使用 setState 的函数形式

  // 自动任务循环
  useEffect(() => {
    console.log('[SCR-03 V2] useEffect triggered - isRunning:', isRunning, 'isExecuting:', isExecutingRef.current, 'currentTask:', currentTask?.title, 'tasks.length:', tasks.length);
    
    if (!isRunning) {
      console.log('[SCR-03 V2] Not running, skipping');
      return;
    }
    if (isExecutingRef.current) {
      console.log('[SCR-03 V2] Already executing, skipping');
      return;
    }
    if (currentTask) {
      console.log('[SCR-03 V2] Current task exists, skipping');
      return;
    }

    // 检查队列
    if (tasks.length === 0) {
      console.log('[SCR-03 V2] Queue empty, all tasks completed. Waiting...');
      // 不再生成新任务，保持空闲状态
      return;
    }

    // 取出第一个任务执行（但不从队列移除）
    const nextTask = tasks[0];
    console.log('[SCR-03 V2] Starting task from queue:', nextTask.title, 'Queue length:', tasks.length);
    
    executeTask(nextTask);

  }, [tasks, currentTask, isRunning, executeTask]);

  // 自动补充队列（移除此功能，不再自动补充）
  // useEffect(() => {
  //   if (tasks.length < 5 && !isExecutingRef.current) {
  //     const needed = 5 - tasks.length;
  //     const newTasks = Array.from({ length: needed }, () => autoGenerateTask());
  //     setTasks(prev => [...prev, ...newTasks]);
  //     console.log(`[SCR-03 V2] Queue refilled: added ${needed} tasks`);
  //   }
  // }, [tasks.length]);

  // 定期更新统计数据
  useEffect(() => {
    // 立即更新一次
    const newStats = calculateStats(tasks, history, 'today');
    setStats(newStats);
    
    // 然后每5秒更新一次
    const interval = setInterval(() => {
      const newStats = calculateStats(tasks, history, 'today');
      setStats(newStats);
    }, 5000);

    return () => clearInterval(interval);
  }, [tasks, history]);

  // 手动创建任务（从灵感来源）
  const handleCreateTask = useCallback((task: CreationTask) => {
    console.log('[SCR-03 V2] Manual task created:', task.title);
    setTasks(prev => [...prev, task]);
  }, []);

  // 删除任务（保留接口，但不显示按钮）
  const handleDeleteTask = useCallback((taskId: string) => {
    console.log('[SCR-03 V2] Task deleted:', taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  // 重试任务（保留接口）
  const handleRetryTask = useCallback((task: CreationTask) => {
    console.log('[SCR-03 V2] Task retry:', task.title);
    const newTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random()}`,
      status: 'pending' as const,
      createdAt: new Date(),
      startedAt: undefined,
      completedAt: undefined,
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  // 完成任务（GenerationPanel 回调）
  const handleCompleteGeneration = useCallback((task: CreationTask) => {
    // 这个回调现在由自动流程处理，保留接口兼容性
    console.log('[SCR-03 V2] Generation completed callback:', task.title);
  }, []);

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        {/* 主要内容区域 */}
        <div className={styles.mainContent}>
          {/* 左列 */}
          <div className={styles.leftColumn}>
            <motion.div
              {...ANIMATION_CONFIG.slideIn}
              transition={{ ...ANIMATION_CONFIG.slideIn.transition, delay: 0.1 }}
              style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
            >
              <TaskQueue
                tasks={tasks}
                currentTask={currentTask}
                onStartTask={() => {}} // 自动执行，不需要手动触发
                onDeleteTask={handleDeleteTask}
                onRetryTask={handleRetryTask}
              />
            </motion.div>

            <motion.div
              {...ANIMATION_CONFIG.slideIn}
              transition={{ ...ANIMATION_CONFIG.slideIn.transition, delay: 0.2 }}
              style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
            >
              <HotInspirations onCreateTask={handleCreateTask} />
            </motion.div>
          </div>

          {/* 中列 */}
          <div className={styles.centerColumn}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{ flex: '1 1 0', display: 'flex', minHeight: 0 }}
            >
              <GenerationPanel
                currentTask={currentTask}
                onComplete={handleCompleteGeneration}
              />
            </motion.div>
          </div>

          {/* 右列 */}
          <div className={styles.rightColumn}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{ flexShrink: 0 }}
            >
              <CreationStats stats={stats} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ flex: 1, display: 'flex', minHeight: 0 }}
            >
              <HistoryPanel
                history={history}
                onRetryTask={handleRetryTask}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
