# ERR_SSL_PROTOCOL_ERROR 故障排查指南

## 🔍 错误信息

```
http://192.168.0.132:3000/office
net::ERR_SSL_PROTOCOL_ERROR
```

## 📋 问题原因

这个错误表示浏览器尝试使用 HTTPS/SSL 协议访问服务器，但服务器没有正确配置 SSL 证书或者服务器实际上运行在 HTTP 模式。

---

## 🔧 解决方案

### 方案 1: 确认使用 HTTP 协议（推荐）

**问题**: 浏览器可能自动将 `http://` 重定向到 `https://`

**解决步骤**:

#### 1. 清除浏览器缓存和 HSTS 设置

**Chrome/Edge**:
```
1. 打开浏览器，访问: chrome://net-internals/#hsts
2. 在 "Delete domain security policies" 输入: 192.168.0.132
3. 点击 "Delete"
4. 清除浏览器缓存: Ctrl+Shift+Delete
5. 重启浏览器
```

**Firefox**:
```
1. 打开浏览器，访问: about:preferences#privacy
2. 找到 "Cookies and Site Data"
3. 点击 "Clear Data"
4. 勾选 "Cookies and Site Data" 和 "Cached Web Content"
5. 点击 "Clear"
6. 重启浏览器
```

**Safari**:
```
1. Safari → Preferences → Privacy
2. 点击 "Manage Website Data"
3. 搜索 192.168.0.132
4. 点击 "Remove"
5. 重启浏览器
```

#### 2. 强制使用 HTTP

在浏览器地址栏中明确输入 HTTP 协议：

```
http://192.168.0.132:3000/office
```

**注意**: 不要让浏览器自动补全，手动输入完整的 URL。

#### 3. 使用隐私/无痕模式

```
Chrome/Edge: Ctrl+Shift+N
Firefox: Ctrl+Shift+P
Safari: Command+Shift+N
```

在隐私模式下访问：
```
http://192.168.0.132:3000/office
```

---

### 方案 2: 检查服务器状态

#### 1. 登录服务器检查服务

```bash
# SSH 登录服务器
ssh openclaw1@192.168.0.132

# 检查 PM2 状态
pm2 list

# 查看 Claw3D 日志
pm2 logs claw3d --lines 50

# 检查端口监听
lsof -i :3000
# 或
netstat -tuln | grep 3000
```

**预期输出**:
```
pm2 list 应该显示:
┌─────┬──────────┬─────────┬─────────┬─────────┬──────────┐
│ id  │ name     │ mode    │ status  │ ↺       │ cpu      │
├─────┼──────────┼─────────┼─────────┼─────────┼──────────┤
│ 0   │ claw3d   │ fork    │ online  │ 0       │ 0%       │
└─────┴──────────┴─────────┴─────────┴─────────┴──────────┘

lsof -i :3000 应该显示:
node    12345 openclaw1   25u  IPv6 0x...  0t0  TCP *:3000 (LISTEN)
```

#### 2. 检查防火墙

```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 3000/tcp

# CentOS/RHEL
sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# macOS
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

#### 3. 测试本地连接

在服务器上测试：

```bash
# 测试 HTTP 连接
curl -v http://localhost:3000

# 测试局域网 IP
curl -v http://192.168.0.132:3000

# 测试 /office 路径
curl -v http://localhost:3000/office
```

**预期输出**: 应该返回 HTML 内容，不应该有 SSL 相关错误。

---

### 方案 3: 检查 .env 配置

确认 `.env` 文件中**没有**启用 HTTPS：

```bash
# 在服务器上检查
cd /home/openclaw1/claw3d
cat .env | grep -i https

# 应该没有输出，或者 HTTPS 相关配置被注释掉
```

**正确的配置**:
```bash
PORT=3000
HOST=0.0.0.0
# 不应该有 HTTPS=true
```

**错误的配置**（如果有，需要删除或注释）:
```bash
HTTPS=true  # ❌ 删除这行
```

如果发现有 HTTPS 配置，修改后重启服务：

```bash
# 编辑 .env 文件
nano .env
# 删除或注释掉 HTTPS=true

# 重启服务
pm2 restart claw3d
```

---

### 方案 4: 检查 Next.js 配置

检查是否有强制 HTTPS 的配置：

```bash
# 在服务器上检查
cd /home/openclaw1/claw3d
cat next.config.js | grep -i https
cat next.config.mjs | grep -i https
```

如果发现有强制 HTTPS 的配置，需要修改。

---

### 方案 5: 检查反向代理

如果使用了 Nginx 或其他反向代理：

```bash
# 检查 Nginx 配置
sudo nginx -t
sudo cat /etc/nginx/sites-enabled/claw3d

# 检查是否有 SSL 重定向
grep -r "return 301 https" /etc/nginx/
```

如果发现有 HTTP 到 HTTPS 的重定向，需要移除或修改。

---

## 🧪 完整排查流程

### 步骤 1: 在服务器上验证服务

```bash
# SSH 登录服务器
ssh openclaw1@192.168.0.132

# 检查服务状态
pm2 list
pm2 logs claw3d --lines 20

# 测试本地连接
curl -I http://localhost:3000/office

# 检查端口监听
lsof -i :3000
```

### 步骤 2: 在服务器上测试局域网访问

```bash
# 获取服务器 IP
ip addr show | grep "inet " | grep -v 127.0.0.1

