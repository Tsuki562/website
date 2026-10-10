# 固件编译服务

该服务为 Betaflight 原版地面站提供匿名编译任务、访问令牌、排队、取消、下载和 24 小时清理。它只接受 `profiles.json` 中启用的固定源码提交、Target 与构建选项。

## 启用前验证

默认配置全部禁用，避免把未经硬件验证的固件提供给顾客。启用某个 profile 前必须完成：

- 固件提交、Target 和 MCU 对应关系核验；
- `allowedOptions` 与官方构建选项核验；
- 在 `allowedOptionSets` 中列出完整、已经验证的用户选项组合（前端自动加的 `CLOUD_BUILD` 也须列入）；不接受只验证单个选项后任意组合；
- 真实硬件刷写与外设测试；
- Worker 镜像构建和资源压测。

## 启动

```bash
cd /home/suki/Betaflight/website/services/firmware
./build-worker.sh
node server.mjs
```

开发默认监听 `127.0.0.1:8090`。Nuxt 通过 `FIRMWARE_API_BASE_URL` 在服务器内部访问它；生产环境不要将此端口直接暴露到公网。

常用环境变量：`FIRMWARE_CONCURRENCY`、`FIRMWARE_QUEUE_LIMIT`、`FIRMWARE_BUILD_TIMEOUT_SECONDS`、`FIRMWARE_WORKER_MEMORY`、`FIRMWARE_WORKER_CPUS` 和 `FIRMWARE_DATA_DIR`。

默认 1 路并发、50 个等待任务、900 秒编译超时是本地开发参数，生产值尚未确定。排队不设置自动取消期限。运行中任务在服务重启时标记失败，排队任务保留；正常退出会取消正在运行的任务。

Worker 使用官方 `betaflight/betaflight-build:arm-2026.6` 工具链镜像以及固定固件提交。生产部署前须记录并固定工具链镜像 digest，并将其写入 profile 的 `toolchain`。当前镜像尚未在本机 Docker 中验证。

Worker 只从 `obj/` 复制与 profile 的版本和 Target 完全匹配的 `betaflight_<版本>_<Target>.hex`，不扫描或保留整份构建目录；找不到该文件时任务失败并清理临时产物。该命名依据 Betaflight 2026.6.2 固件 [Makefile](https://github.com/betaflight/betaflight/blob/2026.6.2/Makefile) 中的 `TARGET_FULLNAME` / `TARGET_HEX` 规则，真实容器构建仍须另行验证。

生产环境需用 systemd 或容器编排启动服务，并限制 Docker 权限。Node 服务不接受镜像名、源码地址、Shell 脚本或任意编译参数。Docker Worker 使用无网络、无 Linux capabilities、非 root 用户和资源限制运行。

`optionGroups` 使用原版地面站的 `radioProtocols`、`telemetryProtocols`、`motorProtocols`、`generalOptions` 数组，各项包含 `name`、`value`、`default`。`value` 必须是实际交给 `make OPTIONS=...` 的宏；这里没有提供官方云端参数到编译宏的自动转换。需在启用 profile 前核对源码定义，不能直接把官方云端标签当作编译宏。
