#!/bin/bash

# Claw3D 部署诊断脚本
# 使用方法: bash diagnose.sh

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "=========================================="
echo -e "${BLUE}Claw3D 部署诊断工具${NC}"
echo "=========================================="
echo ""

# 1. 检查项目目录
echo -e "${YELLOW}[1] 检查项目目录${NC}"
if [ -d "$HOME/claw3d" ]; then
    echo -e "${GREEN}✓ 项目目录存在: $HOME/claw3d${NC}"
    cd "$HOME/claw3d"
else
    echo -e "${RED}✗ 项目目录不存在: $HOME/claw3d${NC}"
    echo "请先运行部署脚本"
    exit 1
fi
echo ""

# 2. 检查 .env 文件
echo -e "${YELLOW}[2] 检查 .env 配置${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env 文件存在${NC}"
    echo ""
    echo "关键配置:"
    grep -E "^(HOST|PORT|STUDIO_ACCESS_TOKEN|CLAW3D_GATEWAY_URL|CLAW3D_GATEWAY_TOKEN|CLAW3D_GATEWAY_ADAPTER_TYPE)=" .env | while read line; do
        key=$(echo "$line" | cut -d'=' -f1)
        value=$(echo "$line" | cut -d'=' -f2-)
        if [ "$key" = "CLAW3D_GATEWAY_TOKEN" ] || [ "$key" = "STUDIO_ACCESS_TOKEN" ]; then
            if [ -z "$value" ] || [ "$value" = "your-secure-token-change-me" ] || [[ "$value" == *"ChangeMe"* ]]; then
                echo -e "  ${RED}✗ $key = (未设置或使用默认值)${NC}"
            else
                echo -e "  ${GREEN}✓ $key = (已设置)${NC}"
            fi
        else
            echo -e "  ${GREEN}✓ $key = $value${NC}"
        fi
    done
else
    echo -e "${RED}✗ .env 文件不存在${NC}"
    exit 1
fi
echo ""

# 3. 检查 node_modules
echo -e "${YELLOW}[3] 检查依赖安装${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ node_modules 存在${NC}"
else
    echo -e "${RED}✗ node_modules 不存在，需要运行 npm install${NC}"
fi
echo ""

# 4. 检查构建文件
echo -e "${YELLOW}[4] 检查构建文件${NC}"
if [ -d ".next" ]; then
    echo -e "${GREEN}✓ .next 构建目录存在${NC}"
else
    echo -e "${RED}✗ .next 构建目录不存在，需要运行 npm run build${NC}"
fi
echo ""

# 5. 检查 PM2 状态
echo -e "${YELLOW}[5] 检查 PM2 服务状态${NC}"
if command -v pm2 &> /dev/null; then
    PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o '"name":"claw3d"' || echo "")
    if [ -n "$PM2_STATUS" ]; then
        echo -e "${GREEN}✓ PM2 服务 'claw3d' 存在${NC}"
        echo ""
        pm2 list | grep -E "claw3d|App name"
        echo ""
        
        # 检查服务状态
        PM2_ONLINE=$(pm2 jlist 2>/dev/null | grep -A5 '"name":"claw3d"' | grep '"status":"online"' || echo "")
        if [ -n "$PM2_ONLINE" ]; then
            echo -e "${GREEN}✓ 服务状态: online${NC}"
        else
            echo -e "${RED}✗ 服务状态: 不是 online${NC}"
            echo "查看错误日志: pm2 logs claw3d --err --lines 50"
        fi
    else
        echo -e "${RED}✗ PM2 服务 'claw3d' 不存在${NC}"
        echo "启动服务: pm2 start npm --name claw3d -- start"
    fi
else
    echo -e "${RED}✗ PM2 未安装${NC}"
fi
echo ""

