# Gateway 自动连接功能说明

## 🎯 功能概述

实现了 Gateway 连接的自动重连功能和手动连接按钮，提升用户体验。

## ✨ 新功能

### 1. Token 自动存储
- ✅ 连接成功时自动将 token 保存到 localStorage
- ✅ 下次启动时自动加载缓存的 token
- ✅ 静默使用缓存的 token 进行自动连接

### 2. 智能弹窗显示
- ✅ 默认不显示连接弹窗（除非连接失败）
- ✅ 首次启动时如果有缓存的 token，自动尝试连接
- ✅ 连接失败时才显示弹窗，方便用户重试

### 3. 手动连接按钮
- ✅ 在 SCR-01 右上角添加"连接"按钮
- ✅ 按钮显示当前连接状态（CONNECTED/CONNECTING/DISCONNECTED）
- ✅ 点击按钮可随时打开连接弹窗

### 4. 弹窗优化
- ✅ Token 字段默认填充缓存的 token
- ✅ 添加关闭按钮（仅在手动打开时显示）
- ✅ 连接失败时自动显示，方便重试

## 📁 文件修改

### 新增文件

#### 1. `src/lib/gateway/tokenStorage.ts`
Gateway token 存储工具函数：
- `saveGatewayToken(token, gatewayUrl)` - 保存 token 到 localStorage
- `loadGatewayToken()` - 从 localStorage 加载 token
- `clearGatewayToken()` - 清除 localStorage 中的 token
- `hasGatewayToken()` - 检查是否存在缓存的 token

### 修改文件

#### 1. `src/lib/gateway/GatewayClient.ts`
**修改内容**：
- 导入 token 存储工具函数
- 在 `loadSettings` 中加载缓存的 token
- 在 `connect` 成功后保存 token 到 localStorage
- 优先使用缓存的 token 而不是配置文件中的 token

**关键代码**：
```typescript
// 加载缓存的 token
const cachedCredentials = loadGatewayToken();

// 优先使用缓存的 token
const nextToken = cachedCredentials.token || selectedProfile.token;

// 连接成功后保存 token
saveGatewayToken(token, gatewayUrl);
```

#### 2. `src/features/agents/components/GatewayConnectScreen.tsx`
**修改内容**：
- 添加 `onClose` 可选回调 prop
- 导入 `X` 图标组件
- 在弹窗顶部添加关闭按钮（仅当 `onClose` 存在时显示）

**关键代码**：
```typescript
{onClose && (
  <div className="flex justify-end">
    <button onClick={onClose} aria-label="Close connection dialog">
      <X className="h-4 w-4" />
    </button>
  </div>
)}
```

#### 3. `src/features/office/screens/OfficeScreen.tsx`
**修改内容**：
- 添加 `manualConnectDialogOpen` 状态
- 添加 `externalManualConnectDialogOpen` 和 `onExternalManualConnectDialogOpenChange` props
- 修改 `showGatewayConnectOverlay` 逻辑，支持外部控制
- 添加 `handleCloseConnectDialog` 回调函数
- 传递 `onClose` 回调给 `GatewayConnectScreen`

**关键代码**：
```typescript
const showGatewayConnectOverlay =
  (externalManualConnectDialogOpen ?? manualConnectDialogOpen) ||
  (connectPromptReady &&
    status === "disconnected" &&
    !agentsLoaded &&
    didAttemptGatewayConnect &&
    (shouldPromptForConnect || showDelayedGatewayConnectOverlay));
```

#### 4. `src/features/office/components/MultiScreenLayout.tsx`
**修改内容**：
- 添加 `gatewayStatus` 和 `onOpenConnectDialog` props
- 导入 `Link2` 图标和 `GatewayStatus` 类型
- 添加连接状态显示逻辑（CONNECTED/CONNECTING/DISCONNECTED）
- 在右上角添加"连接"按钮
- 根据连接状态动态显示状态点颜色

