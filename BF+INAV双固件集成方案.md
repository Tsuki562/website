# BF + INAV 双固件网站集成完整方案

## 📋 文档状态
- **创建日期**：2026-09-22
- **状态**：待决策（等待固件学习完成后确认硬件配置）
- **关联文档**：
  - [服务器与官网改造完整方案.md](服务器与官网改造完整方案.md)
  - [固件知识学习.md](固件知识学习.md)

---

## 🎯 核心需求确认

### 已确认
- ✅ 需要同时支持 Betaflight 和 INAV 两种固件
- ✅ 两种固件都有自定义 target（公司自研飞控）
- ✅ 需要提供完整集成（在线配置器 + 固件编译 + 下载）
- ✅ ArduPilot 暂不考虑

### 待确认（关键决策点）⚠️
在学习完 BF 和 INAV 后，需要明确以下问题：

#### 1. 硬件配置差异
**问题**：你们的飞控硬件在 BF 版和 INAV 版中是否完全相同？

**检查清单**：
- [ ] 处理器型号（STM32F4/F7/H7）
- [ ] 陀螺仪型号（MPU6000/ICM20689/BMI270）
- [ ] Flash 芯片（是否有黑匣子）
- [ ] OSD 芯片（MAX7456）
- [ ] 气压计（BMP280/DPS310）
- [ ] 磁力计（QMC5883/HMC5883）
- [ ] GPS 接口（UART数量）
- [ ] 电流传感器

**决策影响**：
- 如果**完全相同** → 可以选择场景B（可切换固件）
- 如果**有差异** → 必须选择场景A（固定固件）

#### 2. 产品策略
**问题**：用户是否需要在同一块飞控上切换 BF 和 INAV？

**场景A：固定固件**（推荐）
```
产品线：
├── XX飞控-BF版（竞速穿越机专用）
└── XX飞控-INAV版（航拍导航专用）
```
- 优势：技术简单、维护成本低、用户体验清晰
- 劣势：需要管理两个SKU

**场景B：可切换固件**
```
产品线：
└── XX飞控（支持BF/INAV双固件切换）
```
- 优势：产品灵活、库存管理简单
- 劣势：技术复杂、用户容易出错、客服成本高

---

## 🏗️ 技术架构方案

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   官网主页 (/)           │
        │  https://yourdomain.com │
        └────────┬────────────────┘
                 │
      ┏━━━━━━━━━┻━━━━━━━━━┓
      ┃                     ┃
┌─────▼──────┐      ┌──────▼──────┐
│ BF 配置器   │      │ INAV 配置器  │
│ /bf-config  │      │ /inav-config│
└─────┬──────┘      └──────┬──────┘
      │                     │
┌─────▼──────┐      ┌──────▼──────┐
│ BF 固件 API │      │INAV 固件 API│
│/api/bf/... │      │/api/inav/...│
└─────┬──────┘      └──────┬──────┘
      │                     │
┌─────▼──────┐      ┌──────▼──────┐
│ BF 编译服务 │      │INAV 编译服务│
│ /opt/bf/    │      │ /opt/inav/  │
└────────────┘      └─────────────┘
```

---

## 💻 方案一：场景A（固定固件）- 推荐方案

### 1.1 服务器目录结构

```
/var/www/
├── html/                              # 官网主页
│   ├── index.html
│   ├── products/
│   │   ├── fc-betaflight.html        # BF版飞控产品页
│   │   └── fc-inav.html              # INAV版飞控产品页
│   └── downloads/                     # 下载中心
│
├── betaflight-configurator/          # BF Configurator
│   ├── build/                         # 编译后的网页版
│   └── src/                           # 源码（添加自定义target）
│
├── inav-configurator/                 # INAV Configurator
│   ├── build/                         # 编译后的网页版
│   └── src/                           # 源码（添加自定义target）
│
└── firmware/
    ├── betaflight/                    # BF固件
    │   ├── latest/
    │   │   └── YOUR_BF_TARGET_*.hex
    │   └── archive/
    │
    └── inav/                          # INAV固件
        ├── latest/
        │   └── YOUR_INAV_TARGET_*.hex
        └── archive/

/opt/
├── betaflight/                        # BF源码（编译用）
│   └── src/main/target/YOUR_BF_TARGET/
│
└── inav/                              # INAV源码（编译用）
    └── src/main/target/YOUR_INAV_TARGET/
