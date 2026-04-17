#!/bin/bash

# Claw3D 服务器端部署脚本
# 在服务器上直接运行此脚本
# 使用方法: bash server-deploy.sh

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
PROJECT_DIR="$HOME/claw3d"
PROJECT_REPO="https://github.com/microcodor/Claw3D.git"
PM2_APP_NAME="claw3d"

echo ""
echo "=========================================="
echo -e "${BLUE}Claw3D 服务器部署脚本${NC}"
echo "=========================================="
echo ""

# 函数：打印步骤
print_step() {
    echo -e "${YELLOW}[$1] $2${NC}"
}

# 函数：打印成功
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# 函数：打印错误
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 步骤 1: 检查环境
print_step "1/10" "检查系统环境..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js 未安装"
    echo "请先安装 Node.js 20+: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
print_success "Node.js 版本: $NODE_VERSION"

# 检查 npm
if ! command -v npm &> /dev/null; then
    print_error "npm 未安装"
    exit 1
fi
NPM_VERSION=$(npm -v)
print_success "npm 版本: $NPM_VERSION"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 未安装"
    echo "正在安装 PM2..."
    npm install -g pm2
    print_success "PM2 安装完成"
fi
PM2_VERSION=$(pm2 -v)
print_success "PM2 版本: $PM2_VERSION"

# 检查 Git
if ! command -v git &> /dev/null; then
    print_error "Git 未安装"
    echo "请先安装 Git"
    exit 1
fi
print_success "Git 已安装"

# 检查 OpenClaw
if command -v openclaw &> /dev/null; then
    OPENCLAW_VERSION=$(openclaw --version 2>/dev/null || echo "未知")
    print_success "OpenClaw 版本: $OPENCLAW_VERSION"
else
    print_error "OpenClaw 未安装（警告）"
    echo "如果需要连接 OpenClaw Gateway，请先安装 OpenClaw"
fi

echo ""

# 步骤 2: 克隆或更新项目
print_step "2/10" "获取项目代码..."

if [ -d "$PROJECT_DIR" ]; then
    echo "项目目录已存在，更新代码..."
    cd "$PROJECT_DIR"
    
    # 备份当前 .env
    if [ -f ".env" ]; then
        cp .env .env.backup
        print_success ".env 已备份到 .env.backup"
    fi
    
    # 拉取最新代码
    git pull origin main || git pull origin master || {
        print_error "Git pull 失败，尝试重新克隆..."
        cd ..
        rm -rf "$PROJECT_DIR"
        git clone "$PROJECT_REPO" "$PROJECT_DIR"
        cd "$PROJECT_DIR"
    }
    
    # 恢复 .env
    if [ -f ".env.backup" ]; then
        mv .env.backup .env
        print_success ".env 已恢复"
    fi
else
    echo "克隆项目..."
    git clone "$PROJECT_REPO" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

print_success "项目代码已准备就绪"
echo ""

# 步骤 3: 配置环境变量
print_step "3/10" "配置环境变量..."

if [ ! -f ".env" ]; then
    echo "创建 .env 文件..."
    cp .env.example .env
    
    # 获取 OpenClaw Gateway Token
    if command -v openclaw &> /dev/null; then
        GATEWAY_TOKEN=$(openclaw config get gateway.auth.token 2>/dev/null || echo "")
        if [ -n "$GATEWAY_TOKEN" ]; then
            sed -i "s|^CLAW3D_GATEWAY_TOKEN=.*|CLAW3D_GATEWAY_TOKEN=${GATEWAY_TOKEN}|g" .env
            print_success "Gateway Token 已自动配置"
        else
            print_error "无法获取 Gateway Token"
            echo "请手动运行: openclaw config get gateway.auth.token"
            echo "然后更新 .env 文件中的 CLAW3D_GATEWAY_TOKEN"
        fi
    fi
    
    # 配置基本设置
    sed -i "s|^# *HOST=.*|HOST=0.0.0.0|g" .env
    sed -i "s|^# *PORT=.*|PORT=3000|g" .env
    sed -i "s|^# *CLAW3D_GATEWAY_URL=.*|CLAW3D_GATEWAY_URL=ws://localhost:18789|g" .env
    sed -i "s|^# *CLAW3D_GATEWAY_ADAPTER_TYPE=.*|CLAW3D_GATEWAY_ADAPTER_TYPE=openclaw|g" .env
    sed -i "s|^# *STUDIO_ACCESS_TOKEN=.*|STUDIO_ACCESS_TOKEN=ChangeMe$(date +%s)|g" .env
    sed -i "s|^# *UPSTREAM_ALLOWLIST=.*|UPSTREAM_ALLOWLIST=localhost:18789,127.0.0.1:18789|g" .env
    
    print_success ".env 文件已创建"
    echo ""
    echo -e "${YELLOW}重要: 请编辑 .env 文件并修改以下配置:${NC}"
    echo "  1. STUDIO_ACCESS_TOKEN - 设置一个强密码"
    echo "  2. CLAW3D_GATEWAY_TOKEN - 如果未自动配置"
    echo ""
    echo "编辑命令: nano $PROJECT_DIR/.env"
    echo ""
    read -p "按 Enter 继续，或 Ctrl+C 退出去编辑 .env..."
