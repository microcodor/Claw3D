# Claw3D 开发指南

## 版本管理

### 当前版本
- **基线版本**: v1.0.0-baseline
- **开发分支**: feature/scr02-sentiment-analysis-center
- **主分支**: main

### 分支策略
```
main (生产分支)
  ├── v1.0.0-baseline (标签)
  └── feature/scr02-sentiment-analysis-center (开发分支)
```

---

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/microcodor/Claw3D.git
cd Claw3D
```

### 2. 切换到开发分支
```bash
git checkout feature/scr02-sentiment-analysis-center
```

### 3. 安装依赖
```bash
npm install
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问: http://localhost:3000

---

## 开发流程

### 1. 创建新功能
```bash
# 从开发分支创建功能分支
git checkout -b feature/your-feature-name

# 开发...

# 提交
git add .
git commit -m "feat: 你的功能描述"

# 推送
git push origin feature/your-feature-name
```

### 2. 提交规范
使用 Conventional Commits 规范:

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

示例:
```bash
git commit -m "feat(scr02): 添加全平台对比面板"
git commit -m "fix(scr02): 修复热力图数据更新问题"
git commit -m "docs: 更新SCR-02开发文档"
```

### 3. 合并流程
```bash
# 更新开发分支
git checkout feature/scr02-sentiment-analysis-center
git pull origin feature/scr02-sentiment-analysis-center

# 合并你的功能分支
git merge feature/your-feature-name

# 解决冲突（如果有）

# 推送
git push origin feature/scr02-sentiment-analysis-center
```

---

## 项目结构

```
Claw3D/
├── src/
│   ├── app/                          # Next.js 应用路由
│   ├── features/                     # 功能模块
│   │   ├── trending-center/          # SCR-02 当前版本
│   │   ├── trending-center-v2/       # SCR-02 升级版本 (新建)
│   │   ├── creation-studio/          # SCR-03
│   │   ├── office/                   # SCR-01
│   │   └── ...
│   ├── lib/                          # 工具库
│   ├── components/                   # 共享组件
│   └── styles/                       # 全局样式
├── public/                           # 静态资源
├── server/                           # 自定义服务器
├── docs/                             # 文档
└── scripts/                          # 脚本
```

---

## SCR-02 开发指南

### 文件组织
```
src/features/trending-center-v2/
├── screens/
│   └── TrendingCenterScreenV2.tsx    # 主屏幕
├── components/
│   ├── PlatformComparison/           # 组件文件夹
│   │   ├── PlatformComparisonPanel.tsx
│   │   ├── PlatformBar.tsx
│   │   └── platform-comparison.module.css
│   ├── HeatMap/
│   ├── SentimentAnalysis/
│   ├── TopicNetwork/
│   ├── AudienceProfile/
│   └── AlertSystem/
├── hooks/                            # 自定义Hooks
├── services/                         # API和业务逻辑
├── types/                            # TypeScript类型
├── utils/                            # 工具函数
└── styles/                           # 样式文件
```

### 命名规范

#### 组件
- 使用 PascalCase
- 文件名与组件名一致
- 示例: `PlatformComparisonPanel.tsx`

#### Hooks
- 使用 camelCase
- 以 `use` 开头
- 示例: `useTrendingData.ts`

#### 类型
- 使用 PascalCase
- 接口以 `I` 开头（可选）
- 示例: `TrendingData`, `IPlatformStats`

#### 样式
- 使用 kebab-case
- CSS Modules: `*.module.css`
- 示例: `platform-comparison.module.css`

### 代码风格

#### TypeScript
```typescript
// ✅ 好的实践
interface Props {
  data: TrendingData[];
  onItemClick: (item: TrendingItem) => void;
}

export function MyComponent({ data, onItemClick }: Props) {
  // 使用 const 和箭头函数
  const handleClick = useCallback((item: TrendingItem) => {
    onItemClick(item);
  }, [onItemClick]);
  
  // 使用 useMemo 缓存计算
  const processedData = useMemo(() => {
    return data.map(item => transformItem(item));
  }, [data]);
  
  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => handleClick(item)}>
          {item.title}
        </div>
      ))}
    </div>
  );
}

// ❌ 避免的实践
function MyComponent(props: any) {  // 不要使用 any
  const data = props.data;          // 不要解构 props
  
  function handleClick(item) {      // 不要使用 function 声明
    props.onItemClick(item);
  }
  
  // 不要在渲染中进行复杂计算
  return (
    <div>
      {data.map(item => transformItem(item)).map(item => (
        <div onClick={() => handleClick(item)}>
          {item.title}
        </div>
      ))}
    </div>
  );
}
```

