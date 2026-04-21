# PM2 部署指南

## 📋 目录

- [环境要求](#环境要求)
- [快速部署](#快速部署)
- [详细步骤](#详细步骤)
- [PM2 配置说明](#pm2-配置说明)
- [常用命令](#常用命令)
- [监控和日志](#监控和日志)
- [故障排查](#故障排查)
- [性能优化](#性能优化)

---

## 环境要求

### 服务器环境
- **操作系统**: Linux / macOS / Windows
- **Node.js**: 20.0.0 或更高版本
- **npm**: 10.0.0 或更高版本
- **PM2**: 5.0.0 或更高版本
- **内存**: 至少 1GB 可用内存
- **磁盘**: 至少 2GB 可用空间

### 安装 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 验证安装
pm2 --version
```

---

## 快速部署

### 方式一：使用现有配置文件

```bash
# 1. 克隆项目
git clone git@github.com:microcodor/Claw3D.git
cd Claw3D

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 4. 构建项目
npm run build

# 5. 使用 PM2 启动
pm2 start ecosystem.config.js

# 6. 保存 PM2 配置
pm2 save

# 7. 设置开机自启
pm2 startup
```

### 方式二：直接启动

```bash
# 构建后直接启动
npm run build
pm2 start npm --name "claw3d" -- start

# 保存配置
pm2 save
```

---

## 详细步骤

### 1. 准备项目

```bash
# 克隆项目
git clone git@github.com:microcodor/Claw3D.git
cd Claw3D

# 切换到指定分支（如果需要）
git checkout feature/scr02-sentiment-analysis-center

# 安装依赖
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 服务器配置
HOST=0.0.0.0
PORT=3000

# OpenClaw Gateway（可选）
NEXT_PUBLIC_GATEWAY_URL=ws://localhost:18789
CLAW3D_GATEWAY_TOKEN=your_token_here

# 生产环境
NODE_ENV=production
```

### 3. 构建项目

```bash
# 生产构建
npm run build

# 验证构建
ls -la .next
```

### 4. 配置 PM2

编辑 `ecosystem.config.js`（如果需要自定义）：

```javascript
module.exports = {
  apps: [
    {
      name: 'claw3d',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/your/claw3d',  // 修改为实际路径
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

### 5. 创建日志目录

```bash
mkdir -p logs
```

### 6. 启动应用

```bash
# 使用配置文件启动
pm2 start ecosystem.config.js

# 或者直接启动
pm2 start npm --name "claw3d" -- start
```

### 7. 保存配置

```bash
# 保存当前 PM2 进程列表
pm2 save

# 设置开机自启
pm2 startup

# 按照提示执行命令（通常需要 sudo）
# 例如：sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username
```

---

## PM2 配置说明

### 配置项详解

```javascript
{
  name: 'claw3d',              // 应用名称
  script: 'npm',               // 执行脚本
  args: 'start',               // 脚本参数
  cwd: '/path/to/claw3d',      // 工作目录
  instances: 1,                // 实例数量（1 = 单实例，'max' = CPU核心数）
  autorestart: true,           // 自动重启
  watch: false,                // 文件监听（生产环境建议关闭）
  max_memory_restart: '1G',    // 内存超过1GB自动重启
  
  env: {
    NODE_ENV: 'production',    // 环境变量
    PORT: 3000,
    HOST: '0.0.0.0',
  },
  
  error_file: './logs/err.log',      // 错误日志
  out_file: './logs/out.log',        // 输出日志
  log_file: './logs/combined.log',   // 合并日志
  time: true,                         // 日志时间戳
  merge_logs: true,                   // 合并日志
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
}
```

### 多实例配置（集群模式）

```javascript
module.exports = {
  apps: [
    {
      name: 'claw3d',
      script: 'npm',
      args: 'start',
      instances: 'max',        // 使用所有CPU核心
      exec_mode: 'cluster',    // 集群模式
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
      },
    },
  ],
};
```

---

## 常用命令

### 启动和停止

```bash
# 启动应用
pm2 start ecosystem.config.js
pm2 start npm --name "claw3d" -- start

# 停止应用
pm2 stop claw3d

# 重启应用
pm2 restart claw3d

# 重载应用（0秒停机）
pm2 reload claw3d

# 删除应用
pm2 delete claw3d

# 停止所有应用
pm2 stop all

# 重启所有应用
pm2 restart all
```

### 查看状态

```bash
# 查看所有应用状态
pm2 list
pm2 ls

# 查看详细信息
pm2 show claw3d

# 查看实时监控
pm2 monit

# 查看日志
pm2 logs claw3d

# 查看错误日志
pm2 logs claw3d --err

# 查看输出日志
pm2 logs claw3d --out

# 清空日志
pm2 flush
```

### 配置管理

```bash
# 保存当前配置
pm2 save

# 恢复保存的配置
pm2 resurrect

# 设置开机自启
pm2 startup

# 取消开机自启
pm2 unstartup
```

### 更新应用

```bash
# 拉取最新代码
git pull origin feature/scr02-sentiment-analysis-center

# 安装依赖
npm install

# 重新构建
npm run build

# 重启应用
pm2 restart claw3d

# 或者使用 reload（0秒停机）
pm2 reload claw3d
```

---

## 监控和日志

### 实时监控

```bash
# 打开监控面板
pm2 monit

# 查看 CPU 和内存使用
pm2 list
```

### 日志管理

```bash
# 实时查看日志
pm2 logs claw3d

# 查看最近100行日志
pm2 logs claw3d --lines 100

# 只看错误日志
pm2 logs claw3d --err

# 只看输出日志
pm2 logs claw3d --out

# 清空日志
pm2 flush claw3d
```

### 日志文件位置

根据 `ecosystem.config.js` 配置：

```
logs/
├── err.log          # 错误日志
├── out.log          # 输出日志
└── combined.log     # 合并日志
```

### 日志轮转

安装 PM2 日志轮转模块：

```bash
pm2 install pm2-logrotate

# 配置日志轮转
pm2 set pm2-logrotate:max_size 10M        # 单个日志文件最大10MB
pm2 set pm2-logrotate:retain 30           # 保留30个日志文件
pm2 set pm2-logrotate:compress true       # 压缩旧日志
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
```

---

## 故障排查

### 应用无法启动

**检查端口占用**：
```bash
# 查看端口占用
lsof -i :3000
netstat -tuln | grep 3000

# 杀死占用进程
kill -9 <PID>
```

**检查日志**：
```bash
pm2 logs claw3d --err
```

**检查构建**：
```bash
# 重新构建
rm -rf .next
npm run build
```

### 应用频繁重启

**检查内存使用**：
```bash
pm2 list
pm2 monit
```

**调整内存限制**：
```javascript
// ecosystem.config.js
max_memory_restart: '2G',  // 增加到2GB
```

**检查错误日志**：
```bash
pm2 logs claw3d --err --lines 100
```

### 应用响应慢

**检查资源使用**：
```bash
pm2 monit
top
htop
```

**启用集群模式**：
```javascript
// ecosystem.config.js
instances: 'max',
exec_mode: 'cluster',
```

### 日志文件过大

**安装日志轮转**：
```bash
pm2 install pm2-logrotate
```

**手动清理**：
```bash
pm2 flush
rm -rf logs/*.log
```

---

## 性能优化

### 1. 集群模式

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'claw3d',
      script: 'npm',
      args: 'start',
      instances: 'max',        // 使用所有CPU核心
      exec_mode: 'cluster',    // 集群模式
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};
```

### 2. 内存优化

```javascript
// ecosystem.config.js
{
  max_memory_restart: '1G',    // 内存限制
  node_args: '--max-old-space-size=1024',  // Node.js 内存限制
}
```

### 3. 日志优化

```javascript
// ecosystem.config.js
{
  merge_logs: true,            // 合并日志
  log_date_format: 'YYYY-MM-DD HH:mm:ss',
  error_file: '/dev/null',     // 禁用错误日志（不推荐）
  out_file: '/dev/null',       // 禁用输出日志（不推荐）
}
```

### 4. 环境变量优化

```javascript
// ecosystem.config.js
{
  env: {
    NODE_ENV: 'production',
    PORT: 3000,
    HOST: '0.0.0.0',
    NODE_OPTIONS: '--max-old-space-size=1024',
  },
}
```

---

## 高级配置

### 多环境配置

```javascript
module.exports = {
  apps: [
    {
      name: 'claw3d',
      script: 'npm',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002,
      },
    },
  ],
};
```

启动指定环境：
```bash
pm2 start ecosystem.config.js --env production
pm2 start ecosystem.config.js --env staging
```

### 健康检查

```javascript
// ecosystem.config.js
{
  wait_ready: true,
  listen_timeout: 10000,
  kill_timeout: 5000,
}
```

### 自动重启策略

```javascript
// ecosystem.config.js
{
  autorestart: true,
  max_restarts: 10,              // 最大重启次数
  min_uptime: '10s',             // 最小运行时间
  restart_delay: 4000,           // 重启延迟
}
```

---

## 部署脚本

创建 `deploy.sh` 脚本：

```bash
#!/bin/bash

echo "🚀 开始部署 Claw3D..."

# 1. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin feature/scr02-sentiment-analysis-center

# 2. 安装依赖
echo "📦 安装依赖..."
npm install

# 3. 构建项目
echo "🔨 构建项目..."
npm run build

# 4. 重启 PM2
echo "🔄 重启应用..."
pm2 restart claw3d

# 5. 查看状态
echo "✅ 部署完成！"
pm2 list
pm2 logs claw3d --lines 20
```

使用脚本：
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 监控和告警

### PM2 Plus（可选）

PM2 Plus 提供高级监控和告警功能：

```bash
# 注册 PM2 Plus
pm2 plus

# 链接应用
pm2 link <secret_key> <public_key>
```

功能：
- 📊 实时性能监控
- 🚨 异常告警
- 📈 历史数据分析
- 🔍 错误追踪

---

## 安全建议

1. **使用非 root 用户运行**
```bash
# 创建专用用户
sudo useradd -m -s /bin/bash claw3d
sudo su - claw3d
```

2. **限制文件权限**
```bash
chmod 600 .env
chmod 700 logs/
```

3. **配置防火墙**
```bash
# UFW (Ubuntu)
sudo ufw allow 3000/tcp

# firewalld (CentOS)
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

4. **使用反向代理**
```nginx
# Nginx 配置
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 总结

PM2 是部署 Node.js 应用的最佳选择之一，提供：

✅ **进程管理** - 自动重启、集群模式  
✅ **日志管理** - 集中日志、日志轮转  
✅ **监控** - 实时监控、性能分析  
✅ **部署** - 零停机部署、回滚  
✅ **开机自启** - 系统级服务  

---

## 相关资源

- **PM2 官方文档**: https://pm2.keymetrics.io/
- **PM2 GitHub**: https://github.com/Unitech/pm2
- **Claw3D 文档**: [README.md](README.md)
- **部署指南**: [DEPLOYMENT_GUIDE_CN.md](DEPLOYMENT_GUIDE_CN.md)

---

**最后更新**: 2026-04-21  
**维护者**: microcodor
