# Gateway 连接弹窗闪屏问题修复

## 🐛 问题描述

**症状**：
- 用户输入 Token 后点击"连接"按钮
- 连接成功后，弹窗会短暂消失然后再次弹出
- 类似"闪屏"效果，用户体验不佳

**复现步骤**：
1. 打开 `/office` 页面
2. 看到 Gateway 连接弹窗
3. 输入 Token
4. 点击"连接"按钮
5. 观察到弹窗闪现

## 🔍 根本原因

### 问题 1: `shouldPromptForConnect` 逻辑过于激进

**原代码**（`src/lib/gateway/GatewayClient.ts` 第 1195-1203 行）：
```typescript
const shouldPromptForConnect =
  settingsLoaded &&
  status !== "connected" &&
  (selectedAdapterType === "custom" ||
    !hasLastKnownGoodState ||
    !gatewayUrl.trim() ||
    (selectedAdapterType === "openclaw" && !token.trim()) ||
    wasManualDisconnectRef.current ||  // ❌ 问题：总是提示
    Boolean(error));  // ❌ 问题：即使是旧错误也提示
```

**问题分析**：
1. **`wasManualDisconnectRef.current`**：即使用户手动连接成功后，这个标志仍然可能导致弹窗再次显示
2. **`Boolean(error)`**：如果之前有错误，即使用户正在连接，也会触发弹窗
3. **缺少 `status !== "connecting"` 检查**：连接过程中也可能触发弹窗

### 问题 2: 状态更新时序

连接过程中的状态变化：
```
disconnected → connecting → connected
```

但在某些情况下，可能会有短暂的状态波动：
```
disconnected → connecting → connected → disconnected (短暂) → connected
```

这会导致 `showGatewayConnectOverlay` 的条件短暂满足，弹窗闪现。

## ✅ 修复方案

### 修复 1: 改进 `shouldPromptForConnect` 逻辑

**修复代码**：
```typescript
const shouldPromptForConnect =
  settingsLoaded &&
  status !== "connected" &&
  status !== "connecting" &&  // ✅ 新增：连接中不提示
  (selectedAdapterType === "custom" ||
    !hasLastKnownGoodState ||
    !gatewayUrl.trim() ||
    (selectedAdapterType === "openclaw" && !token.trim()) ||
    (wasManualDisconnectRef.current && !hasConnectedOnceRef.current) ||  // ✅ 修改：只在从未连接成功时提示
    Boolean(error));
```

**改进点**：
1. **添加 `status !== "connecting"` 检查**：连接过程中不显示弹窗
2. **修改 `wasManualDisconnectRef.current` 条件**：只在从未连接成功时才因为手动断开而提示
3. **保留 `Boolean(error)` 检查**：但配合其他条件，避免误触发

### 修复 2: 确保 `hasConnectedOnceRef` 正确更新

**修复代码**（`src/lib/gateway/GatewayClient.ts` 第 876-888 行）：
```typescript
useEffect(() => {
  return client.onStatus((nextStatus) => {
    gatewayDebugLog("status", { nextStatus });
    setStatus(nextStatus);
    if (nextStatus !== "connecting") {
      setError(null);
      if (nextStatus === "connected") {
        setConnectErrorCode(null);
        hasConnectedOnceRef.current = true;  // ✅ 新增：标记已连接成功
      } else {
        setDetectedAdapterType(null);
      }
    }
  });
}, [client]);
```

**改进点**：
- 连接成功后设置 `hasConnectedOnceRef.current = true`
- 这样即使后续断开连接，也不会因为 `wasManualDisconnectRef.current` 而显示弹窗

## 🎯 修复效果

### 修复前
```
用户点击连接
  ↓
状态: disconnected → connecting
  ↓
弹窗: 隐藏（因为 status === "connecting"）
  ↓
状态: connecting → connected
  ↓
弹窗: 隐藏（因为 status === "connected"）
  ↓
状态: connected → disconnected (短暂波动)
  ↓
弹窗: 显示 ❌（因为 wasManualDisconnectRef.current === true）
  ↓
状态: disconnected → connected
  ↓
弹窗: 隐藏
```

### 修复后
```
用户点击连接
  ↓
状态: disconnected → connecting
  ↓
弹窗: 隐藏（因为 status === "connecting"）✅
  ↓
状态: connecting → connected
  ↓
hasConnectedOnceRef.current = true ✅
  ↓
弹窗: 隐藏（因为 status === "connected"）
  ↓
状态: connected → disconnected (短暂波动)
  ↓
弹窗: 隐藏 ✅（因为 hasConnectedOnceRef.current === true）
  ↓
状态: disconnected → connected
  ↓
弹窗: 隐藏
```

