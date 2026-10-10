# 重山航空官网本地框架

`website/apps/web` 是新的 Nuxt 4 + Vue 3 + TypeScript 前端骨架。根目录下原有的静态 HTML 页面继续保留，作为迁移前的视觉和内容参考，不会被覆盖。

完整的需求结论、技术选型、固件编译流程、实施状态和待决策事项见[《项目需求、决策与实施记录》](项目需求、决策与实施记录.md)。

## 当前阶段

- 已建立中文、英文和主要旧网址的路由骨架。
- 已建立首页、产品、服务支持、联系、发动机和下载中心的基础页面。
- 下载中心已经预留产品、Target、固件类型、稳定性、硬件版本、日期和关键词筛选字段。
- 已加入 Betaflight 导航和官方稳定版地面站的构建脚本。
- 已建立独立编译服务，包含任务编号、访问令牌、排队、取消、24 小时下载和隔离 Worker。
- WordPress 和 F435 私有 Target 尚未接入；所有未经硬件验证的编译配置默认禁用。

## 本地启动

```bash
cd /home/suki/Betaflight/website/apps/web
cp .env.example .env
npm install
npm run dev
```

默认访问 <http://localhost:3000>。

### 启动本地 WordPress 内容后台

在 `website` 目录复制数据库密码模板并启动本地 WordPress（端口仅绑定本机）：

```bash
cp .env.wordpress.example .env.wordpress
# 编辑 .env.wordpress，替换两个本地开发密码
docker compose --env-file .env.wordpress -f docker-compose.wordpress.yml up -d
```

首次访问 <http://127.0.0.1:8080> 完成 WordPress 初始化。**CSHK Content Catalog** 作为 must-use 插件由 Compose 自动加载，无需在插件页手动启用。Nuxt 的 `.env.example` 已配置该本地 REST 地址；启动 Nuxt 后，产品和下载目录会优先读 WordPress 中已发布内容。未启动 WordPress 或 API 不可用时仍回退到演示数据，API 返回空列表时则展示空内容，不会把演示条目混进已接通的目录。

旧站文件迁移清单、数据格式和导入步骤见 [WordPress 内容迁移说明](migration/wordpress/README.md)。导入脚本只接受本机 WordPress 地址，默认创建草稿；复核内容后可用 `--publish` 发布。

Betaflight 地面站访问 <http://localhost:3000/betaflight/>。首次部署前需在项目根目录运行 `bash scripts/build-betaflight-app.sh` 生成地面站资源；生成结果不提交到 Git。

编译服务在 `services/firmware` 运行 `npm start`，网站的 `FIRMWARE_API_BASE_URL` 需指向 `http://127.0.0.1:8090`（已有 `.env` 请补充此项）。所有 profile 默认禁用，开放前需完成工具链、构建选项和硬件验证，详见 [编译服务说明](services/firmware/README.md)。

如果 `npm install` 在当前网络环境下无法完成，请按照[本地安装与启动指南](本地安装与启动指南.md)中的镜像切换、网络检查和验证步骤自行安装。

## 后续接入顺序

1. 从旧站取得内容导出和原始媒体/下载文件，整理后导入本地 WordPress。
2. 逐步把其余页面和内容类型接入已建立的 WordPress REST API。
3. 完成下载中心审核流程及后续 WordPress 固件管理插件。
4. 验证官方 Target 和私有 F435 Target 后，在白名单中逐项开放隔离编译 Worker。

## 目录说明

```text
apps/web/app/       Nuxt 页面、组件、布局和样式
apps/web/server/    Nuxt/Nitro API 框架接口
apps/web/shared/    前后端共享类型与演示数据
migration/          页面路由和迁移清单
```
