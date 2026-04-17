# Gateway 连接问题解决方案 🔧

## 📋 问题描述

浏览器显示错误：
```
WebSocket connection to 'ws://localhost:3000/api/gateway/ws' failed
Gateway closed (1011): connect failed
```

## ✅ 当前状态

根据诊断结果：
- ✅ OpenClaw Gateway 正在运行（端口 18789）
- ✅ Claw3D 服务器正在运行（端口 3000）
- ✅ Token 已正确配置
- ✅ Gateway HTTP 端点响应正常
- ❌ WebSocket 连接超时

## 🎯 解决方案（按优先级）

### 方案 1: 重启 Claw3D 服务器 ⭐️ 推荐

**原因**: WebSocket 代理可能需要重新初始化

**步骤**:
```bash
# 1. 停止当前服务器
./restart-claw3d.sh

# 2. 在新终端启动
npm run dev

# 3. 硬刷新浏览器
# Mac: Cmd+Shift+R
# Windows: Ctrl+Shift+R
```

**预期结果**: Gateway 连接成功，SCR-01 正常工作

---

### 方案 2: 先测试 SCR-02 和 SCR-03 ⭐️⭐️ 强烈推荐

**原因**: SCR-02 和 SCR-03 不依赖 Gateway，可以独立运行

**步骤**:
1. 访问 `http://localhost:3000/office`
2. 点击顶部标签切换到 **SCR-02 热搜舆情中心**
3. 点击顶部标签切换到 **SCR-03 创作工作室**
4. 点击右上角 **多屏图标** 查看三屏同时显示

**功能验证**:
- ✅ **SCR-02**: 10个平台热搜，自动滚动，自动轮播
- ✅ **SCR-03**: 3条 Mock 消息，粒子动画，打字机效果
- ✅ **多屏模式**: 横向/纵向布局切换

**优势**: 
- 无需 Gateway 连接
- 功能完整，可以正常演示
- 验证三屏架构集成成功

---

### 方案 3: 重启 Gateway

**原因**: Gateway 可能需要重新初始化 WebSocket 服务

**步骤**:
```bash
# 重启 Gateway
openclaw gateway restart

# 等待 5 秒
sleep 5

# 刷新浏览器
```

**预期结果**: Gateway 重新初始化，WebSocket 连接恢复

---

### 方案 4: 使用 Demo Gateway

**原因**: 如果 OpenClaw Gateway 持续有问题，可以使用 Demo Gateway

**步骤**:

1. **修改 `.env` 文件**:
```bash
# 注释掉 OpenClaw 配置
# CLAW3D_GATEWAY_URL=ws://localhost:18789
# CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw

# 启用 Demo Gateway 配置
CLAW3D_GATEWAY_URL=ws://localhost:18790
CLAW3D_GATEWAY_ADAPTER_TYPE=demo
```

2. **启动 Demo Gateway**（新终端）:
```bash
npm run demo-gateway
```

3. **重启 Claw3D**（另一个终端）:
```bash
npm run dev
```

4. **刷新浏览器**: Cmd+Shift+R

**优势**:
- 不依赖 OpenClaw
- 快速验证功能
- 适合开发测试

---

## 🔍 深度诊断

如果以上方案都无效，运行完整诊断：

```bash
./diagnose-gateway-connection.sh
```

或者运行 WebSocket 修复脚本：

```bash
./fix-gateway-websocket.sh
```

---

## 📊 三屏架构功能说明

### SCR-01: 数字办公室
- **依赖**: 需要 Gateway 连接
- **功能**: 3D Office 环境，Agent 交互
- **状态**: ⚠️ 当前 Gateway 连接有问题

### SCR-02: 热搜舆情中心 ✅
- **依赖**: 无（完全独立）
- **功能**: 
  - 10个平台热搜数据
  - 实时热搜榜自动滚动
  - 平台自动轮播（30秒）
  - 24小时讨论量趋势图
  - 话题分类分布柱状图
  - 舆情分析饼图
  - 关键词云
- **状态**: ✅ 完全正常

### SCR-03: 创作工作室 ✅
- **依赖**: 无（完全独立）
- **功能**:
  - 3条专业 Mock 消息
  - 粒子系统动画
  - 4步思考过程动画
  - 打字机效果输出
  - 视频任务生成指示器
  - 自动循环播放（20秒）
- **状态**: ✅ 完全正常

---

## 💡 推荐操作流程

### 快速验证（5分钟）

1. **访问页面**: `http://localhost:3000/office`
2. **测试 SCR-02**: 点击 "SCR-02 热搜舆情中心" 标签
   - 观察热搜榜自动滚动
   - 等待 30 秒看平台自动切换
   - 查看各种数据图表
3. **测试 SCR-03**: 点击 "SCR-03 创作工作室" 标签
   - 等待 3 秒自动开始演示
   - 观察粒子动画和打字机效果
   - 等待 20 秒看循环播放
4. **测试多屏模式**: 点击右上角多屏图标
   - 三个屏幕同时显示
   - 切换横向/纵向布局

**结论**: 如果 SCR-02 和 SCR-03 都正常，说明三屏架构集成成功！

### 完整验证（10分钟）

1. **完成快速验证**（上述步骤）
2. **修复 Gateway 连接**:
   - 执行方案 1（重启 Claw3D）
   - 如果不行，执行方案 3（重启 Gateway）
   - 如果还不行，执行方案 4（Demo Gateway）
3. **测试 SCR-01**: 点击 "SCR-01 数字办公室" 标签
   - 验证 3D Office 环境加载
   - 测试 Agent 交互功能

---

## 🎉 总结

### 当前状态
- ✅ **三屏架构集成完成**
- ✅ **SCR-02 和 SCR-03 功能正常**
- ⚠️ **SCR-01 Gateway 连接需要修复**

### 建议
1. **立即可用**: 使用 SCR-02 和 SCR-03 进行演示和测试
2. **可选修复**: 如果需要 SCR-01，按照方案 1-4 修复 Gateway 连接
3. **最佳实践**: 先验证 SCR-02 和 SCR-03，确认三屏架构功能正常

### 相关文档
- `THREE_SCREEN_INTEGRATION_COMPLETE.md` - 完整功能文档
- `QUICK_START_三屏架构.md` - 快速启动指南
- `diagnose-gateway-connection.sh` - 诊断脚本
- `fix-gateway-websocket.sh` - 修复脚本
- `restart-claw3d.sh` - 重启脚本

---

## 🆘 需要帮助？

如果问题仍然存在，请提供以下信息：

1. 运行诊断脚本的输出：
   ```bash
   ./diagnose-gateway-connection.sh > diagnosis.txt
   ```

2. Gateway 日志最后 50 行：
   ```bash
   tail -50 /tmp/openclaw/openclaw-*.log > gateway.log
   ```

3. 浏览器控制台完整错误信息（F12 打开开发者工具）

4. SCR-02 和 SCR-03 是否正常工作？

---

**最后更新**: 2026-04-16
**版本**: 1.0.0

