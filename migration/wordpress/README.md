# WordPress 内容迁移

本地环境由 `docker-compose.wordpress.yml` 提供 MariaDB 和 WordPress；Compose 会把 `wordpress/plugins/cshk-content-catalog` 作为 must-use 插件自动加载，提供产品与公开资料两个结构化内容类型，以及 Nuxt 使用的只读接口：

- `GET /wp-json/cshk/v1/products`
- `GET /wp-json/cshk/v1/downloads`

产品记录支持分类、中英文名称/简介、产品详情路由、特色图和卖点。资料记录支持关联产品、Target、文件类型、版本、硬件版本、发布日期、文件大小、SHA-256、构建选项、更新说明和媒体库文件。只有 WordPress 中已发布的记录对公开 API 可见。

## uploads 备份暂存（2026-10-12）

本机 `/home/suki/Betaflight/uploads` 已盘点；选出的 18 个手册、接线图和 Beacon 图传表副本在 `legacy-attachments/`，其实际字节数和 SHA-256 记录于 `uploads-manifest.json`。该目录被 `.gitignore` 排除，只用于本地导入，不会随代码提交。详细筛选和未导入项见 [`uploads-review.md`](uploads-review.md)。

18 项候选附件已上传到本地 WordPress 媒体库，并在人工审核后于 2026-10-12 发布为 18 条下载记录。导入后逐项核对了 WordPress 中原始附件字节数和 SHA-256；用户也已在后台核对标题、结构化字段、产品关联及附件媒体 ID，均与当前迁移清单相符。发布后已确认规范记录 `publish=18`、`draft=0`，之前误建的 18 条 `-2` slug 重复记录仍在回收站，不得恢复。原始 `uploads` 目录保持不动；迁移脚本不读取数据库 `.sql`。
本地 PHP 上传上限配置为 64 MB（`wordpress/php/uploads.ini`），用于迁移较大的附件；数据库和内容卷未清理。

## 旧站来源状态

旧站为 `https://cshk.top/`。当前执行迁移时该站 TLS 证书已过期，安全的命令行抓取在证书校验阶段失败；没有关闭 TLS 校验，也没有将外站地址作为本地文件地址保存。

已决定采用人工迁移，不要求取得 WXR。仅从旧站控制台、可验证的旧站页面或已有备份中核对用户确认要保留的公开页面，并人工记录标题、正文、产品和附件关系。原始附件已按清单暂存并导入；不需要补发布日期或说明文字，相关字段保持空白。不要把旧下载插件生成的临时签名链接当作永久文件。

若后续需要 WXR，它只作为可选的核对材料；导出文件可能包含草稿、评论和用户信息，须先检查并保存在私有位置，不能提交到 Git 或直接公开。

初步页面与附件盘点见[旧站迁移清单](legacy-inventory.md)。其中的公开文件名和页面显示大小用于人工定位，不代替原始文件的 SHA-256、Target 和硬件版本核验。

## 内容准备与导入

`content-manifest.json` 已包含并已导入第一批从旧站公开页面和本地图片核对出的六个产品条目；`content-manifest.example.json` 是空白模板。后续附件放在仓库内的迁移目录，文件路径相对清单填写。产品和下载记录格式如下（字段名可参照现有 Nuxt `Product`、`DownloadItem` 类型）：

```json
{
  "products": [
    {
      "id": "f435-vmt7",
      "name": "F435 VMT7",
      "category": "flight-controller",
      "eyebrow": { "zh": "AT32F435 系列飞控", "en": "AT32F435 flight controller" },
      "description": { "zh": "从旧站核对后的中文介绍", "en": "Verified English description" },
      "href": "/f435-vmt7_service/",
      "imageFile": "files/f435-vmt7.jpg",
      "highlights": []
    }
  ],
  "downloads": [
    {
      "id": "f435-vmt7-manual",
      "name": "重山AT32飞控使用说明书",
      "productId": "f435-vmt7",
      "kind": "manual",
      "channel": "document",
      "hardwareVersion": "",
      "version": "",
      "releaseDate": "",
      "fileName": "重山AT32飞控使用说明书.pdf",
      "filePath": "files/重山AT32飞控使用说明书.pdf",
      "target": "",
      "fileSize": "",
      "sha256": "",
      "changelog": { "zh": "", "en": "" },
      "buildOptions": []
    }
  ]
}
```

示例是字段结构，不是已核验的实际产品内容；先从旧站/原始文件确认字段，不要沿用示例文字。文件大小和 SHA-256 可在本地计算后填入。建议图片和附件使用稳定且唯一的文件名。

本地 WordPress 管理员为 `cshk_admin`；密码和 Application Password 保存在被 Git 忽略的 `.env.wordpress`，不要复制到聊天、提交或共享日志。登录 <http://127.0.0.1:8080/wp-admin/>，在用户个人资料中创建 Application Password，将登录名写入 `WORDPRESS_USERNAME`，应用程序密码写入 `WORDPRESS_APP_PASSWORD`。导入脚本会从 `.env.wordpress` 读取这两个本地变量，可直接运行：

```bash
node scripts/import-wordpress-content.mjs migration/wordpress/uploads-manifest.json
```

脚本拒绝向非本机 HTTP 地址发送凭据，附件路径必须位于 `website` 仓库内；默认创建草稿，重复运行会更新同 slug 的草稿记录。核对后台标题、文案、图片、文件与 SHA-256 后，再由工作人员决定是否发布。不要把应用密码、备份或导出的客户信息提交到 Git。

本地 WordPress 环境类型已设置为 `local`，因此可在仅绑定回环地址的开发环境中使用 Application Password；这项设置只适用于当前本地 Compose 环境。

Nuxt 从服务端访问 WordPress，浏览器不会拿到 WordPress 凭据。产品目录、飞控产品卡、两个飞控详情和下载中心已接入 API；WordPress 未启动时保留旧演示数据以便开发，WordPress 已连接但某类内容还未发布时显示该类空目录。下载中心沿用现有资料卡片逻辑；可选的产品、版本、硬件、Target、发布日期和更新说明为空时不显示，并支持说明书、接线图、驱动/工具、图传表及“资料”通道筛选。只有已发布记录进入公开 API；当前 18 条迁移资料已进入 WordPress 公开 API。生产运行 Nuxt 时必须设置 `NUXT_WORDPRESS_BASE_URL`；只设置 `WORDPRESS_BASE_URL` 会导致 Nitro 运行时回退到演示数据。