# 6. 检查端口监听
echo -e "${YELLOW}[6] 检查端口监听${NC}"
PORT_CHECK=$(netstat -tulpn 2>/dev/null | grep ":3000" || ss -tulpn 2>/dev/null | grep ":3000" || echo "")
if [ -n "$PORT_CHECK" ]; then
    echo -e "${GREEN}✓ 端口 3000 正在监听${NC}"
    echo "$PORT_CHECK"
    
    # 检查监听地址
    if echo "$PORT_CHECK" | grep -q "0.0.0.0:3000"; then
        echo -e "${GREEN}✓ 监听地址: 0.0.0.0 (允许外部访问)${NC}"
    elif echo "$PORT_CHECK" | grep -q "127.0.0.1:3000"; then
        echo -e "${RED}✗ 监听地址: 127.0.0.1 (仅本地访问)${NC}"
        echo "问题: 服务只监听 localhost，无法从外部访问"
        echo "解决: 检查 .env 中的 HOST=0.0.0.0"
    fi
else
    echo -e "${RED}✗ 端口 3000 未监听${NC}"
    echo "问题: 服务可能未启动或启动失败"
fi
echo ""

# 7. 测试本地访问
echo -e "${YELLOW}[7] 测试本地访问${NC}"
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "000")
if [ "$HTTP_RESPONSE" = "200" ] || [ "$HTTP_RESPONSE" = "301" ] || [ "$HTTP_RESPONSE" = "302" ]; then
    echo -e "${GREEN}✓ 本地访问成功 (HTTP $HTTP_RESPONSE)${NC}"
elif [ "$HTTP_RESPONSE" = "000" ]; then
    echo -e "${RED}✗ 无法连接到 localhost:3000${NC}"
    echo "问题: 服务未运行或端口未监听"
else
    echo -e "${YELLOW}⚠ HTTP 响应码: $HTTP_RESPONSE${NC}"
fi
echo ""

# 8. 检查防火墙
echo -e "${YELLOW}[8] 检查防火墙${NC}"
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status 2>/dev/null | grep "Status:" | awk '{print $2}')
    if [ "$UFW_STATUS" = "active" ]; then
        echo -e "${YELLOW}UFW 防火墙: 激活${NC}"
        PORT_ALLOWED=$(sudo ufw status 2>/dev/null | grep "3000" || echo "")
        if [ -n "$PORT_ALLOWED" ]; then
            echo -e "${GREEN}✓ 端口 3000 已开放${NC}"
            echo "$PORT_ALLOWED"
        else
            echo -e "${RED}✗ 端口 3000 未开放${NC}"
            echo "解决: sudo ufw allow 3000/tcp"
        fi
    else
        echo -e "${GREEN}✓ UFW 防火墙: 未激活${NC}"
    fi
elif command -v firewall-cmd &> /dev/null; then
    FIREWALLD_STATUS=$(sudo systemctl is-active firewalld 2>/dev/null || echo "inactive")
    if [ "$FIREWALLD_STATUS" = "active" ]; then
        echo -e "${YELLOW}firewalld 防火墙: 激活${NC}"
        PORT_ALLOWED=$(sudo firewall-cmd --list-ports 2>/dev/null | grep "3000" || echo "")
        if [ -n "$PORT_ALLOWED" ]; then
            echo -e "${GREEN}✓ 端口 3000 已开放${NC}"
        else
            echo -e "${RED}✗ 端口 3000 未开放${NC}"
            echo "解决: sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload"
        fi
    else
        echo -e "${GREEN}✓ firewalld 防火墙: 未激活${NC}"
    fi
else
    echo -e "${GREEN}✓ 未检测到常见防火墙${NC}"
fi
echo ""

# 9. 检查网络接口
echo -e "${YELLOW}[9] 检查网络接口${NC}"
IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || ip addr show | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | cut -d'/' -f1 | head -1)
if [ -n "$IP_ADDR" ]; then
    echo -e "${GREEN}✓ 服务器 IP: $IP_ADDR${NC}"
    echo "  局域网访问地址: http://$IP_ADDR:3000"
else
    echo -e "${RED}✗ 无法获取 IP 地址${NC}"
fi
echo ""

# 10. 检查 OpenClaw Gateway
echo -e "${YELLOW}[10] 检查 OpenClaw Gateway${NC}"
if command -v openclaw &> /dev/null; then
    GATEWAY_STATUS=$(openclaw gateway status 2>/dev/null || echo "error")
    if echo "$GATEWAY_STATUS" | grep -q "running\|healthy\|ok"; then
        echo -e "${GREEN}✓ OpenClaw Gateway 运行中${NC}"
    else
        echo -e "${RED}✗ OpenClaw Gateway 未运行或异常${NC}"
        echo "解决: openclaw gateway restart"
    fi
    
    # 检查 Gateway Token
    GATEWAY_TOKEN=$(openclaw config get gateway.auth.token 2>/dev/null || echo "")
    if [ -n "$GATEWAY_TOKEN" ]; then
        echo -e "${GREEN}✓ Gateway Token 已配置${NC}"
    else
        echo -e "${RED}✗ 无法获取 Gateway Token${NC}"
    fi
