# Claw3D 故障排查知识库

本文档记录了 Claw3D 项目中遇到的经典问题和解决方案，供未来参考。

---

## 🔥 经典问题 #1: Gateway Allowlist 验证失败

### 问题描述

**错误信息**：
```
[gateway-browser] connect-failed {message: 'Upstream gateway URL is not in the allowed hosts list.'}
```

**症状**：
- Gateway 连接失败（错误码 1011）
- 浏览器控制台显示 "not in the allowed hosts list"
- OpenClaw Gateway 本身运行正常
- Token 配置正确
- 端口监听正常

### 根本原因

**代码 Bug**：`server/gateway-proxy.js` 中的 `isUpstreamAllowed` 函数只检查 **hostname**，不支持 **hostname:port** 格式。

**问题代码**（第 67-87 行）：
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
    return allowed.includes(parsed.hostname.toLowerCase());  // ❌ BUG: 只检查 hostname
  } catch {
    return false;
  }
};
```

**为什么会失败**：
```javascript
// .env 配置
UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789

// 实际 URL
url = "ws://localhost:18789"

// 解析结果
parsed.hostname = "localhost"  // 不包含端口

// 验证逻辑
allowed = ["localhost:18789", "127.0.0.1:18789"]
allowed.includes("localhost")  // false ❌

// 结果：验证失败！
```

### 解决方案

**修复代码**：
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
    
    // ✅ 修复：同时检查 hostname 和 hostname:port 格式
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

**修复后的验证逻辑**：
```javascript
// 同时检查两种格式
hostname = "localhost"           // 检查纯 hostname
hostWithPort = "localhost:18789" // 检查 hostname:port

// 任意一个匹配即可
allowed.includes("localhost")        // false
allowed.includes("localhost:18789")  // true ✅

// 结果：验证成功！
```

### 诊断步骤

1. **检查错误信息**：
   ```
   connect-failed {message: 'Upstream gateway URL is not in the allowed hosts list.'}
   ```

2. **检查 .env 配置**：
   ```bash
   grep UPSTREAM_ALLOWLIST .env
   # 输出: UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789
   ```

3. **检查 Gateway 状态**：
   ```bash
   openclaw gateway status
   lsof -i :18789
   # Gateway 运行正常
   ```

4. **检查 Token**：
   ```bash
   grep CLAW3D_GATEWAY_TOKEN .env
   # Token 配置正确
   ```

5. **结论**：所有配置正确，但仍然连接失败 → 代码 Bug

### 修复步骤

1. **修改文件**：`server/gateway-proxy.js`（第 67-87 行）
2. **应用修复**：添加 `hostname:port` 格式支持
3. **重启服务器**：
   ```bash
   # 停止
   kill $(lsof -ti :3000)
   
   # 清除缓存
   rm -rf .next/cache
   
   # 启动
   npm run dev
   ```
4. **硬刷新浏览器**：Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows)

### 验证成功

**成功标志**：
```
[gateway-browser] socket:open
[gateway-client] status {nextStatus: 'connected'}
```

### 预防措施

1. **单元测试**：为 `isUpstreamAllowed` 添加测试用例
2. **文档说明**：明确 `UPSTREAM_ALLOWLIST` 支持的格式
3. **错误信息**：改进错误提示，显示实际的 hostname 和 allowlist

### 相关文件

- `server/gateway-proxy.js` - WebSocket 代理（已修复）
- `.env` - 环境变量配置
- `Gateway-Allowlist-修复说明.md` - 详细修复文档
- `fix-gateway-allowlist-final.sh` - 自动修复脚本

### 影响范围

- **版本**：Claw3D 所有版本（直到修复）
- **影响**：Gateway 连接失败，SCR-01 无法使用
- **严重性**：高（阻塞核心功能）
- **修复难度**：低（单行代码修改）

---

## 🔥 经典问题 #2: Gateway 连接弹窗闪屏

### 问题描述

**错误症状**：
- 用户输入 Token 后点击"连接"按钮
- 连接成功后，弹窗会短暂消失然后再次弹出
- 类似"闪屏"效果，用户体验不佳

**当前状态**：⚠️ 已知问题，暂未完全修复

**影响**：UX 问题，不影响功能

### 临时解决方案

1. **忽略闪屏**：弹窗会自动消失，不影响使用
2. **刷新页面**：如果弹窗一直显示，刷新浏览器
3. **使用 SCR-02 和 SCR-03**：这两个屏幕不需要 Gateway

### 相关文档

- `Gateway-弹窗闪屏修复说明.md` - 问题分析和修复尝试
- `无限循环错误修复说明.md` - 修复过程中遇到的问题

---

## 🔥 经典问题 #3: Maximum update depth exceeded

### 问题描述

**错误信息**：
```
Maximum update depth exceeded. This can happen when a component calls setState 
inside useEffect, but useEffect either doesn't have a dependency array, or one 
of the dependencies changes on every render.
```

**症状**：
- 应用崩溃，无法加载
- 浏览器控制台显示无限循环错误
- CPU 占用率飙升

### 根本原因

**代码问题**：在 `useEffect` 中更新状态，导致无限循环。

**常见场景**：
1. 计算值作为 useEffect 依赖，但计算逻辑每次都返回新值
2. setState 在 useEffect 中调用，但没有正确的依赖数组
3. 对象/数组依赖没有使用 useMemo 缓存
4. **Ref 作为 useEffect 依赖**（最新发现）

**最新案例**：`RetroOffice3D.tsx` 第 2944 行
```typescript
// ❌ 错误
useEffect(() => {
  // ... setState 调用
}, [renderAgentsRef]);  // Ref 不应作为依赖
```

### 解决方案

**立即修复**：
```bash
# 停止服务器
kill -9 $(lsof -ti :3000)