else
    print_success ".env 文件已存在"
fi

echo ""

# 步骤 4: 清理旧的构建
print_step "4/10" "清理旧的构建文件..."
rm -rf node_modules .next dist build
print_success "清理完成"
echo ""

# 步骤 5: 安装依赖
print_step "5/10" "安装 npm 依赖（这可能需要几分钟）..."
npm install --production=false

if [ $? -ne 0 ]; then
    print_error "npm install 失败"
    exit 1
fi

print_success "依赖安装完成"
echo ""

# 步骤 6: 构建项目
print_step "6/10" "构建生产版本（这可能需要几分钟）..."
npm run build

if [ $? -ne 0 ]; then
    print_error "构建失败"
    exit 1
fi

print_success "构建完成"
echo ""

# 步骤 7: 创建日志目录
print_step "7/10" "创建日志目录..."
mkdir -p logs
print_success "日志目录已创建"
echo ""

# 步骤 8: 停止旧服务
print_step "8/10" "停止旧的 PM2 服务..."
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
print_success "旧服务已停止"
echo ""

# 步骤 9: 启动新服务
print_step "9/10" "启动 Claw3D 服务..."

if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
else
    pm2 start npm --name "$PM2_APP_NAME" -- start
fi

if [ $? -ne 0 ]; then
    print_error "PM2 启动失败"
    exit 1
fi

# 保存 PM2 配置
pm2 save

print_success "服务启动成功"
echo ""

# 步骤 10: 配置开机自启
print_step "10/10" "配置 PM2 开机自启..."

# 检查是否已配置
if pm2 startup | grep -q "already"; then
    print_success "PM2 开机自启已配置"
else
    echo "请运行以下命令配置开机自启:"
    pm2 startup
fi

echo ""

# 显示服务状态
echo "=========================================="
echo -e "${GREEN}部署完成！${NC}"
echo "=========================================="
echo ""

pm2 list

echo ""
echo -e "${BLUE}访问信息:${NC}"
echo "  本地: http://localhost:3000"
echo "  局域网: http://$(hostname -I | awk '{print $1}'):3000"
echo ""

echo -e "${BLUE}管理命令:${NC}"
echo "  查看日志: pm2 logs $PM2_APP_NAME"
echo "  实时日志: pm2 logs $PM2_APP_NAME --lines 100"
echo "  重启服务: pm2 restart $PM2_APP_NAME"
echo "  停止服务: pm2 stop $PM2_APP_NAME"
echo "  查看状态: pm2 status"
echo "  监控面板: pm2 monit"
echo ""

echo -e "${BLUE}OpenClaw 相关:${NC}"
echo "  Gateway 状态: openclaw gateway status"
echo "  查看设备: openclaw devices list"
echo "  批准设备: openclaw devices approve --latest"
echo "  获取 Token: openclaw config get gateway.auth.token"
echo ""

echo -e "${YELLOW}重要提醒:${NC}"
echo "  1. 首次访问需要输入 STUDIO_ACCESS_TOKEN"
echo "  2. 连接后需要批准设备: openclaw devices approve --latest"
echo "  3. 确保防火墙开放端口 3000"
echo ""

# 检查防火墙
echo -e "${BLUE}防火墙配置:${NC}"
if command -v ufw &> /dev/null; then
    echo "  Ubuntu/Debian: sudo ufw allow 3000/tcp"
elif command -v firewall-cmd &> /dev/null; then
    echo "  CentOS/RHEL: sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload"
fi
echo ""

# 显示 .env 配置提醒
echo -e "${YELLOW}配置检查:${NC}"
echo "  .env 文件位置: $PROJECT_DIR/.env"
echo ""
echo "  关键配置项:"
grep -E "^(HOST|PORT|STUDIO_ACCESS_TOKEN|CLAW3D_GATEWAY_URL|CLAW3D_GATEWAY_TOKEN)=" .env | sed 's/^/    /'
echo ""

echo -e "${GREEN}部署脚本执行完成！${NC}"
echo ""
