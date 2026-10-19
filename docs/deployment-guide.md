# 重山航空网站部署指南

> 目标服务器：2 核 CPU / 2GB 内存 / 40GB 系统盘（练习环境）

## 整体架构

```
用户浏览器
    │
    ▼
Nuxt SSR (Node.js, :3000)
    │
    ├──► WordPress REST API (Apache + PHP, :8080)
    │         │
    │         ▼
    │    MariaDB (:3306)
    │
    └──► Firmware 编译服务 (:8090)  ← 可选，练习阶段可不部署
```

所有服务跑在同一台机器上，WordPress + MariaDB 通过 Docker Compose 管理，Nuxt 和 Firmware 服务直接用 Node.js 运行。

---

## 第一步：服务器初始化

以 root 或 sudo 用户 SSH 登录服务器。

### 1.1 更新系统

```bash
apt update && apt upgrade -y
```

### 1.2 创建 2GB Swap（防止内存不足）

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# 写入 fstab，重启后自动挂载
echo '/swapfile none swap sw 0 0' >> /etc/fstab

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

验证：

```bash
free -h
# 应该能看到 Swap: 2.0G
```

### 1.3 安装 Docker

```bash
curl -fsSL https://get.docker.com | sh
systemctl enable docker
systemctl start docker

# 安装 Docker Compose 插件（新版 Docker 自带，验证一下）
docker compose version
```

### 1.4 安装 Node.js 24

```bash
# 使用 NodeSource 官方源
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# 验证
node -v   # 应该 >= 24.0.0
npm -v
```

### 1.5 安装其他工具

```bash
apt install -y git
```

---

## 第二步：上传项目代码

### 方式一：Git 克隆（推荐）

```bash
mkdir -p /opt/cshk
cd /opt/cshk
git clone <你的仓库地址> website
cd website
```

### 方式二：本地打包上传

在本地机器上：

```bash
# 打包（排除 node_modules 和构建产物）
tar czf website.tar.gz \
  --exclude='node_modules' \
  --exclude='.output' \
  --exclude='.cache' \
  website/

# 上传到服务器
scp website.tar.gz root@<服务器IP>:/opt/cshk/
```

在服务器上：

```bash
cd /opt/cshk
tar xzf website.tar.gz
cd website
```

---

## 第三步：启动 WordPress + MariaDB

### 3.1 配置环境变量

```bash
cd /opt/cshk/website

# 从示例文件创建配置（如果还没有的话）
cp .env.wordpress.example .env.wordpress
```

编辑 `.env.wordpress`，设置**强密码**：

```bash
nano .env.wordpress
```

内容如下（把密码改成你自己的）：

```env
WORDPRESS_DB_PASSWORD=你的数据库密码-改成随机字符串
WORDPRESS_DB_ROOT_PASSWORD=你的root密码-改成随机字符串
```

生成随机密码的简单方法：

```bash
openssl rand -hex 32
```

### 3.2 启动容器

```bash
docker compose -f docker-compose.wordpress.yml up -d
```

### 3.3 验证

```bash
# 查看容器状态，两个都应该是 running / healthy
docker compose -f docker-compose.wordpress.yml ps

# 测试 WordPress 是否响应
curl -s http://127.0.0.1:8080/ | head -20
```

### 3.4 限制 MariaDB 内存（2GB 服务器建议）

```bash
# 创建自定义配置
mkdir -p /opt/cshk/mariadb-conf
cat > /opt/cshk/mariadb-conf/low-memory.cnf << 'EOF'
[mysqld]
innodb_buffer_pool_size = 128M
innodb_log_buffer_size = 8M
max_connections = 30
tmp_table_size = 16M
max_heap_table_size = 16M
EOF
```

然后在 `docker-compose.wordpress.yml` 的 `wordpress-db` 服务中加一行 volume 挂载：

```yaml
services:
  wordpress-db:
    image: mariadb:11.4
    volumes:
      - wordpress-db:/var/lib/mysql
      - /opt/cshk/mariadb-conf/low-memory.cnf:/etc/mysql/conf.d/low-memory.cnf:ro
```

重启数据库使配置生效：

```bash
docker compose -f docker-compose.wordpress.yml restart wordpress-db
```

### 3.5 初始化 WordPress

浏览器访问 `http://<服务器IP>:8080`，完成 WordPress 安装向导：
- 选择语言：中文
- 设置站点标题、管理员账号和密码
- 安装完成后登录后台

如果服务器有防火墙，临时开放 8080 端口，安装完后可以关掉（Nuxt 通过 127.0.0.1 内部访问 WordPress）。

---

## 第四步：构建和启动 Nuxt 前端

### 4.1 配置环境变量

```bash
cd /opt/cshk/website/apps/web

# 从示例创建
cp .env.example .env
nano .env
```

`.env` 内容：

