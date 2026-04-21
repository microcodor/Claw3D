# PM2 部署总结

## ✅ 是的，Claw3D 完全支持 PM2 部署！

## 📦 已提供的资源

### 1. 配置文件
- **ecosystem.config.js** - PM2 配置文件（已存在）
  - 单实例配置
  - 自动重启
  - 日志管理
  - 内存限制

### 2. 文档
- **PM2_DEPLOYMENT_GUIDE.md** - 完整部署指南（新增）
  - 环境要求
  - 详细步骤
  - 配置说明
  - 常用命令
  - 监控和日志
  - 故障排查
  - 性能优化
  - 高级配置

- **PM2_QUICK_START.md** - 快速参考（新增）
  - 一键部署
  - 常用命令速查表
  - 更新流程
  - 故障排查

### 3. 自动化脚本
- **pm2-deploy.sh** - 一键部署脚本（新增）
  - 自动检查环境
  - 自动安装依赖
  - 自动构建项目
  - 自动启动应用
  - 彩色输出提示

## 🚀 快速开始

### 方式一：使用自动化脚本（推荐）

```bash
# 1. 克隆项目
git clone git@github.com:microcodor/Claw3D.git
cd Claw3D

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 3. 一键部署
./pm2-deploy.sh
```

### 方式二：手动部署

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 启动应用
pm2 start ecosystem.config.js

# 4. 保存配置
pm2 save

# 5. 设置开机自启
pm2 startup
```

## 📊 PM2 配置详情

### 当前配置（ecosystem.config.js）

```javascript
{
  name: 'claw3d',              // 应用名称
  script: 'npm',               // 执行 npm
  args: 'start',               // npm start
  cwd: '/home/openclaw1/claw3d',  // 工作目录
  instances: 1,                // 单实例
  autorestart: true,           // 自动重启
  watch: false,                // 不监听文件变化
  max_memory_restart: '1G',    // 内存超过1GB重启
  
  env: {
    NODE_ENV: 'production',
    PORT: 3000,
    HOST: '0.0.0.0',
  },
  
  // 日志配置
  error_file: './logs/err.log',
  out_file: './logs/out.log',
  log_file: './logs/combined.log',
  time: true,
  merge_logs: true,
}
```

### 可选优化配置

**集群模式**（多核CPU）：
```javascript
{
  instances: 'max',        // 使用所有CPU核心
  exec_mode: 'cluster',    // 集群模式
}
```

**更大内存**：
```javascript
{
  max_memory_restart: '2G',
}
```

## 🎯 常用命令

| 命令 | 说明 |
|------|------|
| `pm2 start ecosystem.config.js` | 启动应用 |
| `pm2 list` | 查看所有应用 |
| `pm2 logs claw3d` | 查看日志 |
| `pm2 monit` | 实时监控 |
| `pm2 restart claw3d` | 重启应用 |
| `pm2 reload claw3d` | 0秒停机重启 |
| `pm2 stop claw3d` | 停止应用 |
| `pm2 delete claw3d` | 删除应用 |
| `pm2 save` | 保存配置 |
| `pm2 startup` | 设置开机自启 |

## 📈 监控和管理

### 实时监控
```bash
pm2 monit
```

### 查看日志
```bash
# 实时日志
pm2 logs claw3d

# 最近100行
pm2 logs claw3d --lines 100

# 只看错误
pm2 logs claw3d --err
```

### 查看详情
```bash
pm2 show claw3d
```

## 🔄 更新应用

```bash
# 1. 拉取最新代码
git pull

# 2. 安装依赖
npm install

# 3. 重新构建
npm run build

# 4. 重启应用
pm2 restart claw3d

# 或使用0秒停机重启
pm2 reload claw3d
```

## 🐛 故障排查

### 应用无法启动

1. **查看错误日志**
```bash
pm2 logs claw3d --err
```

2. **检查端口占用**
```bash
lsof -i :3000
```

3. **重新构建**
```bash
rm -rf .next
npm run build
pm2 restart claw3d
```

### 应用频繁重启

1. **检查内存使用**
```bash
pm2 list
pm2 monit
```

2. **增加内存限制**
```javascript
// ecosystem.config.js
max_memory_restart: '2G'
```

3. **查看错误日志**
```bash
pm2 logs claw3d --err --lines 100
```

## 🌐 访问应用

### 本地访问
```
http://localhost:3000/office
```

### 局域网访问
```
http://<服务器IP>:3000/office
```

确保 `.env` 中设置：
```env
HOST=0.0.0.0
PORT=3000
```

## 📚 相关文档

- **[PM2_DEPLOYMENT_GUIDE.md](PM2_DEPLOYMENT_GUIDE.md)** - 完整部署指南
- **[PM2_QUICK_START.md](PM2_QUICK_START.md)** - 快速参考
- **[README.md](README.md)** - 项目主文档
- **[DEPLOYMENT_GUIDE_CN.md](DEPLOYMENT_GUIDE_CN.md)** - 通用部署指南

## 🎉 总结

Claw3D 完全支持 PM2 部署，并提供：

✅ **现成的配置文件** - ecosystem.config.js  
✅ **完整的中文文档** - 详细的部署指南  
✅ **自动化脚本** - 一键部署  
✅ **快速参考** - 常用命令速查  
✅ **故障排查** - 常见问题解决方案  

**推荐使用 PM2 部署 Claw3D！**

---

**最后更新**: 2026-04-21  
**提交哈希**: 391afbb  
**分支**: feature/scr02-sentiment-analysis-center
