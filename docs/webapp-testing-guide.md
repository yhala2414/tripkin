# 本地页面验证说明

本文档说明如何在 TripKin **MVP 闭环奠基期** 按需使用 `webapp-testing` 做本地页面验证。

`webapp-testing` 是阶段性产品化验证的可选辅助方式，不是项目正式测试框架，也不是默认开发流程。当前不会因此新增 npm `test` 脚本、Playwright 依赖、CI 流程、数据库或真实第三方服务。

## 什么时候才使用

只有当用户或任务明确提到测试、`webapp-testing`、Playwright、自动化验证、截图验证、可重复验证，或要求用浏览器脚本检查页面时，AI 或协作者才使用这套流程。

普通页面开发、样式调整或一次性查看 localhost 时，不默认启用 `webapp-testing`。

## 适合验证什么

适合做可重复浏览器检查：

- 路由可以正常打开，例如 `/match`、`/map`、`/mbti`、`/bottle`、`/profile`。
- JS 加载完成后，页面主体内容正常渲染。
- 375px 宽度下没有明显横向滚动、内容重叠或关键按钮被遮挡。
- 按钮、Tabs、弹层、筛选、跳转等关键交互可以触发。
- 刷新后关键状态仍在，例如 MBTI 结果、当前目的地、阶段 1 用户资产。
- Bottle 投瓶、收藏、关注等行为是否同步到 Profile。
- Match 申请和邀请是否进入用户资产。
- 配置 `VITE_API_BASE_URL` 后，已接入 service 的页面是否切换到 `server/` API。
- 浏览器控制台没有意外运行时报错。
- 需要保存截图作为复查或对比依据。

不适合替代：

- `npm run lint`
- `npm run build`
- 人工视觉走查
- 单元测试或正式 E2E 测试框架
- 官方 CI 验证
- 真实 AI、真实地图服务或真实第三方服务验收

## 本地隔离要求

使用 `webapp-testing` 时，Python 环境和临时脚本必须只放在本地虚拟环境里：

```bash
python -m venv .venv
```

临时 Playwright 脚本必须放在：

```txt
.venv/webapp-tests/
```

自动化运行产物必须放在：

```txt
.venv/webapp-artifacts/screenshots/
.venv/webapp-artifacts/traces/
.venv/webapp-artifacts/logs/
```

不要提交：

- `.venv/`
- 临时 Python Playwright 脚本
- 本地截图
- trace、video、log 等浏览器运行产物

如果某个验证脚本未来需要团队长期复用，需要单独讨论是否引入正式测试目录和依赖。

## Skill 来源

不要把某个人本机 AI 目录里的 `webapp-testing` skill 复制到仓库。它属于个人或 AI 工具环境能力，不是 TripKin 项目源码、项目依赖或团队测试框架。

如果当前 AI 环境没有安装 `webapp-testing`，应说明缺失情况，并引导使用者在自己的 AI 工具环境中安装或启用对应 skill。

## 推荐使用方式

第一次使用前，在 PowerShell 中创建测试区：

```powershell
python -m venv .venv
New-Item -ItemType Directory -Force -Path .venv\webapp-tests, .venv\webapp-artifacts\screenshots, .venv\webapp-artifacts\traces, .venv\webapp-artifacts\logs
```

激活虚拟环境并安装依赖：

```powershell
.\.venv\Scripts\Activate.ps1
python -m pip install playwright
python -m playwright install chromium
```

使用 skill 自带 server helper 前，先查看帮助：

```powershell
python <你的 webapp-testing skill 目录>\scripts\with_server.py --help
```

验证 Vite 页面时，推荐让 helper 管理本地服务生命周期：

```powershell
python <你的 webapp-testing skill 目录>\scripts\with_server.py --server "npm run dev" --port 5173 -- python .venv\webapp-tests\smoke.py
```

临时脚本只写浏览器自动化逻辑。动态页面检查时，需要先等待页面加载完成：

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 375, "height": 812})
    page.goto("http://localhost:5173/match")
    page.wait_for_load_state("networkidle")
    page.screenshot(path=".venv/webapp-artifacts/screenshots/match.png", full_page=True)
    browser.close()
```

## 和其他检查方式的分工

`webapp-testing` 适合可重复检查：路由、渲染、控制台错误、关键交互、刷新后状态、Profile 同步、API base 切换和截图。

人工视觉走查适合判断：页面是否接近参考方向、视觉层级是否舒服、间距和信息密度是否合理。

提交前仍然按变更类型运行：

```bash
npm run lint
npm run build
```

纯文档修改可按需运行：

```bash
npm run format:check
```