```env
NUXT_PUBLIC_SITE_NAME=重山航空
NUXT_PUBLIC_SITE_URL=http://<你的服务器IP或域名>

# WordPress API 地址（Docker 内部地址）
WORDPRESS_BASE_URL=http://127.0.0.1:8080

# Firmware 服务地址（如果不部署可留空）
FIRMWARE_API_BASE_URL=http://127.0.0.1:8090
```

### 4.2 安装依赖

```bash
cd /opt/cshk/website/apps/web
npm install
```

### 4.3 构建

```bash
# 限制 Node.js 内存，防止 2GB 服务器 OOM
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

构建成功后会生成 `.output/` 目录。

> 如果服务器上构建失败（内存不足），可以在本地构建好 `.output` 目录后上传到服务器。

### 4.4 测试运行

```bash
cd /opt/cshk/website/apps/web
node .output/server/index.mjs
```

浏览器访问 `http://<服务器IP>:3000`，确认页面正常。`Ctrl+C` 停止。

### 4.5 配置 systemd 守护进程

创建 service 文件让 Nuxt 开机自启、崩溃自动重启：

```bash
cat > /etc/systemd/system/cshk-web.service << 'EOF'
[Unit]
Description=CSHK Nuxt Web Server
After=network.target docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/cshk/website/apps/web
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=NODE_OPTIONS=--max-old-space-size=384
Environment=HOST=0.0.0.0
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF
```

启动服务：

```bash
systemctl daemon-reload
systemctl enable cshk-web
systemctl start cshk-web

# 查看状态
systemctl status cshk-web

# 查看日志
journalctl -u cshk-web -f
```

---

## 第五步（可选）：部署 Firmware 编译服务

> 练习阶段可以跳过，这个服务是给 Betaflight 固件在线编译用的。

```bash
cd /opt/cshk/website/services/firmware
npm install
```

创建 systemd 服务：

```bash
cat > /etc/systemd/system/cshk-firmware.service << 'EOF'
[Unit]
Description=CSHK Firmware Build Service
After=network.target docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/cshk/website/services/firmware
ExecStart=/usr/bin/node server.mjs
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=8090

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cshk-firmware
systemctl start cshk-firmware
```

> 注意：Firmware 服务需要 Docker 来执行编译，会额外消耗内存和 CPU。2GB 机器上同时编译固件会很吃力。

---

## 第六步：配置 Nginx 反向代理

用 Nginx 统一入口，把 80 端口的请求转发给 Nuxt。

### 6.1 安装 Nginx

```bash
apt install -y nginx
```

### 6.2 配置站点

```bash
cat > /etc/nginx/sites-available/cshk << 'EOF'
server {
    listen 80;
    server_name _;

    # Nuxt SSR
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/cshk /etc/nginx/sites-enabled/cshk
rm -f /etc/nginx/sites-enabled/default

# 测试并重启
nginx -t
systemctl restart nginx
systemctl enable nginx
```

现在访问 `http://<服务器IP>` 就能看到网站了。

---

## 第七步（可选）：配置 HTTPS

如果有域名，用 Let's Encrypt 免费证书：

```bash
apt install -y certbot python3-certbot-nginx

# 先把 Nginx 配置里的 server_name _ 改成你的域名
# 比如 server_name www.example.com;

certbot --nginx -d www.example.com
```

---

## 防火墙配置

```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS（如果配了）
ufw enable

# 不要对外开放 3000、8080、8090 端口
# 这些通过 Nginx 反向代理或内部访问
```

---

## 常用运维命令

```bash
# 查看所有服务状态
systemctl status cshk-web
systemctl status cshk-firmware
docker compose -f /opt/cshk/website/docker-compose.wordpress.yml ps

# 重启服务
systemctl restart cshk-web

# 查看 Nuxt 日志
journalctl -u cshk-web -f --no-pager -n 50

# 查看内存使用
free -h

# 查看各进程内存占用
ps aux --sort=-%mem | head -15

# 更新代码后重新部署
cd /opt/cshk/website
git pull
cd apps/web
npm install
NODE_OPTIONS="--max-old-space-size=512" npm run build
systemctl restart cshk-web
```

---

## 部署检查清单

- [ ] Swap 已启用（`free -h` 确认）
- [ ] Docker 已安装且运行
- [ ] Node.js >= 24 已安装
- [ ] `.env.wordpress` 密码已修改（不要用默认值）
- [ ] WordPress + MariaDB 容器正常运行
- [ ] MariaDB 内存限制已配置
- [ ] `apps/web/.env` 已配置
- [ ] Nuxt 构建成功
- [ ] `cshk-web` systemd 服务正常运行
- [ ] Nginx 反向代理已配置
- [ ] 防火墙只开放了 22/80/443
- [ ] 访问 `http://<IP>` 能看到页面
