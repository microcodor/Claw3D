#!/bin/bash

# Claw3D 快速部署脚本
# 使用方法: ./quick-deploy.sh

set -e

echo "=========================================="
echo "Claw3D 快速部署到 192.168.0.132"
echo "=========================================="
echo ""

# 配置
SERVER="openclaw1@192.168.0.132"
REMOTE_DIR="/home/openclaw1/claw3d"

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查 SSH 连接
echo -e "${YELLOW}测试 SSH 连接...${NC}"
if ! ssh -o ConnectTimeout=5 ${SERVER} "echo 'OK'" &>/dev/null; then
    echo -e "${RED}无法连接到服务器！${NC}"
    echo "请确保:"
    echo "  1. 服务器在线"
    echo "  2. SSH 服务运行中"
    echo "  3. 已配置 SSH 密钥或可以输入密码"
    exit 1
fi
echo -e "${GREEN}✓ SSH 连接成功${NC}"
echo ""

# 同步文件
echo -e "${YELLOW}同步文件到服务器...${NC}"
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    --exclude 'logs' \
    ./ ${SERVER}:${REMOTE_DIR}/

echo -e "${GREEN}✓ 文件同步完成${NC}"
echo ""

# 远程部署
echo -e "${YELLOW}在服务器上执行部署...${NC}"
ssh ${SERVER} << 'ENDSSH'
    set -e
    cd /home/openclaw1/claw3d
    
    echo "1. 获取 OpenClaw Gateway Token..."
    GATEWAY_TOKEN=$(openclaw config get gateway.auth.token 2>/dev/null || echo "")
    if [ -n "$GATEWAY_TOKEN" ]; then
        sed -i "s|^CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=${GATEWAY_TOKEN}|g" .env
        echo "   ✓ Gateway Token 已更新"
    else
        echo "   ⚠ 无法获取 Gateway Token，请手动配置"
    fi
    
    echo "2. 安装依赖..."
    npm install --production=false
    
    echo "3. 构建项目..."
    npm run build
    
    echo "4. 重启 PM2 服务..."
    pm2 stop claw3d 2>/dev/null || true
    pm2 delete claw3d 2>/dev/null || true
    
    # 创建日志目录
    mkdir -p logs
    
    # 使用 ecosystem.config.js 启动（如果存在）
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start npm --name "claw3d" -- start
    fi
    
    pm2 save
    
    echo "5. 检查服务状态..."
    pm2 list
    
    echo ""
    echo "=========================================="
    echo "部署完成！"
    echo "=========================================="
    echo ""
    echo "访问地址:"
    echo "  http://192.168.0.132:3000"
    echo ""
    echo "查看日志:"
    echo "  pm2 logs claw3d"
    echo ""
ENDSSH

echo -e "${GREEN}✓ 部署完成！${NC}"
echo ""
echo "下一步:"
echo "  1. 访问 http://192.168.0.132:3000"
echo "  2. 输入 STUDIO_ACCESS_TOKEN (在 .env 中配置的)"
echo "  3. 连接到 Gateway"
echo "  4. 批准设备: ssh ${SERVER} 'openclaw devices approve --latest'"
echo ""
