# Claw3D 手动部署步骤

如果自动部署脚本无法使用，请按照以下步骤手动部署。

## 服务器信息
- **IP**: 192.168.0.132
- **端口**: 22
- **用户**: openclaw1
- **密码**: ******** (请勿在公开场合分享)

---

## 步骤 1: 连接到服务器

```bash
ssh openclaw1@192.168.0.132
```

输入密码后登录。

---

## 步骤 2: 检查环境

```bash
# 检查 Node.js
node -v  # 应该是 v20 或更高

# 检查 npm
npm -v   # 应该是 v10 或更高

# 检查 PM2
pm2 -v

# 检查 OpenClaw
openclaw --version
openclaw gateway status
```

如果缺少任何工具，请先安装。

---

## 步骤 3: 克隆项目

```bash
# 进入用户目录
cd ~

# 克隆项目（如果已存在则跳过）
git clone git@github.com:microcodor/Claw3D.git claw3d

# 或者使用 HTTPS
git clone https://github.com/microcodor/Claw3D.git claw3d

# 进入项目目录
cd claw3d
```

---

## 步骤 4: 配置环境变量

```bash
# 复制 .env 文件
cp .env.example .env

# 编辑 .env 文件
nano .env
```

修改以下配置：

```bash
# Gateway 连接
CLAW3D_GATEWAY_URL=ws://localhost:18789
CLAW3D_GATEWAY_TOKEN=<从下面命令获取>
CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw

# 服务器配置
HOST=0.0.0.0
PORT=3000

# 安全令牌（修改为强密码）
STUDIO_ACCESS_TOKEN=MySecure2024Token!

# 安全白名单
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789

# 调试
DEBUG=true
```

获取 Gateway Token:

```bash
openclaw config get gateway.auth.token
```

将输出的 token 填入 `CLAW3D_GATEWAY_TOKEN`。

保存文件：`Ctrl+O`, `Enter`, `Ctrl+X`

---

## 步骤 5: 安装依赖

```bash
cd ~/claw3d

# 安装依赖（可能需要几分钟）
npm install
```

---

## 步骤 6: 构建项目

```bash
# 构建生产版本
npm run build
```

等待构建完成（可能需要几分钟）。

---

## 步骤 7: 使用 PM2 启动

```bash
# 停止旧的进程（如果存在）
pm2 stop claw3d
pm2 delete claw3d

# 启动新进程
pm2 start npm --name "claw3d" -- start

# 保存 PM2 配置
pm2 save

# 设置开机自启（首次运行）
pm2 startup
# 按照提示运行显示的命令

# 查看状态
pm2 status
pm2 logs claw3d
```

---

## 步骤 8: 配置防火墙

### Ubuntu/Debian (ufw)

```bash
sudo ufw allow 3000/tcp
sudo ufw status
```

### CentOS/RHEL (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports
```

---

## 步骤 9: 验证部署

### 从服务器本机测试

```bash
curl http://localhost:3000
```

应该返回 HTML 内容。

### 从局域网其他设备测试

在浏览器中访问：
```
http://192.168.0.132:3000
```

---

## 步骤 10: 批准设备

首次连接时，需要批准设备：

```bash
# 查看待批准的设备
openclaw devices list

# 批准最新的设备
openclaw devices approve --latest
```

---

## 常用管理命令

### PM2 管理

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs claw3d

# 实时日志
pm2 logs claw3d --lines 100

# 重启服务
pm2 restart claw3d

# 停止服务
pm2 stop claw3d

# 删除服务
pm2 delete claw3d

# 查看详细信息
pm2 show claw3d

# 监控
pm2 monit
```

### OpenClaw 管理

```bash
# 查看 Gateway 状态
openclaw gateway status

# 重启 Gateway
openclaw gateway restart

# 查看日志
openclaw gateway logs

# 查看配置
openclaw config list

# 查看设备
openclaw devices list
```

### 更新代码

```bash
cd ~/claw3d

# 停止服务
pm2 stop claw3d

# 拉取最新代码
git pull

# 安装依赖
npm install

# 重新构建
npm run build

# 启动服务
pm2 restart claw3d

# 查看日志
pm2 logs claw3d
```

---

## 故障排查

### 问题 1: 端口被占用

```bash
# 查看端口占用
netstat -tulpn | grep 3000
# 或
lsof -i :3000

# 杀死占用进程
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
# 检查 Gateway 状态
openclaw gateway status

# 重启 Gateway
openclaw gateway restart

# 检查 token
openclaw config get gateway.auth.token

# 查看 Gateway 日志
openclaw gateway logs
```

### 问题 4: 无法从局域网访问

```bash
# 检查服务是否监听在 0.0.0.0
netstat -tulpn | grep 3000

# 检查防火墙
sudo ufw status
# 或
sudo firewall-cmd --list-ports

# 检查 .env 配置
cat ~/claw3d/.env | grep HOST
```

---

## 访问信息

部署完成后：

- **本地访问**: http://localhost:3000
- **局域网访问**: http://192.168.0.132:3000
- **访问令牌**: 在 `.env` 中的 `STUDIO_ACCESS_TOKEN`

---

## 安全建议

1. **立即修改服务器密码**
   ```bash
   passwd
   ```

2. **配置 SSH 密钥认证**
   ```bash
   # 在本地生成密钥（如果没有）
   ssh-keygen -t ed25519
   
   # 复制公钥到服务器
   ssh-copy-id openclaw1@192.168.0.132
   ```

3. **禁用密码登录**（配置密钥后）
   ```bash
   sudo nano /etc/ssh/sshd_config
   # 设置: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

4. **配置防火墙**
   ```bash
   # 只允许必要的端口
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 3000/tcp
   sudo ufw enable
   ```

5. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## 完成！

部署完成后，你可以：
1. 访问 http://192.168.0.132:3000
2. 输入 STUDIO_ACCESS_TOKEN
3. 连接到 OpenClaw Gateway
4. 批准设备
5. 开始使用 Claw3D！
