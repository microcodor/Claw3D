#!/bin/bash

# 修复 HOST 配置，允许局域网访问
# 在服务器上运行: bash fix-host-config.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "=========================================="
echo "修复 Claw3D HOST 配置"
echo "=========================================="
echo ""

cd ~/claw3d

# 1. 检查当前监听地址
echo -e "${YELLOW}[1/5] 检查当前监听地址...${NC}"
CURRENT_LISTEN=$(netstat -tulpn 2>/dev/null | grep ":3000" | awk '{print $4}' || ss -tulpn 2>/dev/null | grep ":3000" | awk '{print $5}' || echo "未知")
echo "当前监听: $CURRENT_LISTEN"

if echo "$CURRENT_LISTEN" | grep -q "127.0.0.1:3000"; then
    echo -e "${RED}✗ 问题确认: 只监听 localhost，无法从外部访问${NC}"
elif echo "$CURRENT_LISTEN" | grep -q "0.0.0.0:3000"; then
    echo -e "${GREEN}✓ 已经监听 0.0.0.0，配置正确${NC}"
    echo "如果仍无法访问，请检查防火墙"
    exit 0
fi
echo ""

# 2. 备份 .env
echo -e "${YELLOW}[2/5] 备份 .env 文件...${NC}"
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✓ 已备份${NC}"
echo ""

# 3. 修复 .env 配置
echo -e "${YELLOW}[3/5] 修复 .env 配置...${NC}"

# 删除所有 HOST 相关的行
sed -i '/^HOST=/d' .env
sed -i '/^# *HOST=/d' .env

# 删除所有 PORT 相关的行
sed -i '/^PORT=/d' .env
sed -i '/^# *PORT=/d' .env

# 在文件开头添加正确的配置
cat > .env.tmp << 'EOF'
# 服务器配置 - 允许局域网访问
HOST=0.0.0.0
PORT=3000

EOF

# 合并文件
cat .env >> .env.tmp
mv .env.tmp .env

echo -e "${GREEN}✓ .env 已修复${NC}"
echo ""
echo "新的配置:"
grep -E "^(HOST|PORT)=" .env
echo ""

# 4. 重启服务
echo -e "${YELLOW}[4/5] 重启 PM2 服务...${NC}"
pm2 restart claw3d
sleep 3
echo -e "${GREEN}✓ 服务已重启${NC}"
echo ""

# 5. 验证修复
echo -e "${YELLOW}[5/5] 验证修复结果...${NC}"
sleep 2

# 检查新的监听地址
NEW_LISTEN=$(netstat -tulpn 2>/dev/null | grep ":3000" | awk '{print $4}' || ss -tulpn 2>/dev/null | grep ":3000" | awk '{print $5}' || echo "未知")
echo "新的监听地址: $NEW_LISTEN"

if echo "$NEW_LISTEN" | grep -q "0.0.0.0:3000"; then
    echo -e "${GREEN}✓ 成功！现在监听 0.0.0.0:3000${NC}"
    echo ""
    
    # 测试本地访问
    echo "测试本地访问..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ 本地访问正常${NC}"
    else
        echo -e "${RED}✗ 本地访问失败${NC}"
    fi
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}修复完成！${NC}"
    echo "=========================================="
    echo ""
    
    IP_ADDR=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "192.168.0.132")
    echo "访问地址:"
    echo "  本地: http://localhost:3000"
    echo "  局域网: http://$IP_ADDR:3000"
    echo ""
    
    echo "如果仍无法从局域网访问，请检查防火墙:"
    echo "  sudo ufw allow 3000/tcp"
    echo "  sudo ufw status"
    echo ""
    
elif echo "$NEW_LISTEN" | grep -q "127.0.0.1:3000"; then
    echo -e "${RED}✗ 仍然只监听 127.0.0.1${NC}"
    echo ""
    echo "可能的原因:"
    echo "  1. .env 配置未生效"
    echo "  2. 环境变量被其他地方覆盖"
    echo ""
    echo "请查看日志:"
    echo "  pm2 logs claw3d --lines 50"
    echo ""
    echo "手动检查 .env:"
    echo "  cat ~/claw3d/.env | grep HOST"
    echo ""
else
    echo -e "${YELLOW}⚠ 无法确定监听地址${NC}"
    echo "请手动检查:"
    echo "  netstat -tulpn | grep 3000"
    echo "  pm2 logs claw3d"
fi

echo ""
