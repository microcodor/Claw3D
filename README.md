# Claw3D - 网络安全学堂·AI实验室

<div align="center">

**智能数据分析与可视化平台**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19.0-blue.svg)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/next.js-16.0-black.svg)](https://nextjs.org/)

[English](README_EN.md) · 简体中文

</div>

---

## 📖 项目简介

Claw3D 是一个基于 Next.js 16 的现代化 Web 应用，专注于网络安全领域的数据分析、可视化和智能内容创作。项目采用 React 19、Three.js 和 Phaser 构建，提供沉浸式的 3D 办公环境和强大的数据分析能力。

### 核心特性

- 🎯 **三屏联动展示** - 支持单屏/多屏模式，适配大屏展示场景
- 📊 **实时数据分析** - 热搜舆情监控、情感分析、话题网络可视化
- 🤖 **AI 内容创作** - 自动化内容生成工作流，网络安全主题深度分析
- 🎨 **3D 可视化** - 基于 Three.js 的沉浸式办公环境
- 🔄 **实时更新** - WebSocket 连接，数据实时同步

---

## 🏗️ 系统架构

### 技术栈

**前端框架**
- Next.js 16 (App Router)
- React 19
- TypeScript 5.x

**3D 渲染**
- Three.js
- React Three Fiber
- Drei

**数据可视化**
- ECharts 5.x
- D3.js 7.x
- Recharts

**状态管理**
- Zustand
- Immer
- React Query

**动画**
- Framer Motion
- GSAP

**样式**
- CSS Modules
- Tailwind CSS (可选)

### 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器层                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  SCR-01      │  │  SCR-02      │  │  SCR-03      │     │
│  │  办公环境    │  │  舆情中心    │  │  创作工作室  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 服务层                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes  │  WebSocket Proxy  │  SSR/SSG         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw Gateway                          │
│  (可选，用于 Agent 管理和实时通信)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 功能模块

### SCR-01: 3D 办公环境

**功能描述**：沉浸式的 3D 虚拟办公室，支持 Agent 管理和实时交互。

**核心特性**：
- 🏢 3D 办公场景（基于 Three.js）
- 👥 Agent 管理和聊天
- 🎮 交互式导航和动画
- 📱 响应式设计

**技术实现**：
- React Three Fiber + Drei
- Phaser 游戏引擎
- WebSocket 实时通信

---

### SCR-02: 热搜舆情中心 V2

**功能描述**：实时监控网络热点，分析舆情趋势，可视化话题网络。

**核心组件**：

#### 1. 热门话题排行 (HotTopicsRanking)
- 📈 实时热度排名
- 🔥 热度指数可视化
- 📄 分页展示（5条/页）
- ⏱️ 自动滚动（10秒/页）

#### 2. 舆情监控 (PublicOpinionMonitor)
- 📰 多平台数据聚合（微博、知乎、今日头条）
- 🎨 平台标识和图标
- 🔄 自动滚动（15秒/条）
- 📊 热度趋势展示

#### 3. 情感分析 (SentimentAnalysis)
- 😊 正面/中性/负面情感分类
- 📊 饼图可视化（ECharts）
- 🎯 实时情感占比
- 🔄 30秒数据更新

#### 4. 话题网络 (TopicNetwork)
- 🕸️ 力导向图（D3.js）
- 🔗 话题关联关系
- 🎨 节点大小表示热度
- 🖱️ 交互式拖拽

#### 5. 数据概览 (DataOverview)
- 📊 关键指标展示
- 📈 趋势变化
- 🎯 数据统计
- 🔄 实时更新

#### 6. 趋势图表 (TrendChart)
- 📈 时间序列图（ECharts）
- 📊 多维度数据对比
- 🎨 渐变色填充
- 🔄 动态数据加载

**布局设计**：
```
┌─────────────┬─────────────┬─────────────┐
│ 热门话题    │ 舆情监控    │ 情感分析    │
│ 排行        │             │             │
├─────────────┼─────────────┼─────────────┤
│ 话题网络    │ 数据概览    │ 趋势图表    │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

**数据更新**：
- 更新间隔：30秒
- 数据来源：模拟数据（可接入真实API）
- 自动滚动：热门话题（10秒）、舆情监控（15秒）

---

### SCR-03: 创作工作室 V2

**功能描述**：自动化内容创作流程，专注网络安全主题的深度分析和文案生成。

**核心组件**：

#### 1. 创作队列 (TaskQueue)
- 📋 待执行任务列表
- 🔄 任务状态实时更新
- 🎯 优先级标识
- 📊 队列数量显示

#### 2. 实时生成区 (GenerationPanel)
- ⚙️ 思考阶段（8秒）
- ✍️ 内容生成（6秒，打字机效果）
- ✅ 完成动画（1秒）
- 📝 Markdown 渲染

#### 3. 创作历史 (HistoryPanel)
- 📚 已完成任务列表
- ⏱️ 完成时间显示
- 🔄 自动滚动
- 📊 最多显示50条

#### 4. 创作统计 (CreationStats)
- 📊 今日任务数
- 📝 总字数统计
- ⏱️ 总耗时
- 📈 完成率

#### 5. 灵感来源 (HotInspirations)
- 💡 热门话题推荐
- 🎯 一键创建任务
- 🔄 实时更新

**工作流程**：
```
创作队列 → 实时生成区 → 创作历史
   ↓           ↓            ↓
 5个任务    正在执行      已完成
   ↓           ↓            ↓
  等待      思考→生成     归档
```

**网络安全选题**（5个不重复）：

1. **勒索软件攻击激增，企业如何应对**
   - 威胁态势分析
   - 防御策略（事前/事中/事后）
   - 成本分析

2. **AI驱动的网络钓鱼攻击如何识别**
   - AI钓鱼新威胁
   - 识别技巧（技术/行为层面）
   - 防护措施

3. **零信任架构在企业中的落地实践**
   - 核心理念和组件
   - 实施路线图
   - 典型应用场景

4. **供应链攻击防御：从SolarWinds事件学到的教训**
   - 经典案例回顾
   - 防御策略
   - NIST框架

5. **内部威胁检测：如何防范来自内部的安全风险**
   - 内部威胁类型
   - 检测技术（UEBA、DLP、PAM、SIEM）
   - 防范措施

**执行特点**：
- ✅ 5个任务依次执行
- ✅ 执行完毕后停止（不循环）
- ✅ 数据不重复
- ✅ 页面刷新重置

**时间线**：
```
任务1: 0s - 17s   (15s执行 + 2s等待)
任务2: 17s - 34s
任务3: 34s - 51s
任务4: 51s - 68s
任务5: 68s - 85s
总计: 约85秒（1分25秒）
```

---

## 🚀 快速开始

### 环境要求

- **Node.js**: 20.0.0 或更高版本
- **npm**: 10.0.0 或更高版本
- **操作系统**: macOS / Linux / Windows

### 安装步骤

1. **克隆仓库**
```bash
git clone git@github.com:microcodor/Claw3D.git
cd Claw3D
```

2. **安装依赖**
```bash
npm install
```

3. **配置环境变量**
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
# 服务器配置
HOST=0.0.0.0          # 局域网访问设置为 0.0.0.0
PORT=3000             # 端口号

# OpenClaw Gateway（可选）
NEXT_PUBLIC_GATEWAY_URL=ws://localhost:18789
CLAW3D_GATEWAY_TOKEN=your_token_here
```

4. **启动开发服务器**
```bash
npm run dev
```

5. **访问应用**
```
http://localhost:3000/office
```

---

## 📦 部署指南

### 本地部署

**开发模式**：
```bash
npm run dev
```

**生产构建**：
```bash
npm run build
npm run start
```

### 服务器部署

#### 方式一：使用部署脚本

1. **配置部署脚本**
```bash
chmod +x server-deploy.sh
```

2. **编辑脚本配置**
```bash
# 修改 server-deploy.sh 中的服务器地址
SERVER_USER="your_username"
SERVER_HOST="192.168.0.132"
```

3. **执行部署**
```bash
./server-deploy.sh
```

#### 方式二：手动部署

1. **构建项目**
```bash
npm run build
```

2. **上传到服务器**
```bash
scp -r .next package.json package-lock.json user@server:/path/to/app
```

3. **服务器上安装依赖**
```bash
ssh user@server
cd /path/to/app
npm install --production
```

4. **使用 PM2 启动**
```bash
npm install -g pm2
pm2 start npm --name "claw3d" -- start
pm2 save
pm2 startup
```

#### 方式三：Docker 部署

```bash
# 构建镜像
docker build -t claw3d .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e HOST=0.0.0.0 \
  -e PORT=3000 \
  --name claw3d \
  claw3d
```

### 局域网访问配置

**修改 `.env` 文件**：
```env
HOST=0.0.0.0
PORT=3000
```

**访问地址**：
```
http://<服务器IP>:3000/office
```

例如：`http://192.168.0.132:3000/office`

---

## 🛠️ 开发指南

### 项目结构

```
Claw3D/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── office/            # 办公环境页面
│   │   └── api/               # API 路由
│   ├── features/              # 功能模块
│   │   ├── office/            # SCR-01: 办公环境
│   │   ├── trending-center-v2/# SCR-02: 舆情中心
│   │   └── creation-studio-v2/# SCR-03: 创作工作室
│   ├── components/            # 共享组件
│   ├── hooks/                 # 自定义 Hooks
│   ├── services/              # 服务层
│   ├── stores/                # 状态管理
│   ├── types/                 # TypeScript 类型
│   └── utils/                 # 工具函数
├── server/                    # 自定义服务器
│   └── index.js              # WebSocket 代理
├── public/                    # 静态资源
├── docs/                      # 文档
└── tests/                     # 测试文件
```

### 开发命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 生产构建
npm run start            # 启动生产服务器

# 代码质量
npm run lint             # ESLint 检查
npm run typecheck        # TypeScript 类型检查
npm run test             # 运行单元测试
npm run e2e              # 运行 E2E 测试

# 其他
npm run demo-gateway     # 启动演示网关
npm run hermes-adapter   # 启动 Hermes 适配器
```

### 代码规范

- **TypeScript**: 严格模式，完整类型定义
- **ESLint**: 遵循 Next.js 推荐配置
- **Prettier**: 统一代码格式
- **Git Commit**: 遵循 Conventional Commits

### 测试

**单元测试**（Vitest）：
```bash
npm run test
```

**E2E 测试**（Playwright）：
```bash
# 首次运行需要安装浏览器
npx playwright install

# 运行测试
npm run e2e
```

---

## 📝 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `HOST` | 服务器绑定地址 | `127.0.0.1` |
| `PORT` | 服务器端口 | `3000` |
| `NEXT_PUBLIC_GATEWAY_URL` | OpenClaw Gateway URL | - |
| `CLAW3D_GATEWAY_TOKEN` | Gateway 访问令牌 | - |
| `STUDIO_ACCESS_TOKEN` | Studio 访问令牌 | - |
| `UPSTREAM_ALLOWLIST` | 允许的上游主机列表 | - |

### OpenClaw 集成（可选）

Claw3D 可以独立运行，也可以连接到 OpenClaw Gateway 获取 Agent 管理功能。

**配置步骤**：

1. 安装并启动 OpenClaw
2. 获取 Gateway URL 和 Token
3. 在 Claw3D 中配置连接信息
4. 点击连接按钮

**注意**：
- OpenClaw 是可选的，不影响 SCR-02 和 SCR-03 的使用
- 如果不连接 OpenClaw，SCR-01 将显示连接配置界面

---

## 🎨 界面展示

### 三屏联动模式

```
┌─────────────────────────────────────────────────────────┐
│  SCR-01: 3D 办公环境                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🏢 虚拟办公室  👥 Agent 管理  💬 实时聊天    │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  SCR-02: 热搜舆情中心                                   │
│  ┌──────────┬──────────┬──────────┐                   │
│  │ 热门话题 │ 舆情监控 │ 情感分析 │                   │
│  ├──────────┼──────────┼──────────┤                   │
│  │ 话题网络 │ 数据概览 │ 趋势图表 │                   │
│  └──────────┴──────────┴──────────┘                   │
├─────────────────────────────────────────────────────────┤
│  SCR-03: 创作工作室                                     │
│  ┌──────────┬──────────┬──────────┐                   │
│  │ 创作队列 │ 实时生成 │ 创作统计 │                   │
│  │ 灵感来源 │          │ 创作历史 │                   │
│  └──────────┴──────────┴──────────┘                   │
└─────────────────────────────────────────────────────────┘
```

### 单屏模式

用户可以通过屏幕选择器切换到任意单个屏幕，适合专注于特定功能。

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循现有代码风格
- 添加必要的测试
- 更新相关文档
- 确保所有测试通过

---

## 📄 文档

- **[架构设计](ARCHITECTURE.md)** - 系统架构和设计决策
- **[开发指南](DEVELOPMENT_GUIDE.md)** - 详细的开发文档
- **[部署指南](DEPLOYMENT_GUIDE_CN.md)** - 部署配置说明
- **[API 文档](CODE_DOCUMENTATION.md)** - API 接口文档
- **[更新日志](CHANGELOG.md)** - 版本更新记录
- **[路线图](ROADMAP.md)** - 未来规划
- **[文档导航](文档导航.md)** - 完整文档索引

### 功能模块文档

- **[SCR-02 快速参考](SCR-02_QUICK_REFERENCE.md)** - 舆情中心使用指南
- **[SCR-03 快速参考](SCR-03_QUICK_REFERENCE.md)** - 创作工作室使用指南
- **[SCR-03 升级计划](SCR-03_UPGRADE_PLAN.md)** - V2 版本升级说明

---

## 🐛 故障排查

### 常见问题

**1. 端口被占用**
```bash
# 查看端口占用
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

**2. 依赖安装失败**
```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install
```

**3. 构建失败**
```bash
# 清除 Next.js 缓存
rm -rf .next

# 重新构建
npm run build
```

**4. 局域网无法访问**
- 检查 `.env` 中 `HOST=0.0.0.0`
- 检查防火墙设置
- 确认服务器和客户端在同一网络

**5. OpenClaw 连接失败**
- 确认 Gateway URL 正确
- 检查 Token 是否有效
- 查看浏览器控制台错误信息

---

## 📊 性能优化

### 已实施的优化

- ✅ React 19 并发特性
- ✅ Next.js 16 App Router
- ✅ 代码分割和懒加载
- ✅ 图片优化（Next/Image）
- ✅ CSS Modules 按需加载
- ✅ WebSocket 连接复用
- ✅ 数据缓存（React Query）

### 性能指标

- **首屏加载**: < 2s
- **交互响应**: < 100ms
- **数据更新**: 30s 间隔
- **内存占用**: < 200MB

---

## 🔒 安全性

### 安全措施

- ✅ HTTPS 支持
- ✅ Token 认证
- ✅ CORS 配置
- ✅ XSS 防护
- ✅ CSRF 防护
- ✅ 输入验证
- ✅ 依赖安全扫描

### 安全报告

如发现安全漏洞，请通过以下方式报告：
- 邮件：security@example.com
- 参考：[SECURITY.md](SECURITY.md)

---

## 📜 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 团队

**维护者**: microcodor

**贡献者**: 感谢所有为本项目做出贡献的开发者！

---

## 🔗 相关链接

- **GitHub**: https://github.com/microcodor/Claw3D
- **文档**: [文档导航](文档导航.md)
- **问题反馈**: [GitHub Issues](https://github.com/microcodor/Claw3D/issues)

---

## 📮 联系方式

- **Email**: your-email@example.com
- **Twitter**: [@your_twitter](https://twitter.com/your_twitter)
- **Discord**: [加入社区](https://discord.gg/your_invite)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！**

Made with ❤️ by microcodor

</div>