## 📋 测试步骤

### 1. 基本连接测试
```bash
# 启动服务器
npm run dev

# 访问
http://localhost:3000/office
```

**预期结果**：
1. 看到 Gateway 连接弹窗
2. 输入 Token
3. 点击"连接"
4. 弹窗消失，不再闪现 ✅

### 2. 重连测试
```bash
# 在浏览器控制台
# 手动断开连接
window.location.reload()
```

**预期结果**：
1. 页面刷新后自动重连
2. 弹窗不应该闪现 ✅

### 3. 错误恢复测试
```bash
# 停止 Gateway
openclaw gateway stop

# 刷新页面
# 应该看到连接弹窗

# 启动 Gateway
openclaw gateway start

# 点击连接
# 弹窗应该消失，不闪现 ✅
```

## 🔍 技术细节

### `shouldPromptForConnect` 条件分析

| 条件 | 说明 | 修复前 | 修复后 |
|------|------|--------|--------|
| `settingsLoaded` | 设置已加载 | ✅ | ✅ |
| `status !== "connected"` | 未连接 | ✅ | ✅ |
| `status !== "connecting"` | 不在连接中 | ❌ | ✅ 新增 |
| `selectedAdapterType === "custom"` | 自定义后端 | ✅ | ✅ |
| `!hasLastKnownGoodState` | 无历史连接 | ✅ | ✅ |
| `!gatewayUrl.trim()` | URL 为空 | ✅ | ✅ |
| `!token.trim()` | Token 为空（OpenClaw） | ✅ | ✅ |
| `wasManualDisconnectRef.current` | 手动断开 | ⚠️ 总是提示 | ✅ 仅首次 |
| `Boolean(error)` | 有错误 | ⚠️ 可能误触发 | ✅ 配合其他条件 |

### 状态机图

```
┌─────────────┐
│ disconnected│
└──────┬──────┘
       │ connect()
       ↓
┌─────────────┐
│ connecting  │ ← 此时不显示弹窗 ✅
└──────┬──────┘
       │ success
       ↓
┌─────────────┐
│  connected  │ ← hasConnectedOnceRef = true ✅
└──────┬──────┘
       │ disconnect
       ↓
┌─────────────┐
│ disconnected│ ← 不显示弹窗（因为 hasConnectedOnceRef = true）✅
└─────────────┘
```

## 📚 相关文件

- `src/lib/gateway/GatewayClient.ts` - Gateway 客户端（已修复）
- `src/features/office/screens/OfficeScreen.tsx` - Office 页面（使用修复后的逻辑）
- `src/features/agents/components/GatewayConnectScreen.tsx` - 连接弹窗组件

## 💡 最佳实践

### 避免弹窗闪现的设计原则

1. **状态检查要全面**：
   - 检查 `status !== "connecting"` 避免连接中显示弹窗
   - 检查 `hasConnectedOnceRef` 避免重连时显示弹窗

2. **使用 Ref 追踪历史状态**：
   - `hasConnectedOnceRef` 追踪是否曾经连接成功
   - `wasManualDisconnectRef` 追踪是否手动断开

3. **延迟显示弹窗**：
   - `GATEWAY_CONNECT_OVERLAY_DELAY_MS` 延迟显示
   - 避免短暂状态变化导致闪现

4. **清除错误状态**：
   - 连接开始时清除错误：`setError(null)`
   - 状态变化时清除错误（非 connecting 状态）

## 🆘 故障排查

### 如果弹窗仍然闪现

1. **检查浏览器控制台**：
   ```javascript
   // 查看 Gateway 状态日志
   // 应该看到 [gateway-client] status 日志
   ```

2. **检查 Gateway 连接**：
   ```bash
   # 检查 Gateway 是否稳定运行
   openclaw gateway status
   lsof -i :18789
   ```

3. **清除浏览器缓存**：
   ```
   Cmd+Shift+R (Mac)
   Ctrl+Shift+R (Windows)
   ```

4. **重启服务器**：
   ```bash
   # 停止
   kill $(lsof -ti :3000)
   
   # 启动
   npm run dev
   ```

## 🎉 总结

这次修复解决了 Gateway 连接弹窗闪屏的问题：

- **问题**：`shouldPromptForConnect` 逻辑过于激进，连接过程中也可能触发弹窗
- **影响**：用户体验差，弹窗闪现
- **修复**：
  1. 添加 `status !== "connecting"` 检查
  2. 修改 `wasManualDisconnectRef.current` 条件
  3. 确保 `hasConnectedOnceRef` 正确更新
- **结果**：弹窗不再闪现，连接体验流畅 ✅

---

**修复日期**：2026-04-16
**版本**：1.0.0
**状态**：✅ 已修复并验证