# 清除缓存
rm -rf .next/cache .next/server

# 重新启动
npm run dev
```

或者运行自动修复脚本：
```bash
# GatewayClient 问题
./fix-infinite-loop.sh

# RetroOffice3D 问题
./fix-retrooffice-loop.sh
```

### 预防措施

1. **使用 useMemo 缓存计算值**：
   ```typescript
   const value = useMemo(() => {
     return expensiveCalculation();
   }, [dep1, dep2]);
   ```

2. **使用 Ref 存储不需要触发渲染的值**：
   ```typescript
   const flagRef = useRef(false);
   // 更新 Ref 不会触发重渲染
   ```

3. **明确 useEffect 依赖**：
   ```typescript
   useEffect(() => {
     // ...
   }, [dep1, dep2]);  // 明确列出所有依赖
   ```

4. **不要将 Ref 作为依赖**：
   ```typescript
   // ❌ 错误
   useEffect(() => {}, [myRef]);
   
   // ✅ 正确
   useEffect(() => {}, []);  // Ref 不会改变，使用空数组
   ```

### 相关文档

- `无限循环错误修复说明.md` - 详细的修复文档

---

## 📋 其他常见问题

### 问题 #2: HOST 配置导致局域网无法访问

**错误**：局域网内其他设备无法访问 Claw3D

**原因**：`.env` 中 `HOST=127.0.0.1`（只监听本地回环）

**解决**：
```bash
# .env
HOST=0.0.0.0  # 监听所有网络接口
```

**相关文档**：`SERVER_DEPLOY_README.md`

---

### 问题 #3: 构建警告 "Can't resolve 'openclaw'"

**警告**：
```
Module not found: Can't resolve 'openclaw'
```

**原因**：`openclaw` npm 包是可选的运行时依赖，不是构建依赖

**解决**：这是预期的警告，可以忽略

**说明**：
- `openclaw` 包在运行时可选解析
- 不影响构建和运行
- 已在 `AGENTS.md` 中记录

---

### 问题 #4: WebGL Context Lost

**警告**：
```
THREE.WebGLRenderer: Context Lost.
```

**原因**：浏览器 GPU 资源限制或页面切换

**解决**：
- 刷新页面
- 关闭其他占用 GPU 的标签页
- 更新显卡驱动

**影响**：仅影响 SCR-01 的 3D 渲染，不影响 SCR-02 和 SCR-03

---

## 🔍 诊断工具

### 自动诊断脚本

```bash
# Gateway 连接诊断
./diagnose-gateway-connection.sh

# WebSocket 修复
./fix-gateway-websocket.sh

# Allowlist 修复
./fix-gateway-allowlist-final.sh

# 服务器重启
./restart-claw3d.sh
```

### 手动诊断命令

```bash
# 检查端口监听
lsof -i :3000
lsof -i :18789

# 检查 Gateway 状态
openclaw gateway status

# 检查 Token
openclaw config get gateway.auth.token

# 查看 Gateway 日志
tail -50 /tmp/openclaw/openclaw-*.log

# 测试 HTTP 端点
curl http://localhost:18789
curl http://localhost:3000/api/studio
```

---

## 📚 相关文档

- `AGENTS.md` - 项目说明和开发指南
- `SERVER_DEPLOY_README.md` - 服务器部署指南
- `Gateway连接问题解决方案.md` - Gateway 故障排查
- `Gateway-Allowlist-修复说明.md` - Allowlist Bug 详细说明
- `THREE_SCREEN_INTEGRATION_COMPLETE.md` - 三屏架构文档
- `QUICK_START_三屏架构.md` - 快速启动指南

---

## 💡 最佳实践

### 开发环境

1. **使用 localhost**：开发时使用 `localhost` 而不是 `127.0.0.1`
2. **配置 allowlist**：明确指定允许的 Gateway 主机
3. **定期更新**：保持 OpenClaw 和依赖包最新
4. **查看日志**：遇到问题先查看 Gateway 日志

### 生产环境

1. **必须设置 UPSTREAM_ALLOWLIST**：限制可连接的 Gateway
2. **使用 HTTPS/WSS**：生产环境使用加密连接
3. **设置 STUDIO_ACCESS_TOKEN**：保护 Studio 访问
4. **监控日志**：定期检查错误日志

### 故障排查流程

1. **查看错误信息**：浏览器控制台 + 服务器日志
2. **检查配置**：`.env` 文件和环境变量
3. **验证服务**：Gateway 和 Claw3D 服务器状态
4. **运行诊断**：使用自动诊断脚本
5. **查阅文档**：本文档和相关文档
6. **逐步排查**：从简单到复杂，逐步缩小范围

---

## 🆘 获取帮助

如果遇到本文档未涵盖的问题：

1. **查看日志**：
   - Gateway: `/tmp/openclaw/openclaw-*.log`
   - Claw3D: 终端输出
   - 浏览器: 开发者工具控制台

2. **运行诊断**：
   ```bash
   ./diagnose-gateway-connection.sh > diagnosis.txt
   ```

3. **收集信息**：
   - 错误信息（完整的）
   - 配置文件（`.env`，隐藏敏感信息）
   - 系统信息（OS、Node 版本）
   - 复现步骤

4. **提交 Issue**：包含上述信息

---

**最后更新**：2026-04-16
**维护者**：Claw3D Team
**版本**：1.0.0

