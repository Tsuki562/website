# WordPress 内容迁移

本地环境由 `docker-compose.wordpress.yml` 提供 MariaDB 和 WordPress；Compose 会把 `wordpress/plugins/cshk-content-catalog` 作为 must-use 插件自动加载，提供产品与公开资料两个结构化内容类型，以及 Nuxt 使用的只读接口：

- `GET /wp-json/cshk/v1/products`
- `GET /wp-json/cshk/v1/downloads`

产品记录支持分类、中英文名称/简介、产品详情路由、特色图和卖点。资料记录支持关联产品、Target、文件类型、版本、硬件版本、发布日期、文件大小、SHA-256、构建选项、更新说明和媒体库文件。只有 WordPress 中已发布的记录对公开 API 可见。

## 旧站来源状态

旧站为 `https://cshk.top/`。当前执行迁移时该站 TLS 证书已过期，安全的命令行抓取在证书校验阶段失败；搜索索引仍可读取部分页面文本，但不足以安全、完整地取得 WordPress 导出和所有原始附件。没有关闭 TLS 校验，也没有将外站地址作为本地文件地址保存。

开始正式导入前，需要从旧站控制台/主机取得：

1. WordPress Tools → Export 导出的公开页面、产品/下载条目 XML（WXR）；
2. `wp-content/uploads` 中对应的原始图片、说明书、接线图、固件/图传表和驱动包，或旧服务器提供的完整备份；
3. 产品与下载文件的对应关系，尤其是硬件版本、固件 Target/版本和发布时间。

WXR 可供人工核对页面文案与旧 URL；不要把旧下载插件生成的临时签名链接当作永久文件。文件应从原始备份放到待整理目录，再由下面的导入清单上传至本地 WordPress 媒体库。

初步页面与附件盘点见[旧站迁移清单](legacy-inventory.md)。其中的公开文件名和页面显示大小用于找文件，不代替原始文件的 SHA-256、Target 和硬件版本核验。

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

本地首次安装已创建 `cshk_admin` 管理员；密码保存在被 Git 忽略的 `.env.wordpress`，不要复制到聊天、提交或共享日志。登录 <http://127.0.0.1:8080/wp-admin/>，在用户个人资料中创建 Application Password，然后在本地 shell 设置认证变量并导入：

```bash
export WORDPRESS_BASE_URL=http://127.0.0.1:8080
export WORDPRESS_USERNAME=cshk_admin
export WORDPRESS_APP_PASSWORD='本地应用程序密码'
node scripts/import-wordpress-content.mjs migration/wordpress/content-manifest.json
```

脚本拒绝向非本机 HTTP 地址发送凭据，附件路径必须位于 `website` 仓库内；默认创建草稿且支持重复执行更新同 slug 记录。核对后台标题、文案、图片、文件与 SHA-256 后，在 WordPress 后台发布；也可以在清单全部复核后显式运行 `--publish`。不要把应用密码、备份或导出的客户信息提交到 Git。

本地 WordPress 环境类型已设置为 `local`，因此可在仅绑定回环地址的开发环境中使用 Application Password；这项设置只适用于当前本地 Compose 环境。

Nuxt 从服务端访问 WordPress，浏览器不会拿到 WordPress 凭据。产品目录、飞控产品卡、两个飞控详情和下载中心已接入 API；WordPress 未启动时保留旧演示数据以便开发，WordPress 已连接但某类内容还未发布时显示该类空目录。
