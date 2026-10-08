# 重山航空官网本地框架

`website/apps/web` 是新的 Nuxt 4 + Vue 3 + TypeScript 前端骨架。根目录下原有的静态 HTML 页面继续保留，作为迁移前的视觉和内容参考，不会被覆盖。

完整的需求结论、技术选型、固件编译流程、实施状态和待决策事项见[《项目需求、决策与实施记录》](项目需求、决策与实施记录.md)。

## 当前阶段

- 已建立中文、英文和主要旧网址的路由骨架。
- 已建立首页、产品、服务支持、联系、发动机和下载中心的基础页面。
- 下载中心已经预留产品、Target、固件类型、稳定性、硬件版本、日期和关键词筛选字段。
- 已预留任务编号、访问令牌、可选邮箱和编译任务 API。
- WordPress、真实固件编译器和 F435 Target 尚未接入；当前 API 使用演示数据。

## 本地启动

```bash
cd /home/suki/Betaflight/website/apps/web
cp .env.example .env
npm install
npm run dev
```

默认访问 <http://localhost:3000>。

如果 `npm install` 在当前网络环境下无法完成，请按照[本地安装与启动指南](本地安装与启动指南.md)中的镜像切换、网络检查和验证步骤自行安装。

## 后续接入顺序

1. 启动本地 WordPress 和 MariaDB，导入公开页面与媒体资料。
2. 将 `server/api/content` 的演示数据切换为 WordPress REST API。
3. 完成下载中心的数据模型和 WordPress 固件管理插件。
4. 找到并登记真实 F435 Target 后，再接入隔离编译 worker。

## 目录说明

```text
apps/web/app/       Nuxt 页面、组件、布局和样式
apps/web/server/    Nuxt/Nitro API 框架接口
apps/web/shared/    前后端共享类型与演示数据
migration/          页面路由和迁移清单
```
