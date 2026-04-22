# TASK_CONFIGS 更新说明

## 更新内容

将任务配置从"全部文章类型"更新为"视频+文章混合类型"，更符合短视频创作场景。

## 更新前后对比

### 之前（V1）
```typescript
const TASK_CONFIGS = [
  { type: 'article' as const, priority: 5 as const },  // 全部为文章
  { type: 'article' as const, priority: 5 as const },
  // ... 10个全部为 article
];
```

### 现在（V2）
```typescript
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
```

## 任务类型分布

### Video（8个）
适合短视频创作，有完整的视频脚本：
1. 网红带货翻车（优先级5）
2. 外卖小哥暖心故事（优先级4）
4. 网红餐厅智商税（优先级5）
5. 00后发明懒人神器（优先级3）
6. 主播猝死事件（优先级5）
8. 网红打卡地危险（优先级5）
9. 大学生防诈神器（优先级3）
10. 网红虐待动物（优先级5）

### Article（2个）
适合图文创作，深度内容：
3. 95后回乡养猪（优先级4）
7. 退休教师辅导儿童（优先级4）

## 优先级分布

- **优先级5（高）**：5个任务 - 社会影响大、话题性强
- **优先级4（中）**：3个任务 - 正能量、励志故事
- **优先级3（低）**：2个任务 - 创新创业、科技向善

## 设计理念

### 1. 类型匹配
- 有完整视频脚本的选题 → video
- 适合深度解读的选题 → article

### 2. 优先级设定
- **高优先级（5）**：负面事件、安全警示、社会热点
- **中优先级（4）**：正能量、励志故事
- **低优先级（3）**：创新创业、科技应用

### 3. 内容平衡
- 负面事件：50%（5个）- 引发关注和讨论
- 正能量：30%（3个）- 传递温暖和希望
- 新奇特：20%（2个）- 激发好奇和兴趣

## 使用场景

### Video 类型任务
- 生成60秒短视频脚本
- 包含钩子、冲突、反转、金句、互动
- 适用于抖音、快手、视频号

### Article 类型任务
- 生成深度图文内容
- 包含背景、过程、成果、启示
- 适用于公众号、知乎、小红书

## 技术实现

```typescript
// 任务生成时会根据 type 和 priority 创建任务
const task: CreationTask = {
  id: `task-${Date.now()}-${Math.random()}`,
  title: message.user,
  type: config.type,        // 'video' 或 'article'
  priority: config.priority, // 3, 4, 或 5
  status: 'pending',
  createdAt: new Date(),
};
```

## 验证结果

✅ 构建成功
✅ 类型检查通过
✅ 任务生成正常
✅ UI显示正确

## 相关文件

- 主文件：`src/features/creation-studio-v2/screens/CreationStudioScreenV2.tsx`
- 详细说明：`SCR-03_创作队列内容更新说明.md`
- 总结文档：`创作队列更新总结.md`

---

**更新时间**：2026-04-22  
**更新人员**：Kiro AI Assistant  
**状态**：✅ 已完成
