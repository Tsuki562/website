# 固件编译服务

该服务为 Betaflight 原版地面站提供匿名编译任务、访问令牌、排队、取消、下载和 24 小时清理。它只接受 `profiles.json` 中启用的固定源码提交、Target 与构建选项。

## Target 开放范围

当前已开放固定 Betaflight `2026.6.2` 提交中的全部上游 Target：662 个 profile（629 个 `CONFIG` 板卡配置、33 个平台 `TARGET`），统一只允许默认 `CLOUD_BUILD` 选项组合。其中包含上游 `GMRC/GREATMOUNTAINF435` 配置；这不代表它已被确认对应重山的 RGT7/VMT7，也不代表这些 Target 均已完成本机编译或真实硬件验证。此前已验证 `MATEKF722`；2026-10-15 新增 6 个真实 Worker 编译成功样本，覆盖 ARM 和 SITL（`none`）两类 SDK，详见[抽样验证报告](validation-2026-10-15.md)。

上游清单从固定源码提交和 `src/config` 子模块提取，区分 `CONFIG=` 与 `TARGET=` 构建方式，并记录对应 SDK 和产物格式。私有硬件不在上游清单内的 Target 仍须另行确认硬件映射、构建选项，并在对应真实飞控上验证刷写和关键外设。只有明确列在 `allowedOptionSets` 中的完整选项组合才可提交；不会接受任意 Target、源码或脚本。

profile 开放表示服务白名单接受对应 Target 的固定版本/默认选项请求，不表示全部 SDK Worker 镜像都已构建、所有目标编译都实测成功，或固件适用于任何特定硬件。非 ARM SDK 需分别构建对应 Worker；工具链镜像 digest 仍待固定核验。生产部署前还须评估资源限制并完成压力测试；此变更不代表服务已公网部署。

## 新增 profile 时的验证要求

每个新增 profile 至少应完成：

- 固件提交、Target 和 MCU 对应关系核验；
- `allowedOptions` 与官方构建选项核验；
- 在 `allowedOptionSets` 中列出完整、已经验证的用户选项组合（前端自动加的 `CLOUD_BUILD` 也须列入）；不接受只验证单个选项后任意组合；
- 对应 Target 的 Worker 编译和产物校验；
- 对私有硬件 profile，完成真实硬件刷写与关键外设测试。

## 启动

```bash
cd /home/suki/Betaflight/website/services/firmware
./build-worker.sh /path/to/betaflight-2026.6.2-src arm
node server.mjs
```

`build-worker.sh` 的第二个参数选择 SDK（例如 `arm`、`esp_idf`、`pico_sdk`）；每类 SDK 使用独立 Worker 镜像。profiles 中列出的所有 SDK 尚未全部完成镜像构建和真实编译验证。

开发默认监听 `127.0.0.1:8090`。Nuxt 通过 `FIRMWARE_API_BASE_URL` 在服务器内部访问它；生产环境不要将此端口直接暴露到公网。

常用环境变量：`FIRMWARE_CONCURRENCY`、`FIRMWARE_QUEUE_LIMIT`、`FIRMWARE_BUILD_TIMEOUT_SECONDS`、`FIRMWARE_WORKER_MEMORY`、`FIRMWARE_WORKER_CPUS` 和 `FIRMWARE_DATA_DIR`。

默认 1 路并发、50 个等待任务、900 秒编译超时是本地开发参数，生产值尚未确定。排队不设置自动取消期限。运行中任务在服务重启时标记失败，排队任务保留；正常退出会取消正在运行的任务。

Worker 镜像使用官方 `betaflight/betaflight-build:<sdk>-2026.6` 工具链和固定固件提交；ARM 基础镜像曾在本机完成构建，其他 SDK 基础镜像需分别准备。Worker 镜像从用户本地已校验的 Betaflight 源码检出构建，不在 Docker 内访问 GitHub，并通过 `--network=none` 禁止构建步骤联网；构建时也会在镜像副本中把 Windows Git 的换行格式规范化为 Linux 格式。使用方式：`./build-worker.sh /path/to/betaflight-2026.6.2-src <sdk>`。生产部署前须记录并固定工具链镜像 digest，并将其写入 profile 的 `toolchain`。

Worker 只从 `obj/` 复制与 profile 构建方式、Target 和产物格式匹配的单个文件，不扫描或保留整份构建目录；找不到预期产物时任务失败并清理临时文件。`CONFIG=` 产物带 MCU 与配置名，平台 `TARGET=` 产物使用 Target 名；格式按上游平台配置选择 HEX、BIN、UF2 或仿真可执行文件。实际 MATEKF722 编译输出为 `betaflight_2026.6.2_STM32F722_MATEKF722.hex`；SITL 为无后缀的 `betaflight_2026.6.2_SITL`。HEX 和 SITL 产物提取已真实验证，BIN、UF2 和其余 SDK 仍待依赖准备及抽样验证。

生产环境需用 systemd 或容器编排启动服务，并限制 Docker 权限。Node 服务不接受镜像名、源码地址、Shell 脚本或任意编译参数。Docker Worker 使用无网络、无 Linux capabilities、非 root 用户和资源限制运行。

`optionGroups` 使用原版地面站的 `radioProtocols`、`telemetryProtocols`、`motorProtocols`、`generalOptions` 数组，各项包含 `name`、`value`、`default`。`value` 必须是实际交给 `make OPTIONS=...` 的宏；这里没有提供官方云端参数到编译宏的自动转换。需在启用 profile 前核对源码定义，不能直接把官方云端标签当作编译宏。
