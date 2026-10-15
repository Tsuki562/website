# 2026-10-15 SDK / Target 抽样编译验证

本轮抽样 6 个 Target，全部通过真实 `BuildQueue` 编译、预期文件提取、大小限制和 SHA-256 记录。没有全量编译，也没有连接或刷写硬件。

## 环境与方法

- Docker Desktop 的 WSL 集成可用；沙箱内访问 Docker socket 被拒绝，获准在沙箱外执行后成功。
- 固件：`2026.6.2`，提交 `e0b7bb01b17b21351057e9ead2d1ab39dd44fa16`。
- 配置子模块：`3a406c5c30c20d7c3bc7dd5ed547cca961baf0a9`；libcanard：`601ed35467e0ac38819df17cd7c918de19f62d58`。
- 原始检出：`/mnt/c/Users/Tsuki/Downloads/betaflight-2026.6.2-src`。固定提交、源码干净状态及已初始化子模块检查通过；没有修改原始检出。
- ARM Worker：`cshk-betaflight:2026.6.2`。通过 `build-worker.sh <source> none` 成功构建 SITL Worker：`cshk-betaflight:2026.6.2-none`；两者使用相同 ARM 基础镜像，内含原生 GCC/G++。
- 两个 Worker 对应本地镜像 ID：`sha256:eea2f58cafca5657c417fd6a84fbc2f78bfb756259a57e540a72e0c5c649b8e3`。这是本地镜像 ID，不是已固定的仓库 digest。
- 使用现有 profile，不覆盖镜像或选项：`make CONFIG=<board>` 或 `make TARGET=<platform>`，`OPTIONS=CLOUD_BUILD -j1`。
- 使用真实 Worker 的无网络、非 root、移除 capabilities、2 GiB 内存、1 CPU、256 PID 限制；抽测队列并发为 2，超时为 900 秒。
- 临时验证脚本首轮因日志文件名错误中断；修正后清理本次自己的两个容器并重跑，以下是最终结果。任务结束时 Worker 已清理各自容器，保留临时产物及日志供复查。

## 成功样本

| SDK | Target | MCU | 选择器 | 产物 | 字节 |
| --- | --- | --- | --- | --- | ---: |
| arm | ACCIF405 | STM32F405 | CONFIG | HEX | 1536880 |
| arm | 2RAW_THUNDER_H7 | STM32H743 | CONFIG | HEX | 1625174 |
| arm | ACCIF435 | AT32F435G | CONFIG | HEX | 1502545 |
| arm | LUXHDAIO-G4 | STM32G474 | CONFIG | HEX | 1112168 |
| arm | STM32F405 | STM32F405 | TARGET | HEX | 1746865 |
| none | SITL | SITL | TARGET | 无后缀 ELF | 538352 |

覆盖不同 MCU、含连字符的配置名、板卡/平台两种选择器，以及 HEX/无后缀可执行文件。AT32 使用 ARM SDK，不算独立 SDK。5 份 HEX 均通过逐行长度、校验和及 EOF 校验；SITL 确认为 ELF64 x86-64。6 份文件重新计算的 SHA-256 均与任务记录一致。

| Target | SHA-256 |
| --- | --- |
| ACCIF405 | `cd6af3fdeee8d3b6449df35d4016ee42c5c3b08c4763b3aa8807a21bb8f2b61c` |
| 2RAW_THUNDER_H7 | `957d18f9693d25d7fc89a973795f7e3e66e44b961a19bea748907c5de93ca31c` |
| ACCIF435 | `cd6602abcc69f5c259bd1090edde51b10669bcd903f63b0b94a08f43ff7ad615` |
| LUXHDAIO-G4 | `234ef6af987c89e376e0004ab3565cfba5066721018e764e2b6d5b0c3f0431a5` |
| STM32F405 | `d9db5d0e69ae760bef36066a5c8598ee757b9b78540583f14c03a40274702c37` |
| SITL | `f7ab4947e253d7e56990480f4a374d3fb200f936c52aa546bbab21a95c95cc53` |

ARM 结果与完整日志：`/tmp/cshk-firmware-samples-k5YZA7/results.json`；SITL：`/tmp/cshk-firmware-samples-Pn0LyF/results.json`。结果文件包含任务 ID、准确文件名、产物路径与日志路径。临时文件可能被系统清理，未纳入 Git；上述摘要及校验值保存在本报告中。

## 其他 SDK 的依赖检查

以下 SDK 均缺少对应 `betaflight/betaflight-build:<sdk>-2026.6` 基础镜像与已初始化的源码子模块，未进入真实编译，不计为编译失败。本轮没有下载新工具链或 SDK。

| SDK | 后续抽样候选 | 缺少的源码子模块 |
| --- | --- | --- |
| apm32f4 | APM32F405 | lib/modules/APM32F4 |
| esp_idf | ESP32S3 | lib/modules/esp-idf |
| pico_sdk | PICO2_2350A | lib/modules/pico-sdk |
| stm32c5 | NUCLEOC562 | lib/modules/STM32C5 |
| stm32h5 | NUCLEOH563ZI | lib/modules/STM32H5 |
| stm32n6 | OPENN657V1 | lib/modules/STM32N6 |
| x32m7 | X32M7B | lib/modules/X32M7 |

下一轮可优先准备 `pico_sdk` 或 `esp_idf` 的依赖，各选一个 Target，补充 UF2 或 BIN 的真实产物验证。需要同时准备固定版本 SDK 子模块、其必要嵌套依赖和对应工具链镜像。

## 其他检查与边界

- `node --test --test-isolation=none services/firmware/test/*.test.mjs`：13/13 通过。最初沙箱内默认隔离运行在 HTTP 测试中发生 Node 原生断言退出；沙箱外上述完整运行通过。
- `bash -n services/firmware/build-worker.sh`、`git diff --check` 通过。
- 本轮使用真实队列，未重新验证 HTTP 下载/取消、前端交互或 SITL 运行行为；这些不能从编译结果推定。
- BIN、UF2 和剩余 SDK 尚未真实编译验证。已开放的 662 个 profile 保持启用；私有硬件适配、实机刷写、公网部署、工具链仓库 digest 固定及生产压测仍未完成。
