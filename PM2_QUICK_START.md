# PM2 快速开始

## 🚀 一键部署

```bash
# 使用自动化脚本
./pm2-deploy.sh
```

## 📋 手动部署

```bash
# 1. 构建
npm run build

# 2. 启动
pm2 start ecosystem.config.js

# 3. 保存
pm2 save

# 4. 开机自启
pm2 startup
```

## 🎯 常用命令

| 命令 | 说明 |
|------|------|
| `pm2 list` | 查看所有应用 |
| `pm2 logs claw3d` | 查看日志 |
| `pm2 monit` | 实时监控 |
| `pm2 restart claw3d` | 重启应用 |
| `pm2 stop claw3d` | 停止应用 |
| `pm2 delete claw3d` | 删除应用 |
| `pm2 save` | 保存配置 |

## 🔄 更新应用

```bash
# 拉取代码
git pull

# 安装依赖
npm install

# 重新构建
npm run build

# 重启应用
pm2 restart claw3d
```

## 📊 监控

```bash
# 实时监控面板
pm2 monit

# 查看详细信息
pm2 show claw3d

# 查看日志
pm2 logs claw3d --lines 100
```

## 🐛 故障排查

### 应用无法启动

```bash
# 查看错误日志
pm2 logs claw3d --err

# 检查端口占用
lsof -i :3000

# 重新构建
rm -rf .next
npm run build
pm2 restart claw3d
```

### 内存占用过高

```bash
# 查看内存使用
pm2 list

# 调整内存限制（编辑 ecosystem.config.js）
max_memory_restart: '2G'

# 重启应用
pm2 restart claw3d
```

## 📚 完整文档

详细指南请查看: [PM2_DEPLOYMENT_GUIDE.md](PM2_DEPLOYMENT_GUIDE.md)

---

**快速访问**: http://localhost:3000/office
