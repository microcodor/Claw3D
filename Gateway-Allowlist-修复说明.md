# Gateway Allowlist 问题彻底修复说明

## 🐛 问题描述

### 错误信息
```
[gateway-browser] connect-failed {message: 'Upstream gateway URL is not in the allowed hosts list.'}
```

### 根本原因

在 `server/gateway-proxy.js` 的 `isUpstreamAllowed` 函数中：

**原代码逻辑**：
```javascript
const parsed = new URL(url);  // url = "ws://localhost:18789"
// parsed.hostname = "localhost"
// 只检查 hostname

return allowed.includes(parsed.hostname.toLowerCase());
// 但 UPSTREAM_ALLOWLIST="localhost:18789,127.0.0.1:18789"
// 包含端口号，所以匹配失败！
```

**问题**：
- `.env` 配置：`UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789`（包含端口）
- 代码只检查：`parsed.hostname`（不包含端口）
- 结果：`"localhost" !== "localhost:18789"` → 验证失败

## ✅ 修复方案

### 修改文件
`Claw3D/server/gateway-proxy.js` (第 67-87 行)

### 修改内容

**修复前**：
```javascript
const isUpstreamAllowed = (url) => {
  const allowlist = (process.env.UPSTREAM_ALLOWLIST || "").trim();
  if (!allowlist) {
    return process.env.NODE_ENV !== "production";
  }
  try {
    const parsed = new URL(url);
    const allowed = allowlist
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    return allowed.includes(parsed.hostname.toLowerCase());  // ❌ 只检查 hostname
  } catch {
    return false;
  }
};
```

**修复后**：
```javascript
const isUpstreamAllowed = (url) => {
  const allowlist = (process.env.UPSTREAM_ALLOWLIST || "").trim();
  if (!allowlist) {
    return process.env.NODE_ENV !== "production";
  }
  try {
    const parsed = new URL(url);
    const allowed = allowlist
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
    
    // ✅ 同时检查 hostname 和 hostname:port 格式
    const hostname = parsed.hostname.toLowerCase();
    const hostWithPort = parsed.port 
      ? `${hostname}:${parsed.port}` 
      : hostname;
    
    return allowed.includes(hostname) || allowed.includes(hostWithPort);
  } catch {
    return false;
  }
};
```

### 修复逻辑

1. **提取 hostname**：`localhost`
2. **构建 hostname:port**：`localhost:18789`
3. **同时检查两种格式**：
   - `allowed.includes("localhost")` → 支持纯 hostname
   - `allowed.includes("localhost:18789")` → 支持 hostname:port

## 🎯 验证步骤

### 1. 启动服务器
```bash
cd Claw3D
npm run dev
```

### 2. 访问页面
```
http://localhost:3000/office
```

### 3. 检查浏览器控制台

**修复前**（错误）：
```
[gateway-browser] connect-failed {message: 'Upstream gateway URL is not in the allowed hosts list.'}
```

**修复后**（成功）：
```
[gateway-browser] socket:open
[gateway-client] status {nextStatus: 'connected'}
```

### 4. 验证 SCR-01

- 点击 "SCR-01 数字办公室" 标签
- 3D Office 环境应该正常加载
- Gateway 连接状态显示为 "已连接"

## 📋 配置说明

### .env 配置
```bash
# Gateway URL
CLAW3D_GATEWAY_URL=ws://localhost:18789

# Gateway Token
CLAW3D_GATEWAY_TOKEN=9299956cb81a30f7f86f1a627e9feba14184f111a17b6212

# Gateway Adapter Type
CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw

# Upstream Allowlist (支持两种格式)
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789
# 或者只用 hostname (修复后也支持)
# UPSTREAM_ALLOWLIST=localhost,127.0.0.1
```

### 支持的格式

修复后，`UPSTREAM_ALLOWLIST` 支持以下格式：

1. **纯 hostname**：`localhost,127.0.0.1`
2. **hostname:port**：`localhost:18789,127.0.0.1:18789`
3. **混合格式**：`localhost,127.0.0.1:18789,gateway.example.com:8080`

## 🔍 技术细节

### URL 解析

```javascript
const url = "ws://localhost:18789";
const parsed = new URL(url);

console.log(parsed.hostname);  // "localhost"
console.log(parsed.port);      // "18789"
console.log(parsed.host);      // "localhost:18789"
```

### 匹配逻辑

```javascript
// 示例 1: allowlist = "localhost:18789"
// url = "ws://localhost:18789"
hostname = "localhost"           // ❌ 不匹配 "localhost:18789"
hostWithPort = "localhost:18789" // ✅ 匹配！

// 示例 2: allowlist = "localhost"
// url = "ws://localhost:18789"
hostname = "localhost"           // ✅ 匹配！
hostWithPort = "localhost:18789" // ❌ 不匹配 "localhost"

// 修复后：两种情况都支持！
```

## 🎉 修复效果

### 修复前
- ❌ Gateway 连接失败
- ❌ SCR-01 无法使用
- ❌ 错误信息：`not in the allowed hosts list`

### 修复后
- ✅ Gateway 连接成功
- ✅ SCR-01 正常工作
- ✅ 三屏架构完整可用

## 📚 相关文件

- `server/gateway-proxy.js` - WebSocket 代理（已修复）
- `.env` - 环境变量配置
- `fix-gateway-allowlist-final.sh` - 自动修复脚本
- `Gateway连接问题解决方案.md` - 完整的故障排查指南

## 💡 最佳实践

### 推荐配置

```bash
# 开发环境（本地）
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789

# 生产环境（指定域名和端口）
UPSTREAM_ALLOWLIST=gateway.example.com:18789,backup.example.com:18789

# 多环境（混合）
UPSTREAM_ALLOWLIST=localhost:18789,gateway.example.com:443
```

### 安全建议

1. **生产环境必须设置 UPSTREAM_ALLOWLIST**
2. **只允许信任的 Gateway 主机**
3. **使用 hostname:port 格式更精确**
4. **定期审查 allowlist 配置**

## 🆘 故障排查

### 如果还有问题

1. **检查 .env 配置**：
   ```bash
   grep UPSTREAM_ALLOWLIST .env
   ```

2. **检查 Gateway 状态**：
   ```bash
   openclaw gateway status
   lsof -i :18789
   ```

3. **重启服务器**：
   ```bash
   # 停止
   kill $(lsof -ti :3000)
   
   # 启动
   npm run dev
   ```

4. **清除缓存**：
   ```bash
   rm -rf .next/cache
   ```

5. **硬刷新浏览器**：
   - Mac: `Cmd+Shift+R`
   - Windows: `Ctrl+Shift+R`

## 🎊 总结

这次修复解决了一个关键的配置验证 bug：

- **问题**：allowlist 验证逻辑不支持 `hostname:port` 格式
- **影响**：Gateway 连接被错误地拒绝
- **修复**：同时支持 `hostname` 和 `hostname:port` 两种格式
- **结果**：Gateway 连接成功，三屏架构完整可用

---

**修复日期**：2026-04-16
**版本**：1.0.0
**状态**：✅ 已修复并验证

