#!/bin/bash

# Claw3D 快速修复和重启脚本
# 使用方法: bash fix-and-restart.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "Claw3D 快速修复和重启"
echo "=========================================="
echo ""

cd ~/claw3d

# 1. 停止服务
echo -e "${YELLOW}[1/7] 停止旧服务...${NC}"
pm2 stop claw3d 2>/dev/null || true
pm2 delete claw3d 2>/dev/null || true
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 2. 检查并修复 .env
echo -e "${YELLOW}[2/7] 检查 .env 配置...${NC}"
if [ ! -f ".env" ]; then
    echo "创建 .env 文件..."
    cp .env.example .env
fi

# 确保关键配置正确
grep -q "^HOST=" .env || echo "HOST=0.0.0.0" >> .env
grep -q "^PORT=" .env || echo "PORT=3000" >> .env

# 修复 HOST 配置
sed -i 's/^HOST=.*/HOST=0.0.0.0/g' .env
sed -i 's/^# *HOST=.*/HOST=0.0.0.0/g' .env

# 修复 PORT 配置
sed -i 's/^PORT=.*/PORT=3000/g' .env
sed -i 's/^# *PORT=.*/PORT=3000/g' .env

# 修复 Gateway URL
sed -i 's|^# *CLAW3D_GATEWAY_URL=.*|CLAW3D_GATEWAY_URL=ws://localhost:18789|g' .env
grep -q "^CLAW3D_GATEWAY_URL=" .env || echo "CLAW3D_GATEWAY_URL=ws://localhost:18789" >> .env

# 修复 Adapter Type
sed -i 's|^# *CLAW3D_GATEWAY_ADAPTER_TYPE=.*|CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw|g' .env
grep -q "^CLAW3D_GATEWAY_ADAPTER_TYPE=" .env || echo "CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw" >> .env

# 获取 Gateway Token
if command -v openclaw &> /dev/null; then
    TOKEN=$(openclaw config get gateway.auth.token 2>/dev/null || echo "")
    if [ -n "$TOKEN" ]; then
        sed -i "s|^CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=${TOKEN}|g" .env
        sed -i "s|^# *CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=${TOKEN}|g" .env
        echo -e "${GREEN}✓ Gateway Token 已更新${NC}"
    fi
fi

# 检查 STUDIO_ACCESS_TOKEN
if ! grep -q "^STUDIO_ACCESS_TOKEN=" .env || grep -q "^STUDIO_ACCESS_TOKEN=$" .env; then
    echo "STUDIO_ACCESS_TOKEN=SecureToken$(date +%s)" >> .env
    echo -e "${YELLOW}⚠ 已生成临时 STUDIO_ACCESS_TOKEN，建议稍后修改${NC}"
fi

echo -e "${GREEN}✓ .env 配置已修复${NC}"
echo ""

# 3. 清理旧文件
echo -e "${YELLOW}[3/7] 清理旧的构建文件...${NC}"
rm -rf .next
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 4. 安装依赖
echo -e "${YELLOW}[4/7] 安装依赖...${NC}"
npm install
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 5. 构建项目
echo -e "${YELLOW}[5/7] 构建项目...${NC}"
npm run build
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 6. 启动服务
echo -e "${YELLOW}[6/7] 启动服务...${NC}"
pm2 start npm --name "claw3d" -- start
pm2 save
echo -e "${GREEN}✓ 完成${NC}"
echo ""

# 7. 等待服务启动
echo -e "${YELLOW}[7/7] 等待服务启动...${NC}"
sleep 5

# 检查服务状态
if pm2 list | grep -q "claw3d.*online"; then
    echo -e "${GREEN}✓ 服务启动成功！${NC}"
else
    echo -e "${RED}✗ 服务启动可能失败${NC}"
    echo "查看日志: pm2 logs claw3d"
fi
echo ""

# 显示状态
echo "=========================================="
echo "服务状态"
echo "=========================================="
pm2 list
echo ""

# 显示访问信息
IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "192.168.0.132")
echo "=========================================="
echo "访问信息"
echo "=========================================="
echo "本地: http://localhost:3000"
echo "局域网: http://$IP_ADDR:3000"
echo ""

# 测试本地访问
echo "测试本地访问..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✓ 本地访问正常 (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}✗ 本地访问失败 (HTTP $HTTP_CODE)${NC}"
    echo "查看日志: pm2 logs claw3d"
fi
echo ""

# 检查端口监听
echo "检查端口监听..."
if netstat -tulpn 2>/dev/null | grep -q ":3000" || ss -tulpn 2>/dev/null | grep -q ":3000"; then
    LISTEN_ADDR=$(netstat -tulpn 2>/dev/null | grep ":3000" | awk '{print $4}' || ss -tulpn 2>/dev/null | grep ":3000" | awk '{print $5}')
    if echo "$LISTEN_ADDR" | grep -q "0.0.0.0:3000"; then
        echo -e "${GREEN}✓ 监听地址: 0.0.0.0:3000 (允许外部访问)${NC}"
    elif echo "$LISTEN_ADDR" | grep -q "127.0.0.1:3000"; then
        echo -e "${RED}✗ 监听地址: 127.0.0.1:3000 (仅本地访问)${NC}"
        echo "问题: 检查 .env 中的 HOST 配置"
    else
        echo -e "${YELLOW}⚠ 监听地址: $LISTEN_ADDR${NC}"
    fi
else
    echo -e "${RED}✗ 端口 3000 未监听${NC}"
fi
echo ""

# 防火墙提醒
echo "=========================================="
echo "防火墙配置"
echo "=========================================="
echo "如果仍无法从局域网访问，请开放防火墙端口:"
echo ""
if command -v ufw &> /dev/null; then
    echo "sudo ufw allow 3000/tcp"
    echo "sudo ufw status"
elif command -v firewall-cmd &> /dev/null; then
    echo "sudo firewall-cmd --permanent --add-port=3000/tcp"
    echo "sudo firewall-cmd --reload"
    echo "sudo firewall-cmd --list-ports"
fi
echo ""

# OpenClaw 提醒
echo "=========================================="
echo "OpenClaw 设备批准"
echo "=========================================="
echo "首次连接后，需要批准设备:"
echo "openclaw devices list"
echo "openclaw devices approve --latest"
echo ""

echo "=========================================="
echo "查看日志"
echo "=========================================="
echo "pm2 logs claw3d --lines 50"
echo ""

echo -e "${GREEN}修复完成！${NC}"
echo ""