# 测试局域网 IP
curl -I http://192.168.0.132:3000/office
```

### 步骤 3: 在客户端测试网络连通性

```bash
# 在客户端机器上测试
ping 192.168.0.132

# 测试端口连通性
telnet 192.168.0.132 3000
# 或
nc -zv 192.168.0.132 3000

# 测试 HTTP 连接
curl -v http://192.168.0.132:3000/office
```

### 步骤 4: 清除浏览器缓存并重试

1. 清除浏览器 HSTS 设置（见方案 1）
2. 清除浏览器缓存
3. 重启浏览器
4. 使用隐私模式访问
5. 手动输入完整 URL: `http://192.168.0.132:3000/office`

---

## 📊 诊断命令汇总

在服务器上运行以下诊断脚本：

```bash
#!/bin/bash

echo "=========================================="
echo "  Claw3D 服务诊断"
echo "=========================================="
echo ""

echo "1️⃣  检查 PM2 服务状态"
pm2 list
echo ""

echo "2️⃣  检查端口监听"
lsof -i :3000
echo ""

echo "3️⃣  检查 .env 配置"
cat .env | grep -E "^PORT=|^HOST=|^HTTPS="
echo ""

echo "4️⃣  测试本地 HTTP 连接"
curl -I http://localhost:3000/office 2>&1 | head -n 5
echo ""

echo "5️⃣  测试局域网 IP 连接"
LOCAL_IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1 | head -n 1)
echo "本机 IP: $LOCAL_IP"
curl -I http://$LOCAL_IP:3000/office 2>&1 | head -n 5
echo ""

echo "6️⃣  检查防火墙状态"
if command -v ufw &> /dev/null; then
    sudo ufw status | grep 3000
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-ports | grep 3000
fi
echo ""

echo "7️⃣  查看最近日志"
pm2 logs claw3d --lines 10 --nostream
echo ""

echo "=========================================="
echo "  诊断完成"
echo "=========================================="
```

保存为 `diagnose.sh`，然后运行：

```bash
chmod +x diagnose.sh
./diagnose.sh
```

---

## ✅ 最可能的解决方案

根据错误信息 `ERR_SSL_PROTOCOL_ERROR`，最可能的原因是：

### 🎯 浏览器 HSTS 缓存问题

**症状**: 浏览器之前访问过该 IP 的 HTTPS 版本，现在自动强制使用 HTTPS

**解决方法**:

1. **清除 HSTS 缓存**（Chrome/Edge）:
   ```
   访问: chrome://net-internals/#hsts
   输入: 192.168.0.132
   点击: Delete
   ```

2. **使用隐私模式**:
   ```
   Ctrl+Shift+N (Chrome/Edge)
   Ctrl+Shift+P (Firefox)
   ```

3. **手动输入完整 URL**:
   ```
   http://192.168.0.132:3000/office
   ```
   注意: 必须包含 `http://` 前缀

4. **使用不同的浏览器**:
   如果 Chrome 不行，尝试 Firefox 或 Safari

---

## 🔒 如果需要启用 HTTPS（可选）

如果你确实需要 HTTPS，可以按以下步骤配置：

### 1. 生成自签名证书

```bash
cd /home/openclaw1/claw3d

# 创建证书目录
mkdir -p .certs

# 生成自签名证书
openssl req -x509 -newkey rsa:4096 -keyout .certs/localhost.key -out .certs/localhost.crt -days 365 -nodes -subj "/CN=192.168.0.132"
```

### 2. 修改启动命令

```bash
# 使用 --https 参数启动
node server/index.js --https
```

### 3. 更新 PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'claw3d',
      script: 'node',
      args: 'server/index.js --https',
      // ... 其他配置
    },
  ],
};
```

### 4. 重启服务

```bash
pm2 restart claw3d
```

### 5. 访问 HTTPS

```
https://192.168.0.132:3000/office
```

**注意**: 浏览器会显示证书警告，需要手动信任证书。

---

## 📞 获取帮助

如果以上方法都无法解决问题，请提供以下信息：

1. **服务器诊断输出**:
   ```bash
   ./diagnose.sh > diagnose-output.txt
   ```

2. **浏览器控制台完整错误**:
   - 按 F12 打开开发者工具
   - 切换到 Console 标签
   - 截图或复制完整错误信息

3. **网络请求详情**:
   - 开发者工具 → Network 标签
   - 刷新页面
   - 查看失败的请求详情

4. **服务器日志**:
   ```bash
   pm2 logs claw3d --lines 50
   ```

---

## 🎯 快速解决清单

- [ ] 清除浏览器 HSTS 缓存（chrome://net-internals/#hsts）
- [ ] 清除浏览器缓存和 Cookie
- [ ] 重启浏览器
- [ ] 使用隐私/无痕模式
- [ ] 手动输入完整 URL: `http://192.168.0.132:3000/office`
- [ ] 尝试不同的浏览器
- [ ] 检查服务器服务状态（pm2 list）
- [ ] 检查防火墙设置
- [ ] 测试本地连接（curl http://localhost:3000）
- [ ] 检查 .env 配置（确认没有 HTTPS=true）

---

**最常见的解决方法**: 清除浏览器 HSTS 缓存 + 使用隐私模式 + 手动输入完整 HTTP URL