#### CSS Modules
```css
/* ✅ 好的实践 */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: clamp(14px, 1.2vw, 18px);
  color: rgba(255, 255, 255, 0.9);
}

/* 使用 CSS 变量 */
.card {
  background: var(--card-bg, rgba(14, 10, 4, 0.7));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
}

/* ❌ 避免的实践 */
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;  /* 使用 rem 而不是 px */
}

.title {
  font-size: 18px;  /* 使用 clamp 实现响应式 */
  color: #fff;      /* 使用 rgba 以便调整透明度 */
}
```

---

## 开发工具

### VS Code 扩展推荐
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- GitLens

### 调试

#### 浏览器调试
```typescript
// 使用 console.log 调试
console.log('[SCR-02] Data loaded:', data);

// 使用 debugger
function processData(data: any[]) {
  debugger;  // 浏览器会在这里暂停
  return data.map(item => transform(item));
}
```

#### React DevTools
1. 安装 React DevTools 浏览器扩展
2. 打开开发者工具
3. 切换到 "Components" 或 "Profiler" 标签

#### 性能分析
```typescript
// 使用 Performance API
const start = performance.now();
// ... 你的代码
const end = performance.now();
console.log(`执行时间: ${end - start}ms`);

// 使用 React Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
) {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
}

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

---

## 测试

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行特定文件
npm run test -- path/to/test.test.ts

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

### 编写测试
```typescript
// MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent data={[]} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
  
  it('handles click', () => {
    const handleClick = jest.fn();
    render(<MyComponent data={[]} onItemClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Item 1'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

## 构建和部署

### 本地构建
```bash
# 开发构建
npm run build

# 生产构建
npm run build:prod

# 类型检查
npm run typecheck

# Lint检查
npm run lint

# 格式化代码
npm run format
```

### 部署到服务器
```bash
# 使用部署脚本
./server-deploy.sh

# 或手动部署
npm run build
pm2 start ecosystem.config.js
```

---

## 常见问题

### Q: 如何添加新的依赖？
```bash
# 安装生产依赖
npm install package-name

# 安装开发依赖
npm install -D package-name

# 提交 package.json 和 package-lock.json
git add package.json package-lock.json
git commit -m "chore: 添加 package-name 依赖"
```

### Q: 如何解决 TypeScript 错误？
1. 检查类型定义是否正确
2. 确保导入路径正确
3. 运行 `npm run typecheck` 查看详细错误
4. 查看 `tsconfig.json` 配置

### Q: 如何优化性能？
1. 使用 React DevTools Profiler 分析
2. 使用 `React.memo` 避免不必要的重渲染
3. 使用 `useMemo` 和 `useCallback` 缓存
4. 使用虚拟滚动处理大列表
5. 代码分割和懒加载

### Q: 如何处理样式冲突？
1. 使用 CSS Modules
2. 使用唯一的类名前缀
3. 避免使用全局样式
4. 使用 CSS-in-JS（如果需要）

---

## 资源链接

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [ECharts 文档](https://echarts.apache.org/)
- [D3.js 文档](https://d3js.org/)

### 项目文档
- [SCR-02 升级计划](./SCR02_UPGRADE_PLAN.md)
- [三屏架构说明](./QUICK_START_三屏架构.md)
- [部署指南](./SERVER_DEPLOY_README.md)
- [故障排查](./TROUBLESHOOTING.md)

### 社区资源
- [GitHub Issues](https://github.com/microcodor/Claw3D/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/nextjs)

---

## 贡献指南

### 提交 Pull Request
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到你的 Fork
5. 创建 Pull Request

### PR 检查清单
- [ ] 代码通过 TypeScript 检查
- [ ] 代码通过 ESLint 检查
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 提交信息符合规范

---

## 联系方式
- 项目仓库: https://github.com/microcodor/Claw3D
- 问题反馈: [GitHub Issues](https://github.com/microcodor/Claw3D/issues)

---

**最后更新**: 2026-04-17
**文档版本**: 1.0
