# TripKin

<p align="center">
  <img alt="Project status" src="https://img.shields.io/badge/status-MVP%20closure%20foundation-6d5df6">
  <img alt="Mobile H5" src="https://img.shields.io/badge/mobile-H5-8b7cf6">
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white">
  <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white">
  <img alt="TypeScript 6" src="https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white">
  <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-green">
</p>

TripKin 是一个移动端 H5 旅行搭子与旅行陪伴产品，当前处于 **MVP 闭环奠基期**。

它围绕“旅行前不知道去哪、和谁去、怎么玩”的轻量场景，串联旅行 MBTI、目的地探索、旅行漂流瓶、搭子 / 行程匹配和个人旅行身份页。当前工作重点不再只是页面能打开，而是逐步补齐用户行为、数据流转和 Profile 资产沉淀，让它从页面型演示演进为上线产品雏形。

<table>
  <tr>
    <td>
      <strong>一张 AI 协作系统的小贴纸</strong>
      <br><br>
      TripKin 不只是一个移动端 H5 旅行陪伴 MVP。它也是
      <a href="https://github.com/yhala2414/ai-collaboration-operating-system">project-collaboration-operating-system</a>
      skill 最早长出来的地方。
      <br><br>
      在 TripKin 的迭代里，我们反复遇到过一些很真实的小问题：
      AI 没读完上下文就开工。
      临时草稿被当成正式规则。
      协作者对同一条文档理解不一致。
      规则散落在不同地方，慢慢开始漂移。
      界面说“已保存”，但背后没有写入路径。
      任务说“完成了”，却拿不出验证证据。
      <br><br>
      后来，这些纠偏经验被整理成一个轻量 skill；现在它又回到 TripKin，
      继续检验这个项目如何和 AI agent 更可靠地一起长大。
      <br><br>
      如果你也在和 AI 一起做项目，欢迎从 TripKin 的
      <a href="AGENTS.md">AGENTS.md</a>、
      <a href="docs/collaboration-guide.md">协作说明</a> 和
      <a href="docs/decision-notes/README.md">决策记录</a> 读起。
      也欢迎去 skill 仓库一起讨论、试用和改进这套仍在生长的 AI 协作操作系统。
    </td>
  </tr>
</table>

## 产品体验

当前主链路：

```txt
首页 / 地图 / AI 灵感 -> MBTI 旅行人格 -> 目的地探索 -> 漂流瓶 / 搭子匹配 -> Profile 用户资产沉淀
```

核心体验包括：

- 用旅行 MBTI 生成用户的 TripKin 旅行人格。
- 在地图中浏览目的地、热度、漂流瓶和搭子信息。
- 围绕目的地查看旅行故事、心愿、攻略和搭子瓶。
- 按目的地查看搭子和可加入行程。
- 在个人页沉淀旅行身份、标签、足迹、故事、收藏、行程申请和同行邀请。

## 当前阶段：MVP 闭环奠基期

TripKin 当前按阶段放开能力，避免一次性引入过多系统导致维护和协作失控。

阶段 1：前端闭环

- 使用 Zustand/local storage 和本地阶段性数据源打通用户资产。
- 让投瓶、收藏、关注、申请、邀请、资料编辑等行为有可追踪结果。
- Profile 必须读取同一份用户资产，而不是只展示孤立页面数据。

阶段 2：后端闭环

- 将用户资料、用户资产和行为记录迁移到 `server/` API。
- 前端页面继续通过 `src/services` 访问数据，不直接拼后端 URL。
- `server/` 当前是 MVP API 雏形，先以内存和阶段性数据源承载。

阶段 3：AI 闭环

- 引入结构化旅行卡，而不是只返回自然语言。
- AI 卡片可以保存、投瓶、找搭子、申请行程，并沉淀到 Profile。
- 真实 AI 接入前先用阶段性 mock AI 数据源、失败态和 fallback 跑通链路。

当前未进入阶段的能力不要擅自加入：

- 完整登录 / 注册 / 实名系统。
- 数据库。
- 真实 AI 付费接口。
- 真实聊天或好友系统。
- 真实图片上传。
- 真实匹配算法或复杂推荐算法。
- 新 UI 组件库。
- 复杂 CI 或正式测试框架。

## 核心功能

### 旅行人格

旅行 MBTI 用一组轻量选择题生成用户的旅行人格，并沉淀为后续页面可复用的旅行身份。

已确认的人格包括：

- 赛博特种兵
- 精神卡皮巴拉
- 精算系旅行家
- 人文浪漫主义

### 旅行地图

地图页是目的地探索枢纽，支持目的地搜索、区域 / 点位信息、热度图层、静态地图兜底，以及跳转到同目的地的漂流瓶和搭子匹配页面。

如果本地配置高德地图 Key，地图页可以接入高德 Web JSAPI；未配置或加载失败时使用静态地图兜底，保证本地可运行。

### 旅行漂流瓶

漂流瓶页围绕当前目的地展示旅行故事、心愿、攻略和搭子相关内容。当前已经支持投瓶写入列表；下一阶段需要继续补齐点赞、收藏、关注、打招呼和 Profile 同步。

### 搭子 / 行程匹配

匹配页围绕当前目的地展示搭子和行程两类结果，支持模式切换、筛选弹层、他人身份卡和加入行程弹层。当前结果来自阶段性数据源，不代表真实匹配算法。

### 我的旅行身份

个人页展示用户的旅行身份卡、TripKin 旅行人格、匹配画像、旅行故事、行程、足迹、成就和收藏摘要。下一阶段重点是让它读取真实用户资产，而不是孤立页面数据。

## 技术栈

前端：

- React
- Vite
- TypeScript
- React Router
- Zustand
- Less
- CSS Modules
- antd-mobile
- antd-mobile-icons