**关键代码**：
```typescript
<div className={styles.statusIndicator}>
  <span className={`${styles.statusDot} ${getStatusColor()}`} />
  <span>{getStatusText()}</span>
</div>
{onOpenConnectDialog && (
  <button onClick={onOpenConnectDialog}>
    <Link2 className="h-4 w-4" />
    <span>连接</span>
  </button>
)}
```

#### 5. `src/features/office/components/multi-screen-layout.module.css`
**修改内容**：
- 移除 `.statusDot` 的固定样式（背景色、阴影、动画）
- 添加 `.connectButton` 样式
- 连接按钮使用与其他控制按钮相同的风格

**关键样式**：
```css
.connectButton {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Courier New', monospace;
}
```

#### 6. `src/app/office/page.tsx`
**修改内容**：
- 创建 `OfficePageContent` 组件来管理连接状态
- 使用 `useRuntimeConnection` hook 获取 gateway 状态
- 添加 `manualConnectDialogOpen` 状态管理
- 传递 `gatewayStatus` 和 `onOpenConnectDialog` 给 `MultiScreenLayout`
- 传递外部状态给 `OfficeScreen`

**关键代码**：
```typescript
function OfficePageContent() {
  const { status } = useRuntimeConnection(settingsCoordinator);
  const [manualConnectDialogOpen, setManualConnectDialogOpen] = useState(false);
  
  return (
    <MultiScreenLayout
      officeScreen={<OfficeScreen externalManualConnectDialogOpen={manualConnectDialogOpen} />}
      gatewayStatus={status}
      onOpenConnectDialog={() => setManualConnectDialogOpen(true)}
    />
  );
}
```

## 🔄 工作流程

### 首次启动（无缓存）
1. 应用启动
2. 检查 localStorage，没有缓存的 token
3. 不自动连接
4. 用户点击右上角"连接"按钮
5. 显示连接弹窗
6. 用户输入 token 并连接
7. 连接成功后，token 自动保存到 localStorage

### 后续启动（有缓存）
1. 应用启动
2. 从 localStorage 加载缓存的 token
3. 自动使用缓存的 token 尝试连接
4. 连接成功 → 正常使用
5. 连接失败 → 自动显示连接弹窗，token 字段已预填充

### 手动重连
1. 用户点击右上角"连接"按钮
2. 显示连接弹窗（token 字段已预填充）
3. 用户可以修改 token 或 URL
4. 点击"Connect"按钮重新连接
5. 点击关闭按钮（X）关闭弹窗

## 🎨 UI 变化

### 右上角控制栏
```
┌─────────────────────────────────────────────────────────┐
│ 网络安全学堂·AI实验室  v2.4.1  [SCR-01] [SCR-02] [SCR-03] │
│                                                         │
│                    ● CONNECTED  [🔗 连接]  [布局切换]    │
└─────────────────────────────────────────────────────────┘
```

### 连接状态指示
- 🟢 **CONNECTED** - 绿色圆点，已连接
- 🟡 **CONNECTING** - 黄色圆点（闪烁），连接中
- 🔴 **DISCONNECTED** - 红色圆点，未连接

### 连接按钮
- 图标：🔗 (Link2)
- 文字：连接
- 风格：与其他控制按钮一致
- 悬停效果：边框和文字颜色变亮

## 🔧 技术细节

### localStorage 存储
- **Key**: `claw3d_gateway_token` - 存储 token
- **Key**: `claw3d_gateway_url` - 存储 gateway URL
- **格式**: 纯文本字符串
- **生命周期**: 永久存储，直到用户清除浏览器数据

### 自动连接逻辑
1. 检查 `hasLastKnownGood` 标志
2. 如果有缓存的 token，设置 `hasLastKnownGood = true`
3. 触发自动连接流程
4. 连接成功后更新 `lastKnownGood` 配置

### 弹窗显示逻辑
```typescript
const showGatewayConnectOverlay =
  manualConnectDialogOpen ||  // 手动打开
  (connectPromptReady &&
    status === "disconnected" &&
    !agentsLoaded &&
    didAttemptGatewayConnect &&  // 尝试过连接
    (shouldPromptForConnect || showDelayedGatewayConnectOverlay));
```