else
    echo -e "${YELLOW}⚠ OpenClaw 未安装${NC}"
fi
echo ""

# 11. 查看最近的日志
echo -e "${YELLOW}[11] 最近的服务日志${NC}"
if command -v pm2 &> /dev/null; then
    echo "最近 20 行日志:"
    echo "----------------------------------------"
    pm2 logs claw3d --lines 20 --nostream 2>/dev/null || echo "无法获取日志"
    echo "----------------------------------------"
else
    echo "PM2 未安装，无法查看日志"
fi
echo ""

# 总结和建议
echo "=========================================="
echo -e "${BLUE}诊断总结${NC}"
echo "=========================================="
echo ""

# 判断主要问题
MAIN_ISSUE=""

if [ ! -d "$HOME/claw3d/.next" ]; then
    MAIN_ISSUE="构建文件缺失"
    echo -e "${RED}主要问题: 项目未构建${NC}"
    echo "解决方案:"
    echo "  cd ~/claw3d"
    echo "  npm install"
    echo "  npm run build"
    echo "  pm2 restart claw3d"
elif [ -z "$PORT_CHECK" ]; then
    MAIN_ISSUE="服务未运行"
    echo -e "${RED}主要问题: 服务未运行或启动失败${NC}"
    echo "解决方案:"
    echo "  1. 查看错误日志: pm2 logs claw3d --err"
    echo "  2. 尝试重启: pm2 restart claw3d"
    echo "  3. 如果失败，删除并重新启动:"
    echo "     pm2 delete claw3d"
    echo "     cd ~/claw3d"
    echo "     pm2 start npm --name claw3d -- start"
elif echo "$PORT_CHECK" | grep -q "127.0.0.1:3000"; then
    MAIN_ISSUE="监听地址错误"
    echo -e "${RED}主要问题: 服务只监听 localhost，无法从外部访问${NC}"
    echo "解决方案:"
    echo "  1. 编辑 .env 文件: nano ~/claw3d/.env"
    echo "  2. 确保设置: HOST=0.0.0.0"
    echo "  3. 重启服务: pm2 restart claw3d"
elif [ "$HTTP_RESPONSE" != "200" ] && [ "$HTTP_RESPONSE" != "301" ] && [ "$HTTP_RESPONSE" != "302" ]; then
    MAIN_ISSUE="HTTP 响应异常"
    echo -e "${RED}主要问题: 服务响应异常 (HTTP $HTTP_RESPONSE)${NC}"
    echo "解决方案:"
    echo "  1. 查看日志: pm2 logs claw3d"
    echo "  2. 检查 .env 配置"
    echo "  3. 尝试重启: pm2 restart claw3d"
else
    echo -e "${GREEN}✓ 服务看起来正常运行${NC}"
    echo ""
    echo "如果仍然无法访问，请检查:"
    echo "  1. 防火墙是否开放端口 3000"
    echo "  2. 路由器是否有端口转发限制"
    echo "  3. 客户端设备是否在同一局域网"
fi

echo ""
echo "=========================================="
echo -e "${BLUE}快速修复命令${NC}"
echo "=========================================="
echo ""
echo "# 完整重启流程:"
echo "cd ~/claw3d"
echo "pm2 stop claw3d"
echo "pm2 delete claw3d"
echo "npm install"
echo "npm run build"
echo "pm2 start npm --name claw3d -- start"
echo "pm2 save"
echo "pm2 logs claw3d"
echo ""
echo "# 开放防火墙端口:"
echo "sudo ufw allow 3000/tcp  # Ubuntu/Debian"
echo "# 或"
echo "sudo firewall-cmd --permanent --add-port=3000/tcp && sudo firewall-cmd --reload  # CentOS/RHEL"
echo ""
echo "# 查看实时日志:"
echo "pm2 logs claw3d --lines 100"
echo ""
