#!/bin/bash

# Claw3D 服务器诊断脚本
# 用于排查 ERR_SSL_PROTOCOL_ERROR 和其他连接问题

echo "=========================================="
echo "  Claw3D 服务器诊断"
echo "=========================================="
echo ""
echo "诊断时间: $(date)"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查 PM2 服务状态
echo "1️⃣  检查 PM2 服务状态"
echo "----------------------------------------"
if command -v pm2 &> /dev/null; then
    pm2 list
    echo ""
    PM2_STATUS=$(pm2 jlist | jq -r '.[0].pm2_env.status' 2>/dev/null)
    if [ "$PM2_STATUS" = "online" ]; then
        echo -e "${GREEN}✓${NC} PM2 服务运行正常"
    else
        echo -e "${RED}✗${NC} PM2 服务状态异常: $PM2_STATUS"
    fi
else
    echo -e "${RED}✗${NC} PM2 未安装"
fi
echo ""

# 2. 检查端口监听
echo "2️⃣  检查端口监听"
echo "----------------------------------------"
if lsof -i :3000 &> /dev/null; then
    echo -e "${GREEN}✓${NC} 端口 3000 正在监听"
    lsof -i :3000
else
    echo -e "${RED}✗${NC} 端口 3000 未监听"
    echo "提示: 服务可能未启动或使用了其他端口"
fi
echo ""

# 3. 检查 .env 配置
echo "3️⃣  检查 .env 配置"
echo "----------------------------------------"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env 文件存在"
    echo ""
    echo "关键配置:"
    grep -E "^PORT=|^HOST=|^HTTPS=" .env || echo "未找到 PORT/HOST/HTTPS 配置"
    echo ""
    
    # 检查是否有 HTTPS 配置
    if grep -q "^HTTPS=true" .env; then
        echo -e "${YELLOW}⚠${NC} 警告: 检测到 HTTPS=true 配置"
        echo "   这可能导致 ERR_SSL_PROTOCOL_ERROR 错误"
        echo "   建议: 注释掉或删除 HTTPS=true"
    else
        echo -e "${GREEN}✓${NC} 未检测到 HTTPS 强制配置"
    fi
else
    echo -e "${RED}✗${NC} .env 文件不存在"
fi
echo ""

# 4. 获取本机 IP
echo "4️⃣  获取本机 IP 地址"
echo "----------------------------------------"
LOCAL_IP=$(ip addr show 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1 | head -n 1)
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP=$(ifconfig 2>/dev/null | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
fi

if [ -n "$LOCAL_IP" ]; then
    echo -e "${GREEN}✓${NC} 本机局域网 IP: $LOCAL_IP"
    echo "   访问地址: http://$LOCAL_IP:3000/office"
else
    echo -e "${YELLOW}⚠${NC} 无法获取局域网 IP"
fi
echo ""

# 5. 测试本地 HTTP 连接
echo "5️⃣  测试本地 HTTP 连接"
echo "----------------------------------------"
echo "测试: http://localhost:3000/office"
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/office 2>&1)
if [ "$HTTP_RESPONSE" = "200" ] || [ "$HTTP_RESPONSE" = "304" ]; then
    echo -e "${GREEN}✓${NC} HTTP 连接成功 (状态码: $HTTP_RESPONSE)"
    echo ""
    echo "响应头:"
    curl -I http://localhost:3000/office 2>&1 | head -n 10
else
    echo -e "${RED}✗${NC} HTTP 连接失败 (状态码: $HTTP_RESPONSE)"
    echo ""
    echo "详细信息:"
    curl -v http://localhost:3000/office 2>&1 | head -n 20
fi
echo ""

# 6. 测试局域网 IP 连接
if [ -n "$LOCAL_IP" ]; then
    echo "6️⃣  测试局域网 IP 连接"
    echo "----------------------------------------"
    echo "测试: http://$LOCAL_IP:3000/office"
    LAN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$LOCAL_IP:3000/office 2>&1)
    if [ "$LAN_RESPONSE" = "200" ] || [ "$LAN_RESPONSE" = "304" ]; then
        echo -e "${GREEN}✓${NC} 局域网连接成功 (状态码: $LAN_RESPONSE)"
    else
        echo -e "${RED}✗${NC} 局域网连接失败 (状态码: $LAN_RESPONSE)"
    fi
    echo ""
fi

# 7. 检查防火墙状态
echo "7️⃣  检查防火墙状态"
echo "----------------------------------------"
if command -v ufw &> /dev/null; then
    echo "UFW 防火墙:"
    sudo ufw status 2>/dev/null | grep -E "Status|3000" || echo "UFW 未启用或无权限查看"
elif command -v firewall-cmd &> /dev/null; then
    echo "Firewalld 防火墙:"
    sudo firewall-cmd --list-ports 2>/dev/null | grep 3000 || echo "端口 3000 未开放或无权限查看"
else
    echo "未检测到常见防火墙工具"
fi
echo ""

