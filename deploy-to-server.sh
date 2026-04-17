#!/bin/bash

# Claw3D 部署脚本
# 目标服务器: 192.168.0.132
# 用户: openclaw1

set -e

SERVER_HOST="192.168.0.132"
SERVER_USER="openclaw1"
SERVER_PORT="22"
REMOTE_DIR="/home/openclaw1/claw3d"
PROJECT_NAME="claw3d"

echo "=========================================="
echo "Claw3D 部署脚本"
echo "目标服务器: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PORT}"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查本地文件
echo -e "${YELLOW}[1/8] 检查本地文件...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}错误: .env 文件不存在${NC}"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: package.json 文件不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 本地文件检查完成${NC}"
echo ""

# 测试 SSH 连接
echo -e "${YELLOW}[2/8] 测试 SSH 连接...${NC}"
if ! ssh -p ${SERVER_PORT} -o ConnectTimeout=10 ${SERVER_USER}@${SERVER_HOST} "echo '连接成功'" 2>/dev/null; then
    echo -e "${RED}错误: 无法连接到服务器${NC}"
    echo "请确保:"
    echo "  1. 服务器 IP 地址正确"
    echo "  2. SSH 服务正在运行"
    echo "  3. 防火墙允许 SSH 连接"
    echo "  4. 已配置 SSH 密钥或可以使用密码登录"
    exit 1
fi
echo -e "${GREEN}✓ SSH 连接测试成功${NC}"
echo ""

# 检查服务器环境
echo -e "${YELLOW}[3/8] 检查服务器环境...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    echo "检查 Node.js..."
    if ! command -v node &> /dev/null; then
        echo "错误: 服务器上未安装 Node.js"
        exit 1
    fi
    NODE_VERSION=$(node -v)
    echo "✓ Node.js 版本: ${NODE_VERSION}"
    
    echo "检查 npm..."
    if ! command -v npm &> /dev/null; then
        echo "错误: 服务器上未安装 npm"
        exit 1
    fi
    NPM_VERSION=$(npm -v)
    echo "✓ npm 版本: ${NPM_VERSION}"
    
    echo "检查 PM2..."
    if ! command -v pm2 &> /dev/null; then
        echo "错误: 服务器上未安装 PM2"
        exit 1
    fi
    PM2_VERSION=$(pm2 -v)
    echo "✓ PM2 版本: ${PM2_VERSION}"
    
    echo "检查 OpenClaw..."
    if ! command -v openclaw &> /dev/null; then
        echo "警告: 服务器上未安装 OpenClaw"
    else
        OPENCLAW_VERSION=$(openclaw --version 2>/dev/null || echo "未知")
        echo "✓ OpenClaw 版本: ${OPENCLAW_VERSION}"
    fi
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}服务器环境检查失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 服务器环境检查完成${NC}"
echo ""

# 创建远程目录
echo -e "${YELLOW}[4/8] 创建远程目录...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${REMOTE_DIR}"
echo -e "${GREEN}✓ 远程目录创建完成${NC}"
echo ""

# 同步文件到服务器
echo -e "${YELLOW}[5/8] 同步文件到服务器...${NC}"
echo "正在上传文件，这可能需要几分钟..."

rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'dist' \
    --exclude 'build' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    -e "ssh -p ${SERVER_PORT}" \
    ./ ${SERVER_USER}@${SERVER_HOST}:${REMOTE_DIR}/

if [ $? -ne 0 ]; then
    echo -e "${RED}文件同步失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 文件同步完成${NC}"
echo ""

# 获取 OpenClaw Gateway Token
echo -e "${YELLOW}[6/8] 获取 OpenClaw Gateway Token...${NC}"
GATEWAY_TOKEN=$(ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} "openclaw config get gateway.auth.token 2>/dev/null" || echo "")

if [ -z "$GATEWAY_TOKEN" ]; then
    echo -e "${YELLOW}警告: 无法自动获取 Gateway Token${NC}"
    echo "请手动在服务器上运行: openclaw config get gateway.auth.token"
    echo "然后更新 .env 文件中的 CLAW3D_GATEWAY_TOKEN"
else
    echo -e "${GREEN}✓ Gateway Token 已获取${NC}"
    # 更新远程 .env 文件
    ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << ENDSSH
        cd ${REMOTE_DIR}
        sed -i "s|^CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=${GATEWAY_TOKEN}|g" .env
        echo "✓ .env 文件已更新 Gateway Token"
ENDSSH
fi
echo ""

# 安装依赖并构建
echo -e "${YELLOW}[7/8] 安装依赖并构建项目...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd /home/openclaw1/claw3d
    
    echo "安装 npm 依赖..."
    npm install --production=false
    
    if [ $? -ne 0 ]; then
        echo "错误: npm install 失败"
        exit 1
    fi
    
    echo "构建生产版本..."
    npm run build
    
    if [ $? -ne 0 ]; then
        echo "错误: npm run build 失败"
        exit 1
    fi
    
    echo "✓ 构建完成"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}构建失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 依赖安装和构建完成${NC}"
echo ""

# 使用 PM2 启动服务
echo -e "${YELLOW}[8/8] 使用 PM2 启动服务...${NC}"
ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    cd /home/openclaw1/claw3d
    
    # 停止旧的进程（如果存在）
    pm2 stop claw3d 2>/dev/null || true
    pm2 delete claw3d 2>/dev/null || true
    
    # 启动新进程
    pm2 start npm --name "claw3d" -- start
    
    # 保存 PM2 配置
    pm2 save
    
    # 显示状态
    pm2 list
    
    echo ""
    echo "✓ Claw3D 已启动"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}PM2 启动失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PM2 启动完成${NC}"
echo ""

# 显示访问信息
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""
echo "访问地址:"
echo "  本地: http://localhost:3000"
echo "  局域网: http://192.168.0.132:3000"
echo ""
echo "查看日志:"
echo "  ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 logs claw3d'"
echo ""
echo "管理服务:"
echo "  重启: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 restart claw3d'"
echo "  停止: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 stop claw3d'"
echo "  状态: ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 status'"
echo ""
echo "重要提醒:"
echo "  1. 首次访问需要输入 STUDIO_ACCESS_TOKEN"
echo "  2. 连接后需要批准设备: openclaw devices approve --latest"
echo "  3. 确保防火墙开放端口 3000"
echo ""
