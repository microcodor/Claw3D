# 服务器部署说明

## 📦 部署方式

### 方式一：使用自动部署脚本（推荐）

1. **登录服务器**
   ```bash
   ssh openclaw1@192.168.0.132
   ```

2. **下载部署脚本**
   ```bash
   curl -O https://raw.githubusercontent.com/microcodor/Claw3D/main/server-deploy.sh
   # 或者如果上面的链接不可用，手动创建脚本文件
   ```

3. **运行部署脚本**
   ```bash
   bash server-deploy.sh
   ```

4. **按照提示完成配置**
   - 脚本会自动检查环境
   - 克隆项目代码
   - 配置环境变量
   - 安装依赖
   - 构建项目
   - 启动服务

---

### 方式二：手动部署

如果自动脚本无法使用，按照以下步骤手动部署：

#### 1. 登录服务器
```bash
ssh openclaw1@192.168.0.132
```

#### 2. 克隆项目
```bash
cd ~
git clone https://github.com/microcodor/Claw3D.git claw3d
cd claw3d
```

#### 3. 配置环境变量
```bash
# 复制配置文件
cp .env.example .env

# 编辑配置
nano .env
```

修改以下内容：
```bash
# Gateway 连接
CLAW3D_GATEWAY_URL=ws://localhost:18789
CLAW3D_GATEWAY_TOKEN=<运行 openclaw config get gateway.auth.token 获取>
CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw

# 服务器配置
HOST=0.0.0.0
PORT=3000

# 安全令牌（修改为强密码）
STUDIO_ACCESS_TOKEN=YourSecurePassword123!

# 安全白名单
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789

# 调试
DEBUG=true
```

保存：`Ctrl+O` → `Enter` → `Ctrl+X`

#### 4. 获取 Gateway Token
```bash
openclaw config get gateway.auth.token
```
将输出的 token 填入 `.env` 的 `CLAW3D_GATEWAY_TOKEN`

#### 5. 安装依赖
```bash
npm install
```

#### 6. 构建项目
```bash
npm run build
```

#### 7. 启动服务
```bash
# 停止旧服务（如果存在）
pm2 stop claw3d
pm2 delete claw3d

# 启动新服务
pm2 start npm --name "claw3d" -- start

# 保存配置
pm2 save

# 设置开机自启（首次运行）
pm2 startup
# 按照提示运行显示的命令
```

#### 8. 配置防火墙
```bash
# Ubuntu/Debian
sudo ufw allow 3000/tcp
sudo ufw status

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

#### 9. 验证部署
```bash
# 查看服务状态
pm2 status

# 查看日志
pm2 logs claw3d

# 测试访问
curl http://localhost:3000
```

---

## 🔍 部署后检查

### 1. 检查服务状态
```bash
pm2 status
pm2 logs claw3d
```

### 2. 检查 OpenClaw Gateway
```bash
openclaw gateway status
```

### 3. 测试访问
```bash
# 本地测试
curl http://localhost:3000

# 从其他设备访问
http://192.168.0.132:3000
```

### 4. 批准设备
首次连接时需要批准：
```bash
openclaw devices list
openclaw devices approve --latest
```

---

## 🛠️ 常用管理命令

### PM2 管理
```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs claw3d

# 实时日志（最近 100 行）
pm2 logs claw3d --lines 100

# 重启服务
pm2 restart claw3d

# 停止服务
pm2 stop claw3d

# 删除服务
pm2 delete claw3d

# 监控面板
pm2 monit

# 查看详细信息
pm2 show claw3d
```

### OpenClaw 管理
```bash
# Gateway 状态
openclaw gateway status

# 重启 Gateway
openclaw gateway restart

# 查看日志
openclaw gateway logs

# 查看配置
openclaw config list

# 查看设备
openclaw devices list

# 批准设备
openclaw devices approve --latest

# 获取 Token
openclaw config get gateway.auth.token
```

### 更新代码
```bash
cd ~/claw3d