```

### 1.2 Nginx 配置

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # 官网主页
    location / {
        root /var/www/html;
        index index.html;
    }

    # Betaflight Configurator
    location /bf-config {
        alias /var/www/betaflight-configurator/build;
        index index.html;
        try_files $uri $uri/ /bf-config/index.html;
    }

    # INAV Configurator
    location /inav-config {
        alias /var/www/inav-configurator/build;
        index index.html;
        try_files $uri $uri/ /inav-config/index.html;
    }

    # Betaflight 固件 API
    location /api/betaflight {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    # INAV 固件 API
    location /api/inav {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }

    # 固件文件下载
    location /firmware {
        alias /var/www/firmware;
        autoindex on;
    }
}
```

### 1.3 部署步骤

#### Step 1: 部署 Betaflight Configurator

```bash
cd /var/www/
git clone https://github.com/betaflight/betaflight-configurator.git
cd betaflight-configurator

# 安装依赖
npm install

# 添加自定义 target 配置
# 编辑 src/js/boards.js 添加你的 target 信息

# 构建生产版本
npm run build
```

#### Step 2: 部署 INAV Configurator

```bash
cd /var/www/
git clone https://github.com/iNavFlight/inav-configurator.git
cd inav-configurator

# 安装依赖
npm install

# 添加自定义 target 配置
# 编辑相关配置文件

# 构建生产版本
npm run build
```

#### Step 3: 设置固件编译环境

```bash
# Betaflight 编译环境
cd /opt
git clone https://github.com/betaflight/betaflight.git
cd betaflight
make arm_sdk_install

# INAV 编译环境
cd /opt
git clone https://github.com/iNavFlight/inav.git
cd inav
make arm_sdk_install
```

#### Step 4: 添加自定义 Target

**Betaflight Target**（明月提供）:
```bash
cd /opt/betaflight/src/main/target/
mkdir YOUR_BF_TARGET
# 复制 target.h, target.c 等配置文件
```

**INAV Target**（明月提供）:
```bash
cd /opt/inav/src/main/target/
mkdir YOUR_INAV_TARGET
# 复制 target.h, target.c 等配置文件
```

### 1.4 固件编译 API 服务

#### Betaflight 固件服务 (Node.js)

```javascript
// /opt/firmware-service/betaflight-api.js
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

// 检查固件更新
app.post('/api/betaflight/check-update', (req, res) => {
    const { target, version } = req.body;
    
    // 读取版本配置
    const versions = require('./betaflight-versions.json');
    const targetInfo = versions[target];
    
    if (!targetInfo) {
        return res.json({ error: 'Target not found' });
    }
    
    const latestVersion = targetInfo.latest;
    
    if (compareVersion(version, latestVersion) < 0) {
        res.json({
            hasUpdate: true,
            latestVersion: latestVersion,
            downloadUrl: `/firmware/betaflight/${target}/${latestVersion}.hex`,
            changelog: targetInfo.changelog
        });
    } else {
        res.json({ hasUpdate: false });
    }
});

// 按需编译（高级功能）
app.post('/api/betaflight/build', async (req, res) => {
    const { target, options } = req.body;
    
    // 触发编译
    exec(`cd /opt/betaflight && make ${target}`, (error, stdout, stderr) => {
        if (error) {
            return res.json({ error: stderr });
        }
        res.json({
            status: 'success',
            downloadUrl: `/firmware/betaflight/${target}/latest.hex`
        });
    });
});

app.listen(3000, () => {
    console.log('Betaflight API running on port 3000');
});
```

#### INAV 固件服务（类似结构）

```javascript
// /opt/firmware-service/inav-api.js
// 结构与 Betaflight 类似，监听 3001 端口
```

### 1.5 前端页面集成

#### 官网下载中心页面

```html
<!-- /var/www/html/downloads/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>固件下载 - XX飞控</title>
</head>
<body>
    <h1>固件下载中心</h1>
    
    <div class="firmware-section">
        <h2>🚀 Betaflight 固件</h2>
        <p>适用于竞速穿越机</p>
        <div class="product-list">
            <div class="product-card">
                <h3>XX飞控 BF版</h3>
                <p>Target: YOUR_BF_TARGET</p>
                <a href="/bf-config" class="btn-primary">在线配置</a>
                <a href="/firmware/betaflight/YOUR_BF_TARGET/latest.hex" class="btn-secondary">下载固件</a>
            </div>
        </div>
    </div>
    
    <div class="firmware-section">
        <h2>🛩️ INAV 固件</h2>
        <p>适用于航拍导航</p>
        <div class="product-list">
            <div class="product-card">
                <h3>XX飞控 INAV版</h3>
                <p>Target: YOUR_INAV_TARGET</p>
                <a href="/inav-config" class="btn-primary">在线配置</a>
                <a href="/firmware/inav/YOUR_INAV_TARGET/latest.hex" class="btn-secondary">下载固件</a>
            </div>
        </div>
    </div>
</body>
</html>
```

