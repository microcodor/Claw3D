#!/bin/bash

# Claw3D PM2 快速部署脚本
# 使用方法: ./pm2-deploy.sh

set -e

echo "🚀 Claw3D PM2 部署脚本"
echo "================================"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
echo -e "${YELLOW}📋 检查环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未找到 Node.js，请先安装 Node.js 20+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 未找到 npm${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm 版本: $(npm -v)${NC}"

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  未找到 PM2，正在安装...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 安装完成${NC}"
else
    echo -e "${GREEN}✅ PM2 版本: $(pm2 -v)${NC}"
fi

# 检查 .env 文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  未找到 .env 文件，正在创建...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env 文件已创建，请编辑配置后重新运行${NC}"
    exit 0
fi

# 安装依赖
echo -e "${YELLOW}📦 安装依赖...${NC}"
npm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"

# 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build
echo -e "${GREEN}✅ 构建完成${NC}"

# 创建日志目录
if [ ! -d logs ]; then
    mkdir -p logs
    echo -e "${GREEN}✅ 日志目录已创建${NC}"
fi

# 检查是否已经在运行
if pm2 list | grep -q "claw3d"; then
    echo -e "${YELLOW}🔄 检测到应用正在运行，准备重启...${NC}"
    pm2 restart claw3d
    echo -e "${GREEN}✅ 应用已重启${NC}"
else
    echo -e "${YELLOW}🚀 启动应用...${NC}"
    pm2 start ecosystem.config.js
    echo -e "${GREEN}✅ 应用已启动${NC}"
fi

# 保存 PM2 配置
echo -e "${YELLOW}💾 保存 PM2 配置...${NC}"
pm2 save
echo -e "${GREEN}✅ 配置已保存${NC}"

# 提示设置开机自启
echo ""
echo -e "${YELLOW}💡 提示: 如需设置开机自启，请运行:${NC}"
echo -e "   ${GREEN}pm2 startup${NC}"
echo -e "   然后按照提示执行命令"

# 显示状态
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
pm2 list
echo ""
echo -e "${YELLOW}📊 查看日志: ${GREEN}pm2 logs claw3d${NC}"
echo -e "${YELLOW}📈 实时监控: ${GREEN}pm2 monit${NC}"
echo -e "${YELLOW}🔄 重启应用: ${GREEN}pm2 restart claw3d${NC}"
echo -e "${YELLOW}🛑 停止应用: ${GREEN}pm2 stop claw3d${NC}"
echo ""
echo -e "${YELLOW}🌐 访问地址: ${GREEN}http://localhost:3000/office${NC}"
echo ""