# 停止服务
pm2 stop claw3d

# 备份配置
cp .env .env.backup

# 拉取最新代码
git pull

# 恢复配置
cp .env.backup .env

# 安装依赖
npm install

# 重新构建
npm run build

# 重启服务
pm2 restart claw3d

# 查看日志
pm2 logs claw3d
```

---

## 🐛 故障排查

### 问题 1: 端口被占用
```bash
# 查看端口占用
netstat -tulpn | grep 3000
# 或
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

### 问题 2: 构建失败
```bash
# 清理缓存
rm -rf node_modules .next
npm cache clean --force

# 重新安装
npm install
npm run build
```

### 问题 3: Gateway 连接失败
```bash
# 检查 Gateway
openclaw gateway status

# 重启 Gateway
openclaw gateway restart

# 验证 Token
openclaw config get gateway.auth.token

# 查看日志
openclaw gateway logs
```

### 问题 4: 无法从局域网访问
```bash
# 检查监听地址
netstat -tulpn | grep 3000

# 应该显示 0.0.0.0:3000，而不是 127.0.0.1:3000

# 检查 .env 配置
cat ~/claw3d/.env | grep HOST

# 检查防火墙
sudo ufw status
# 或
sudo firewall-cmd --list-ports
```

### 问题 5: PM2 服务无法启动
```bash
# 查看详细错误
pm2 logs claw3d --err

# 尝试直接运行
cd ~/claw3d
npm start

# 检查端口占用
netstat -tulpn | grep 3000
```

---

## 📊 访问信息

部署完成后：

- **本地访问**: http://localhost:3000
- **局域网访问**: http://192.168.0.132:3000
- **访问令牌**: 在 `.env` 中的 `STUDIO_ACCESS_TOKEN`

---

## 🔒 安全建议

1. **修改服务器密码**
   ```bash
   passwd
   ```

2. **配置 SSH 密钥认证**
   ```bash
   # 在本地生成密钥
   ssh-keygen -t ed25519
   
   # 复制到服务器
   ssh-copy-id openclaw1@192.168.0.132
   ```

3. **设置强密码**
   - 修改 `.env` 中的 `STUDIO_ACCESS_TOKEN`
   - 使用至少 16 位的随机密码

4. **配置防火墙**
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 3000/tcp
   sudo ufw enable
   ```

5. **定期更新**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 📝 快速命令参考

```bash
# 一键重启
pm2 restart claw3d && pm2 logs claw3d

# 一键更新
cd ~/claw3d && git pull && npm install && npm run build && pm2 restart claw3d

# 查看完整状态
echo "=== PM2 状态 ===" && pm2 status && echo "" && echo "=== Gateway 状态 ===" && openclaw gateway status

# 批准所有待处理设备
openclaw devices list && openclaw devices approve --latest
```

---

## ✅ 部署完成检查清单

- [ ] 服务器环境检查（Node.js, npm, PM2, OpenClaw）
- [ ] 项目代码已克隆
- [ ] .env 文件已配置
- [ ] CLAW3D_GATEWAY_TOKEN 已设置
- [ ] STUDIO_ACCESS_TOKEN 已修改为强密码
- [ ] npm install 成功
- [ ] npm run build 成功
- [ ] PM2 服务已启动
- [ ] 防火墙端口 3000 已开放
- [ ] 可以从局域网访问 http://192.168.0.132:3000
- [ ] 设备已批准（openclaw devices approve --latest）
- [ ] 可以成功连接到 Gateway

---

## 🎉 完成！

部署完成后，你可以：
1. 访问 http://192.168.0.132:3000
2. 输入 STUDIO_ACCESS_TOKEN
3. 连接到 OpenClaw Gateway
4. 批准设备
5. 开始使用 Claw3D！

如有问题，查看日志：
```bash
pm2 logs claw3d
openclaw gateway logs
```