---

## 💻 方案二：场景B（可切换固件）- 高级方案

### 2.1 核心差异

相比方案一，需要额外实现：

#### 1. 智能固件识别

```javascript
// Configurator 统一入口
// /var/www/configurator/src/js/firmware-detector.js

async function detectFirmwareType() {
    // 连接飞控
    await serial.connect();
    
    // 读取 MSP 信息
    const fcInfo = await MSP.send_message(MSPCodes.MSP_FC_VARIANT);
    
    // 判断固件类型
    if (fcInfo.flightControllerIdentifier === 'BTFL') {
        return 'betaflight';
    } else if (fcInfo.flightControllerIdentifier === 'INAV') {
        return 'inav';
    } else {
        return 'unknown';
    }
}

// 自动加载对应配置器
async function loadConfiguratorForFirmware(firmwareType) {
    if (firmwareType === 'betaflight') {
        window.location.href = '/bf-config';
    } else if (firmwareType === 'inav') {
        window.location.href = '/inav-config';
    }
}
```

#### 2. 固件切换引导流程

```html
<!-- 固件切换页面 -->
<div class="firmware-switcher">
    <h2>选择固件类型</h2>
    <div class="firmware-options">
        <div class="option">
            <input type="radio" name="firmware" value="betaflight">
            <label>
                <h3>Betaflight</h3>
                <p>竞速穿越机首选</p>
                <ul>
                    <li>8K PID Loop</li>
                    <li>RPM滤波</li>
                    <li>优化低延迟</li>
                </ul>
            </label>
        </div>
        
        <div class="option">
            <input type="radio" name="firmware" value="inav">
            <label>
                <h3>INAV</h3>
                <p>航拍导航专用</p>
                <ul>
                    <li>GPS航点导航</li>
                    <li>返航功能</li>
                    <li>航线规划</li>
                </ul>
            </label>
        </div>
    </div>
    
    <button onclick="flashSelectedFirmware()">刷入固件</button>
</div>
```

#### 3. 警告提示机制

```javascript
// 固件切换前警告
function warnBeforeSwitching(currentFirmware, targetFirmware) {
    return confirm(`
        ⚠️ 警告：你即将从 ${currentFirmware} 切换到 ${targetFirmware}
        
        切换固件后：
        - 所有配置参数将丢失
        - 需要重新校准传感器
        - PID参数需要重新调整
        
        确定要继续吗？
    `);
}
```

### 2.2 额外的服务器配置

```nginx
# 统一入口（自动识别固件）
location /configurator {
    alias /var/www/unified-configurator/build;
    index index.html;
}

# 固件切换 API
location /api/firmware-switch {
    proxy_pass http://localhost:3002;
}
```

---

## 📊 服务器资源需求对比

### 方案一（固定固件）

| 资源 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 2核 | 4核 |
| 内存 | 4GB | 8GB |
| 存储 | 100GB | 200GB |
| 带宽 | 10Mbps | 20Mbps |

**编译时间估算**：
- BF 单个 target：2-5分钟
- INAV 单个 target：3-6分钟
- 并行编译：可同时进行

### 方案二（可切换固件）

| 资源 | 最低配置 | 推荐配置 |
|------|---------|---------|
| CPU | 4核 | 8核 |
| 内存 | 8GB | 16GB |
| 存储 | 150GB | 300GB |
| 带宽 | 20Mbps | 50Mbps |

**额外开销**：
- 统一配置器开发成本
- 固件识别逻辑
- 切换引导页面
- 用户支持成本（更多客服咨询）

---

## 🔧 自定义 Target 集成清单

### Betaflight Target 需要的文件

从明月接收：
```
src/main/target/YOUR_BF_TARGET/
├── target.h           # 硬件定义
├── target.c           # 初始化代码
├── config.c           # 默认配置
└── target.mk          # 编译配置
```

### INAV Target 需要的文件

从明月接收：
```
src/main/target/YOUR_INAV_TARGET/
├── target.h           # 硬件定义
├── target.c           # 初始化代码
├── config.c           # 默认配置（导航参数）
└── target.mk          # 编译配置
```

