# Claw3D 内网部署指南（192.168.0.132）

## 📋 部署架构

- **服务器 IP**: 192.168.0.132
- **OpenClaw Gateway**: 运行在 192.168.0.132:18789
- **Claw3D Studio**: 运行在 192.168.0.132:3000
- **访问方式**: 局域网内任何设备通过 `http://192.168.0.132:3000` 访问

---

## 🚀 部署步骤

### 1️⃣ 配置 OpenClaw Gateway

在服务器上确保 OpenClaw Gateway 正在运行：

```bash
# 检查 Gateway 状态
openclaw gateway status

# 如果未运行，启动 Gateway
openclaw gateway start

# 或者安装守护进程（推荐）
openclaw onboard --install-daemon

# 查看 Gateway 配置
openclaw config get gateway.host
openclaw config get gateway.port
```

**重要**: Gateway 可以保持绑定到 `localhost:18789`，因为 Claw3D 和 Gateway 在同一台机器上。

### 2️⃣ 获取 Gateway Token

```bash
# 获取认证 token
openclaw config get gateway.auth.token
```

复制这个 token，需要填入 `.env` 文件的 `CLAW3D_GATEWAY_TOKEN` 中。

### 3️⃣ 配置 Claw3D 环境变量

编辑 `.env` 文件，已经为你配置好了关键参数：

```bash
# Gateway 连接配置（Studio 服务器端使用 localhost）
CLAW3D_GATEWAY_URL=ws://localhost:18789
CLAW3D_GATEWAY_TOKEN=<粘贴你的 token>
CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw

# 服务器配置（允许局域网访问）
HOST=0.0.0.0
PORT=3000

# 安全令牌（必须修改！）
STUDIO_ACCESS_TOKEN=your-secure-token-change-me

# 安全白名单
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789
```

**必须修改的配置项**:
1. `CLAW3D_GATEWAY_TOKEN` - 填入从 OpenClaw 获取的 token
2. `STUDIO_ACCESS_TOKEN` - 修改为一个强密码（例如：`MySecure2024Token!`）

### 4️⃣ 安装依赖并启动

```bash
# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 或者构建生产版本
npm run build
npm run start
```

### 5️⃣ 访问 Claw3D

**从服务器本机访问**:
```
http://localhost:3000
```

**从局域网内其他设备访问**:
```
http://192.168.0.132:3000
```

### 6️⃣ 设备配对批准

首次从新设备/浏览器连接时，需要在服务器上批准：

```bash
# 查看待批准的设备
openclaw devices list

# 批准最新的设备请求
openclaw devices approve --latest

# 或者批准特定设备
openclaw devices approve <request-id>
```

---

## 🔒 安全配置说明

### STUDIO_ACCESS_TOKEN

当 `HOST=0.0.0.0` 时，Studio 会暴露到局域网，**必须**设置访问令牌：

1. 修改 `.env` 中的 `STUDIO_ACCESS_TOKEN` 为强密码
2. 首次访问时，浏览器会提示输入此令牌
3. 令牌会保存在浏览器 cookie 中

### UPSTREAM_ALLOWLIST

限制 Studio 可以连接的 Gateway 主机，防止被用作开放代理：

```bash
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789
```

只允许连接本地 Gateway，不允许连接其他主机。

---

## 🔍 验证和测试

### 检查 OpenClaw Gateway

```bash
# 1. 检查 Gateway 状态
openclaw gateway status

# 2. 检查 Gateway 健康状态
curl http://localhost:18789/health

# 3. 查看 Gateway 日志
openclaw gateway logs
```

### 检查 Claw3D Studio

```bash
# 1. 检查服务是否监听在正确端口
netstat -an | grep 3000

# 2. 从本机测试访问
curl http://localhost:3000

# 3. 从局域网其他设备测试
curl http://192.168.0.132:3000
```

### 检查防火墙

确保端口 3000 在防火墙中开放：

**macOS**:
```bash
# 查看防火墙状态
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# 如果需要，允许 Node.js
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
```

**Linux (ufw)**:
```bash
# 允许端口 3000
sudo ufw allow 3000/tcp
sudo ufw status
```

