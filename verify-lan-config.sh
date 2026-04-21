#!/bin/bash

# Claw3D 局域网访问配置验证脚本
# 用于验证局域网访问配置是否正确

echo "=========================================="
echo "  Claw3D 局域网访问配置验证"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数
PASS=0
FAIL=0
WARN=0

# 1. 检查 .env 文件
echo "1️⃣  检查 .env 配置..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env 文件存在"
    PASS=$((PASS+1))
    
    # 检查 HOST 配置
    if grep -q "^HOST=0.0.0.0" .env; then
        echo -e "${GREEN}✓${NC} HOST=0.0.0.0 配置正确"
        PASS=$((PASS+1))
    else
        echo -e "${RED}✗${NC} HOST 未设置为 0.0.0.0"
        echo "  当前配置: $(grep "^HOST=" .env || echo "未设置")"
        FAIL=$((FAIL+1))
    fi
    
    # 检查 PORT 配置
    if grep -q "^PORT=" .env; then
        PORT=$(grep "^PORT=" .env | cut -d'=' -f2)
        echo -e "${GREEN}✓${NC} PORT=$PORT"
        PASS=$((PASS+1))
    else
        echo -e "${YELLOW}⚠${NC} PORT 未设置，将使用默认值 3000"
        WARN=$((WARN+1))
    fi
    
    # 检查 STUDIO_ACCESS_TOKEN
    if grep -q "^STUDIO_ACCESS_TOKEN=" .env; then
        echo -e "${YELLOW}⚠${NC} STUDIO_ACCESS_TOKEN 已设置（将需要访问令牌）"
        WARN=$((WARN+1))
    else
        echo -e "${GREEN}✓${NC} STUDIO_ACCESS_TOKEN 未设置（无需访问令牌）"
        PASS=$((PASS+1))
    fi
else
    echo -e "${RED}✗${NC} .env 文件不存在"
    echo "  请运行: cp .env.example .env"
    FAIL=$((FAIL+1))
fi

echo ""

# 2. 检查 network-policy.js 修改
echo "2️⃣  检查 network-policy.js 修改..."
if [ -f "server/network-policy.js" ]; then
    if grep -q "// throw new Error" server/network-policy.js; then
        echo -e "${GREEN}✓${NC} network-policy.js 已正确修改（错误抛出已注释）"
        PASS=$((PASS+1))
    else
        echo -e "${RED}✗${NC} network-policy.js 未修改或修改不正确"
        echo "  请确认 assertPublicHostAllowed 函数中的 throw new Error 已注释"
        FAIL=$((FAIL+1))
    fi
else
    echo -e "${RED}✗${NC} server/network-policy.js 文件不存在"
    FAIL=$((FAIL+1))
fi

echo ""

# 3. 检查 Node.js 版本
echo "3️⃣  检查 Node.js 版本..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js 已安装: $NODE_VERSION"
    PASS=$((PASS+1))
    
    # 检查版本是否 >= 20
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "${GREEN}✓${NC} Node.js 版本符合要求 (>= 20.0.0)"
        PASS=$((PASS+1))
    else
        echo -e "${RED}✗${NC} Node.js 版本过低，需要 >= 20.0.0"
        FAIL=$((FAIL+1))
    fi
else
    echo -e "${RED}✗${NC} Node.js 未安装"
    FAIL=$((FAIL+1))
fi

echo ""

# 4. 检查依赖安装
echo "4️⃣  检查依赖安装..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 目录存在"
    PASS=$((PASS+1))
else
    echo -e "${YELLOW}⚠${NC} node_modules 目录不存在"
    echo "  请运行: npm install"
    WARN=$((WARN+1))
fi

echo ""

# 5. 检查端口占用
echo "5️⃣  检查端口占用..."
PORT=${PORT:-3000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} 端口 $PORT 已被占用"
    echo "  占用进程: $(lsof -Pi :$PORT -sTCP:LISTEN | tail -n 1)"
    WARN=$((WARN+1))
else
    echo -e "${GREEN}✓${NC} 端口 $PORT 可用"
    PASS=$((PASS+1))
fi

echo ""

# 6. 获取本机 IP
echo "6️⃣  获取本机 IP 地址..."
if command -v ifconfig &> /dev/null; then
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    if [ -n "$LOCAL_IP" ]; then
        echo -e "${GREEN}✓${NC} 本机局域网 IP: $LOCAL_IP"
        echo "  局域网访问地址: http://$LOCAL_IP:${PORT:-3000}/office"
        PASS=$((PASS+1))
    else
        echo -e "${YELLOW}⚠${NC} 无法获取局域网 IP"
        WARN=$((WARN+1))
    fi
else
    echo -e "${YELLOW}⚠${NC} ifconfig 命令不可用"
    WARN=$((WARN+1))
fi

echo ""

# 7. 测试网络策略
echo "7️⃣  测试网络策略..."
TEST_RESULT=$(node -e "
const { assertPublicHostAllowed } = require('./server/network-policy.js');
try {
  assertPublicHostAllowed({ host: '0.0.0.0', studioAccessToken: '' });
  console.log('PASS');
} catch (err) {
  console.log('FAIL');
}
" 2>/dev/null)

if [ "$TEST_RESULT" = "PASS" ]; then
    echo -e "${GREEN}✓${NC} 网络策略测试通过（允许无 token 绑定）"
    PASS=$((PASS+1))
else
    echo -e "${RED}✗${NC} 网络策略测试失败"
    echo "  请确认 server/network-policy.js 已正确修改"
    FAIL=$((FAIL+1))
fi

echo ""
echo "=========================================="
echo "  验证结果"
echo "=========================================="
echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${YELLOW}警告: $WARN${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 配置验证通过！${NC}"
    echo ""
    echo "下一步："
    echo "  1. 启动服务: npm run dev"
    echo "  2. 本机访问: http://localhost:${PORT:-3000}/office"
    if [ -n "$LOCAL_IP" ]; then
        echo "  3. 局域网访问: http://$LOCAL_IP:${PORT:-3000}/office"
    fi
    echo ""
    exit 0
else
    echo -e "${RED}✗ 配置验证失败，请修复上述问题${NC}"
    echo ""
    echo "参考文档："
    echo "  - 局域网访问快速配置.md"
    echo "  - 局域网访问配置说明.md"
    echo "  - 局域网访问配置总结.md"
    echo ""
    exit 1
fi