## 📝 使用说明

### 用户操作流程

#### 首次使用
1. 打开应用
2. 点击右上角"连接"按钮
3. 输入 Gateway URL 和 Token
4. 点击"Connect"
5. 连接成功后，token 自动保存

#### 日常使用
1. 打开应用
2. 应用自动使用缓存的 token 连接
3. 连接成功后直接使用
4. 如需更换 token，点击"连接"按钮重新配置

#### 连接失败处理
1. 应用自动显示连接弹窗
2. Token 字段已预填充
3. 检查并修改 URL 或 Token
4. 点击"Connect"重试
5. 或点击关闭按钮（X）稍后重试

### 开发者注意事项

#### Token 安全
- Token 存储在 localStorage 中，属于客户端存储
- 不建议在生产环境中存储敏感 token
- 建议使用短期 token 或 OAuth 流程

#### 清除缓存
```javascript
// 清除缓存的 token
import { clearGatewayToken } from '@/lib/gateway/tokenStorage';
clearGatewayToken();
```

#### 检查缓存
```javascript
// 检查是否有缓存的 token
import { hasGatewayToken } from '@/lib/gateway/tokenStorage';
if (hasGatewayToken()) {
  console.log('Token cached');
}
```

## 🧪 测试建议

### 测试场景

1. **首次启动测试**
   - 清除 localStorage
   - 启动应用
   - 验证不自动连接
   - 验证弹窗不显示

2. **手动连接测试**
   - 点击"连接"按钮
   - 输入 token
   - 验证连接成功
   - 验证 token 已保存到 localStorage

3. **自动重连测试**
   - 关闭应用
   - 重新打开
   - 验证自动使用缓存的 token 连接
   - 验证连接成功

4. **连接失败测试**
   - 使用错误的 token
   - 验证连接失败
   - 验证弹窗自动显示
   - 验证 token 字段已预填充

5. **状态显示测试**
   - 验证 DISCONNECTED 状态（红色）
   - 验证 CONNECTING 状态（黄色闪烁）
   - 验证 CONNECTED 状态（绿色）

6. **弹窗关闭测试**
   - 手动打开弹窗
   - 点击关闭按钮（X）
   - 验证弹窗关闭
   - 自动显示的弹窗不应有关闭按钮

## 🐛 已知问题

### 已修复：无限循环问题

**问题描述**：
在初始实现中，由于以下原因导致无限循环：
1. `page.tsx` 中使用 `useState` 创建 `settingsCoordinator`，每次渲染都可能触发重新创建
2. `OfficeScreen.tsx` 中 `onClose` prop 的条件判断每次渲染都重新计算

**修复方案**：
1. 使用 `useMemo` 替代 `useState` 来创建 `settingsCoordinator`
2. 提前计算 `isManuallyOpened` 变量，避免在 JSX 中重复计算

**修复代码**：
```typescript
// page.tsx - 使用 useMemo
const settingsCoordinator = useMemo(() => createStudioSettingsCoordinator(), []);

// OfficeScreen.tsx - 提前计算
const isManuallyOpened = externalManualConnectDialogOpen ?? manualConnectDialogOpen;
const showGatewayConnectOverlay = isManuallyOpened || ...;
// ...
onClose={isManuallyOpened ? handleCloseConnectDialog : undefined}
```

**修复脚本**：
```bash
./fix-gateway-connect-loop.sh
```

## 🔮 未来改进

1. **Token 加密**
   - 使用加密算法存储 token
   - 提高安全性

2. **Token 过期处理**
   - 检测 token 过期
   - 自动提示用户重新登录

3. **多账户支持**
   - 支持保存多个 gateway 配置
   - 快速切换账户

4. **连接历史**
   - 记录连接历史
   - 快速选择最近使用的配置

## 📚 相关文档

- `AGENTS.md` - Agent 系统说明
- `ARCHITECTURE.md` - 架构文档
- `无限循环错误修复说明.md` - 无限循环问题修复

---

**实现日期**: 2026-04-17  
**状态**: ✅ 已完成  
**版本**: v2.4.1