# 8. 检查 HTTPS 相关配置
echo "8️⃣  检查 HTTPS 相关配置"
echo "----------------------------------------"
if [ -d ".certs" ]; then
    echo -e "${YELLOW}⚠${NC} 检测到 .certs 目录（SSL 证书目录）"
    ls -la .certs/
    echo ""
fi

if [ -f "next.config.js" ]; then
    if grep -q "https" next.config.js; then
        echo -e "${YELLOW}⚠${NC} next.config.js 中包含 https 配置"
        grep -n "https" next.config.js
    fi
fi

if [ -f "next.config.mjs" ]; then
    if grep -q "https" next.config.mjs; then
        echo -e "${YELLOW}⚠${NC} next.config.mjs 中包含 https 配置"
        grep -n "https" next.config.mjs
    fi
fi
echo ""

# 9. 查看最近日志
echo "9️⃣  查看最近日志（最后 20 行）"
echo "----------------------------------------"
if command -v pm2 &> /dev/null; then
    pm2 logs claw3d --lines 20 --nostream 2>&1 | tail -n 20
else
    echo "PM2 未安装，无法查看日志"
fi
echo ""

# 10. 检查 Node.js 版本
echo "🔟  检查 Node.js 版本"
echo "----------------------------------------"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js 版本: $NODE_VERSION"
    
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "${GREEN}✓${NC} Node.js 版本符合要求 (>= 20.0.0)"
    else
        echo -e "${RED}✗${NC} Node.js 版本过低，需要 >= 20.0.0"
    fi
else
    echo -e "${RED}✗${NC} Node.js 未安装"
fi
echo ""

# 11. 网络连通性测试
echo "1️⃣1️⃣  网络连通性测试"
echo "----------------------------------------"
echo "测试端口 3000 是否可访问:"
if nc -zv localhost 3000 2>&1 | grep -q "succeeded"; then
    echo -e "${GREEN}✓${NC} localhost:3000 可访问"
else
    echo -e "${RED}✗${NC} localhost:3000 不可访问"
fi

if [ -n "$LOCAL_IP" ]; then
    if nc -zv $LOCAL_IP 3000 2>&1 | grep -q "succeeded"; then
        echo -e "${GREEN}✓${NC} $LOCAL_IP:3000 可访问"
    else
        echo -e "${RED}✗${NC} $LOCAL_IP:3000 不可访问"
    fi
fi
echo ""

# 总结
echo "=========================================="
echo "  诊断总结"
echo "=========================================="
echo ""

echo "📋 关键信息:"
echo "  • 本机 IP: ${LOCAL_IP:-未知}"
echo "  • 访问地址: http://${LOCAL_IP:-192.168.0.x}:3000/office"
echo ""

echo "🔍 常见问题检查:"
echo ""

# 检查服务状态
if [ "$PM2_STATUS" = "online" ]; then
    echo -e "  ${GREEN}✓${NC} 服务运行正常"
else
    echo -e "  ${RED}✗${NC} 服务未运行或状态异常"
    echo "     解决: pm2 restart claw3d"
fi

# 检查端口监听
if lsof -i :3000 &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} 端口监听正常"
else
    echo -e "  ${RED}✗${NC} 端口未监听"
    echo "     解决: 检查服务是否启动"
fi

# 检查 HTTPS 配置
if grep -q "^HTTPS=true" .env 2>/dev/null; then
    echo -e "  ${RED}✗${NC} 检测到 HTTPS 强制配置"
    echo "     解决: 编辑 .env，注释掉 HTTPS=true"
else
    echo -e "  ${GREEN}✓${NC} 无 HTTPS 强制配置"
fi

# 检查 HTTP 连接
if [ "$HTTP_RESPONSE" = "200" ] || [ "$HTTP_RESPONSE" = "304" ]; then
    echo -e "  ${GREEN}✓${NC} HTTP 连接正常"
else
    echo -e "  ${RED}✗${NC} HTTP 连接失败"
    echo "     解决: 检查服务日志 (pm2 logs claw3d)"
fi

echo ""
echo "=========================================="
echo ""

echo "💡 如果遇到 ERR_SSL_PROTOCOL_ERROR 错误:"
echo ""
echo "1. 清除浏览器 HSTS 缓存:"
echo "   Chrome: chrome://net-internals/#hsts"
echo "   输入: $LOCAL_IP"
echo "   点击: Delete"
echo ""
echo "2. 使用隐私模式访问:"
echo "   Chrome/Edge: Ctrl+Shift+N"
echo "   Firefox: Ctrl+Shift+P"
echo ""
echo "3. 手动输入完整 URL:"
echo "   http://$LOCAL_IP:3000/office"
echo "   (必须包含 http:// 前缀)"
echo ""
echo "4. 尝试不同的浏览器"
echo ""

echo "📚 详细故障排查文档:"
echo "   ERR_SSL_PROTOCOL_ERROR故障排查.md"
echo ""

echo "=========================================="
echo "  诊断完成"
echo "=========================================="
