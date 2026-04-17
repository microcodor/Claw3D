# Gateway Allowlist Bug 修复记录

## 🎯 快速参考

**问题**：Gateway 连接失败 - "Upstream gateway URL is not in the allowed hosts list"

**根因**：`server/gateway-proxy.js` 的 `isUpstreamAllowed` 函数只检查 hostname，不支持 hostname:port 格式

**修复**：添加 hostname:port 格式支持

**文件**：`server/gateway-proxy.js` (第 67-87 行)

---

## 🐛 Bug 详情

### 问题代码
```javascript
// ❌ 只检查 hostname
return allowed.includes(parsed.hostname.toLowerCase());
```

### 为什么失败
```javascript
// 配置
UPSTREAM_ALLOWLIST=localhost:18789

// 检查
parsed.hostname = "localhost"  // 不包含端口

// 结果
"localhost" !== "localhost:18789"  // 验证失败
```

---

## ✅ 修复代码

```javascript
// ✅ 同时支持 hostname 和 hostname:port
const hostname = parsed.hostname.toLowerCase();
const hostWithPort = parsed.port 
  ? `${hostname}:${parsed.port}` 
  : hostname;

return allowed.includes(hostname) || allowed.includes(hostWithPort);
```

---

## 🔍 诊断特征

1. Gateway 运行正常 ✅
2. Token 配置正确 ✅
3. 端口监听正常 ✅
4. 错误信息：`not in the allowed hosts list` ❌

→ **结论**：代码 Bug，不是配置问题

---

## 📚 相关文档

- `TROUBLESHOOTING.md` - 完整的故障排查知识库
- `Gateway-Allowlist-修复说明.md` - 详细修复文档
- `fix-gateway-allowlist-final.sh` - 自动修复脚本

---

**修复日期**：2026-04-16
**严重性**：高（阻塞核心功能）
**修复难度**：低（单行代码修改）
**状态**：✅ 已修复并验证

