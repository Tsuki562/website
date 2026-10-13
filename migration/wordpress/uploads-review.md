# 旧站 uploads 附件迁移暂存

来源目录：`/home/suki/Betaflight/uploads`。原始目录未修改。

## 盘点结果

- 目录约 230 MB，含 360 个正常文件和 538 个 `Zone.Identifier` 下载标记。
- 内容包括 WordPress 图片及其缩略图、说明书、接线图、9 组图传表、私有飞控固件 ZIP、驱动/刷机工具 ZIP、Android APK，以及旧 WordPress 插件的缓存/控制文件。
- 图传表在 `download-manager-files` 与 `2024/12` 中有相同字节的重复副本；暂存清单只保留一份。2025/11 的 3W（Basis）表为另一个不同文件。
- `2025.04.30重山航空图传教程.png` 在下载目录和 `2025/05` 下 SHA-256 一致，只暂存一份。

## 暂存并准备创建为草稿的 18 项

附件在 `legacy-attachments/`，导入清单为 `uploads-manifest.json`。清单记录了实际字节大小和 SHA-256，所有下载记录通过现有导入器以草稿状态写入，不会直接出现在公开 API/下载中心。

- 6 份 PDF：AT32 飞控说明书、INAV 刷写教程、500MHz/2W/2.5W 图传说明书、Beacon 故障排查指南。
- 2 张飞控接线图及 1 张图传教程图。
- 9 个 Beacon 图传表 ZIP（包内为 JSON 表文件）。

飞控通用说明书、INAV 教程和接线图暂未关联具体飞控产品，等 WXR/旧页面核对硬件版本后再关联。Beacon 资料暂关联到已有 `beacon-vtx` 产品，但仍需工作人员在 WordPress 草稿中核实名称、适用型号和内容后再发布。

## 暂不导入的项目

- 4 个 RGT7/VMT7 固件 ZIP：含 HEX；硬件、Target、版本与刷写适配仍待核验，不能进入公开下载中心。
- `所需驱动与刷机工具.zip` 等驱动包：内含 EXE 和嵌套压缩包，安全扫描/版本核对前不导入。
- Android 地面站 APK：来源签名和安全性未核验。
- `AT32-PX4固件烧录指南（测试版）.doc`：标记为测试版，暂待确认。
- QQ 群/个人微信二维码图片：涉及联系渠道/个人信息，先不公开迁移。
- 各年份目录中的产品原图、Logo 和横幅：文件保留在原始备份，暂不批量导入；其中混有 WordPress 自动生成的多种尺寸，且没有 WXR 附件关系，需先核对产品、页面和替代文本，避免缩略图重复及图片错配。
- WordPress 缩略图、缓存、`.htaccess`、`index.html` 和插件元数据：不是独立内容附件；后续由 WXR/原始数据库关系核对，不批量灌入媒体库。

## 当前阻塞与后续

本次环境中 Docker 命令提示当前 WSL 发行版未连接 Docker Desktop，`127.0.0.1:8080` 的本地 WordPress API 也未响应。因此目前只完成安全盘点、复制暂存文件和草稿导入清单，尚未写入 WordPress。

待本地 WordPress 恢复后，在 `website` 目录按 `README.md` 设置本地 Application Password，再运行：

```bash
export WORDPRESS_BASE_URL=http://127.0.0.1:8080
export WORDPRESS_USERNAME=cshk_admin
export WORDPRESS_APP_PASSWORD='本地 WordPress Application Password'
node scripts/import-wordpress-content.mjs migration/wordpress/uploads-manifest.json
```

不要添加 `--publish`；不要把 `.sql`、WordPress 管理员密码或 Application Password 发到聊天。数据库/WXR 到手后，再恢复旧页面和附件的准确关联；所有固件、驱动安装包及二维码都需要单独确认后处理。