后端 API 雏形：

- TypeScript
- Express

工程化：

- ESLint
- Prettier
- Husky
- lint-staged
- commitlint
- cz-git

## 本地运行

安装依赖：

```bash
npm install
```

启动前端开发服务器：

```bash
npm run dev
```

构建检查：

```bash
npm run build
```

代码检查：

```bash
npm run lint
```

格式检查：

```bash
npm run format:check
```

## API 雏形与阶段性数据源

项目在 `server/` 下提供 TypeScript Express API 雏形，用于 Match、Bottle 和后续用户资产闭环的前后端联调。

启动后端 API：

```bash
cd server
npm install
npm run dev
```

默认地址：

```txt
http://localhost:3001
```

健康检查：

```txt
http://localhost:3001/api/health
```

当前前端默认可以在本地阶段性数据源上运行。只有在 `.env.local` 中配置 `VITE_API_BASE_URL` 时，`src/services` 才会请求本地 API：

```bash
VITE_API_BASE_URL=http://localhost:3001
```

不配置时，页面继续读取前端本地阶段性数据源。

## 环境变量

如需在 `/map` 使用高德地图，在项目根目录创建 `.env.local`：

```bash
VITE_AMAP_KEY=你的高德 Web JSAPI Key
VITE_AMAP_SECURITY_CODE=你的高德安全密钥
```

不要把真实 Key 或安全密钥提交到仓库。

未配置这两个变量时，地图页会使用静态地图兜底。

## 页面路由

| 页面            | 路由           | 说明                   |
| --------------- | -------------- | ---------------------- |
| 首页            | `/`            | 产品入口与核心功能聚合 |
| 旅行 MBTI 首页  | `/mbti`        | 旅行人格测试入口       |
| 旅行 MBTI 测试  | `/mbti/test`   | 答题流程               |
| 旅行 MBTI 结果  | `/mbti/result` | 旅行身份结果页         |
| 旅行地图        | `/map`         | 目的地探索枢纽         |
| 旅行漂流瓶      | `/bottle`      | 目的地内容互动分支     |
| 搭子 / 行程匹配 | `/match`       | 搭子与行程匹配分支     |
| 我的旅行身份    | `/profile`     | 用户资产与旅行身份页   |

底部主导航固定为：

```txt
首页 / 地图 / 匹配 / 我的
```

对应路由：

```txt
/ /map /match /profile
```

`/mbti`、`/mbti/test`、`/mbti/result` 和 `/bottle` 属于流程页或内容分支，不作为底部主导航入口。

## 项目结构

```txt
src/
  pages/        路由页面
  modules/      页面内部大功能块
  components/   跨页面复用 UI
  layouts/      应用级页面外壳
  services/     请求与数据访问
  store/        跨页面 Zustand 状态
  styles/       全局样式与视觉变量
  types/        共享 TypeScript 类型
  utils/        纯工具函数
server/         MVP API 雏形
docs/           产品、协作、编码、验证和审计文档
```

当前页面开发优先放在 `src/pages/<PageName>/`。只有确认跨页面复用后，才抽到 `src/components`。

## 文档导航

产品与设计：

- [产品 PRD](docs/tripkin-product-prd.md)
- [产品闭环审计](docs/product-closure-audit.md)
- [视觉设计系统](DESIGN.md)

开发与协作：

- [代码位置与样式规范](docs/coding-guide.md)
- [协作说明](docs/collaboration-guide.md)
- [antd-mobile 使用规范](docs/antd-mobile-usage-guide.md)
- [本地页面验证说明](docs/webapp-testing-guide.md)
- [决策记录](docs/decision-notes/README.md)

AI / agent 协作：

- [AGENTS.md](AGENTS.md)

## 开发约定摘要

- 移动端 H5 优先，375px 宽度为主要设计和验收基准。
- 页面宽度保持流式，不写死 375px 固定画布。
- 页面内容优先留在对应页面目录。
- 页面私有组件不提前抽公共组件。
- 请求和数据访问统一收口到 `src/services`。
- 跨页面共享状态放入 `src/store`。
- 涉及提交、保存、收藏、申请、邀请等用户行为时，不能只 Toast 成功，必须明确写入 store/service/API；阶段未实现时要写明占位状态。
- 样式默认使用 CSS Modules。
- 标准移动端交互可以使用 antd-mobile，但页面视觉由 TripKin 自己的 CSS Modules 和设计 token 控制。
- 新增依赖、完整登录、数据库、真实 AI、新 UI 组件库、复杂 CI 或正式测试框架前必须先确认阶段计划。

## 常用命令

```bash
npm run dev          # 启动前端开发服务器
npm run build        # 构建检查
npm run lint         # 代码检查
npm run lint:fix     # 自动修复部分 lint 问题
npm run format       # 格式化项目文件
npm run format:check # 检查格式
npm run preview      # 预览构建产物
npm run commit       # 按规范生成提交信息
```

后端命令需要在 `server/` 目录下执行：

```bash
npm run dev   # 启动 API 雏形
npm run build # 构建后端 TypeScript
npm run start # 运行构建后的后端服务
```

## 提交信息

推荐使用：

```bash
npm run commit
```

提交格式：

```txt
type: subject
type(scope): subject
```

不要使用：

```txt
feat(): subject
update
改了一个东西
```

## 验证

如果改动包含源码、样式、路由、脚本、依赖、工程配置、后端代码，或会影响运行行为，完成前至少运行：

```bash
npm run lint
npm run build
```

如果只修改 Markdown 文档，且不改变代码、配置、脚本或运行行为，不强制运行上述命令。

如果文档格式需要验证，可以运行：

```bash
npm run format:check
```

## License

[MIT License](LICENSE).