### 配置信息检查清单

- [ ] 处理器型号（STM32F405/F722/H743等）
- [ ] 陀螺仪型号和SPI接口
- [ ] Flash芯片型号（黑匣子）
- [ ] OSD芯片（如果有）
- [ ] UART分配（GPS、接收机、VTX等）
- [ ] 电机输出引脚
- [ ] LED引脚
- [ ] Beeper引脚
- [ ] 电池电压检测
- [ ] 电流传感器（如果有）

---

## 🚀 实施时间线

### 阶段一：学习与准备（当前）
**时间**：按照[固件知识学习.md](固件知识学习.md)的 2周计划

- [ ] 完成 BF 固件学习
- [ ] 完成 INAV 固件学习
- [ ] 了解两者差异和适用场景
- [ ] 确认硬件配置差异
- [ ] 做出场景A/B的最终决策

### 阶段二：环境搭建（Week 3-4）

**Week 3**：
- Day 1-2: 服务器环境准备
  - [ ] 安装 Node.js、Nginx
  - [ ] 配置 SSL 证书
  - [ ] 安装编译工具链
  
- Day 3-4: BF Configurator 部署
  - [ ] 克隆源码
  - [ ] 添加自定义 target 页面
  - [ ] 编译测试
  
- Day 5-7: INAV Configurator 部署
  - [ ] 克隆源码
  - [ ] 添加自定义 target 页面
  - [ ] 编译测试

**Week 4**：
- Day 8-10: 固件编译环境
  - [ ] 接收明月的 BF target 配置
  - [ ] 接收明月的 INAV target 配置
  - [ ] 测试编译两种固件
  - [ ] 搭建自动化编译脚本
  
- Day 11-14: API 服务开发
  - [ ] BF 固件 API
  - [ ] INAV 固件 API
  - [ ] 版本管理系统
  - [ ] 下载统计功能

### 阶段三：官网集成（Week 5-6）

- [ ] 产品页面（BF版/INAV版）
- [ ] 下载中心页面
- [ ] 固件对比说明
- [ ] 配置教程文档
- [ ] 测试与上线

---

## 📚 学习后需要回答的问题

完成固件学习后，请填写以下信息：

### 硬件配置表

| 组件 | BF版配置 | INAV版配置 | 是否相同 |
|------|---------|-----------|---------|
| 处理器 | _________ | _________ | [ ] 是 [ ] 否 |
| 陀螺仪 | _________ | _________ | [ ] 是 [ ] 否 |
| Flash | _________ | _________ | [ ] 是 [ ] 否 |
| OSD | _________ | _________ | [ ] 是 [ ] 否 |
| 气压计 | _________ | _________ | [ ] 是 [ ] 否 |
| 磁力计 | _________ | _________ | [ ] 是 [ ] 否 |
| GPS接口 | _________ | _________ | [ ] 是 [ ] 否 |

### 产品策略决策

**问题1**：选择哪种方案？
- [ ] 方案A（固定固件） - 推荐
- [ ] 方案B（可切换固件） - 高级

**问题2**：如果选择方案A，产品命名？
- BF版产品名：__________________
- INAV版产品名：__________________

**问题3**：价格策略？
- [ ] 两个版本同价
- [ ] INAV版价格更高（因为有GPS导航功能）

---

## 🔗 相关资源

### Betaflight
- [官方仓库](https://github.com/betaflight/betaflight)
- [Configurator 仓库](https://github.com/betaflight/betaflight-configurator)
- [Target 配置文档](https://betaflight.com/docs/development/manufacturer/creating-a-target)

### INAV
- [官方仓库](https://github.com/iNavFlight/inav)
- [Configurator 仓库](https://github.com/iNavFlight/inav-configurator)
- [Wiki 文档](https://github.com/iNavFlight/inav/wiki)
- [Target 配置指南](https://github.com/iNavFlight/inav/blob/master/docs/Board%20-%20new%20target.md)

### 对比资源
- [Betaflight vs INAV：选择指南](https://oscarliang.com/betaflight-inav-comparison/)
- [固件特性对比表](https://github.com/iNavFlight/inav/wiki/Betaflight-to-INAV-differences)

---

**下一步行动**：
1. ✅ 按照《固件知识学习.md》完成学习
2. ⏳ 填写本文档的"学习后需要回答的问题"部分
3. ⏳ 联系明月确认硬件配置和target文件
4. ⏳ 根据决策选择方案一或方案二开始实施