**Linux (firewalld)**:
```bash
# 允许端口 3000
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

---

## 🐛 常见问题排查

### 问题 1: 无法从其他设备访问 Claw3D

**检查项**:
1. 确认 `HOST=0.0.0.0` 已设置
2. 检查防火墙是否开放端口 3000
3. 确认服务器 IP 地址正确（`ip addr` 或 `ifconfig`）
4. 尝试从服务器本机访问 `http://localhost:3000`

### 问题 2: Gateway 连接失败

**检查项**:
1. 确认 OpenClaw Gateway 正在运行：`openclaw gateway status`
2. 确认 token 正确：`openclaw config get gateway.auth.token`
3. 检查 `.env` 中的 `CLAW3D_GATEWAY_TOKEN` 是否正确
4. 查看 Gateway 日志：`openclaw gateway logs`

### 问题 3: 401 Studio access token required

**原因**: 未设置或未输入正确的 `STUDIO_ACCESS_TOKEN`

**解决**:
1. 确认 `.env` 中设置了 `STUDIO_ACCESS_TOKEN`
2. 清除浏览器 cookie 后重新访问
3. 输入正确的访问令牌

### 问题 4: 设备未批准

**症状**: 连接后显示等待批准

**解决**:
```bash
openclaw devices list
openclaw devices approve --latest
```

### 问题 5: EPROTO 或协议错误

**原因**: 协议不匹配

**解决**: 
- 本地 Gateway 使用 `ws://localhost:18789`（不是 `wss://`）
- 确认 Gateway 端口是 18789

---

## 📊 网络架构图

```
局域网 (192.168.0.0/24)
│
├─ 服务器 (192.168.0.132)
│  │
│  ├─ OpenClaw Gateway
│  │  └─ 监听: localhost:18789
│  │
│  └─ Claw3D Studio
│     ├─ 监听: 0.0.0.0:3000
│     └─ 连接: ws://localhost:18789
│
└─ 客户端设备 (192.168.0.x)
   └─ 浏览器访问: http://192.168.0.132:3000
      │
      └─ WebSocket 代理
         └─ Studio -> Gateway (localhost:18789)
```

**关键点**:
- 浏览器只连接到 Studio (192.168.0.132:3000)
- Studio 服务器端连接到本地 Gateway (localhost:18789)
- Gateway 不需要暴露到局域网

---

## 🔄 生产环境建议

### 使用 PM2 管理进程

```bash
# 安装 PM2
npm install -g pm2

# 构建生产版本
npm run build

# 使用 PM2 启动
pm2 start npm --name "claw3d" -- start

# 设置开机自启
pm2 startup
pm2 save
```

### 使用 Nginx 反向代理（可选）

```nginx
server {
    listen 80;
    server_name 192.168.0.132;

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

### 配置 HTTPS（可选）

如果需要 HTTPS，可以使用自签名证书或内网 CA：

```bash
# 生成自签名证书
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/claw3d.key \
  -out /etc/ssl/certs/claw3d.crt
```

---

## 📝 快速参考

### 启动服务

```bash
# 启动 OpenClaw Gateway
openclaw gateway start

# 启动 Claw3D
npm run dev
```

### 停止服务

```bash
# 停止 OpenClaw Gateway
openclaw gateway stop

# 停止 Claw3D (Ctrl+C)
```

### 查看日志

```bash
# OpenClaw 日志
openclaw gateway logs

# Claw3D 日志（在终端中直接显示）
```

### 重启服务

```bash
# 重启 Gateway
openclaw gateway restart

# 重启 Claw3D（停止后重新运行 npm run dev）
```

---

## 📞 获取帮助

- **OpenClaw 文档**: https://docs.openclaw.ai
- **Claw3D GitHub**: https://github.com/microcodor/Claw3D
- **问题反馈**: 在 GitHub Issues 中提交

---

**配置完成后，记得**:
1. ✅ 修改 `CLAW3D_GATEWAY_TOKEN`
2. ✅ 修改 `STUDIO_ACCESS_TOKEN` 为强密码
3. ✅ 启动 OpenClaw Gateway
4. ✅ 启动 Claw3D
5. ✅ 批准新设备连接
