# TripKin 产品闭环审计

> 本文记录 TripKin 从页面型演示向 MVP 闭环产品演进前的技术产品审计结果。审计时间：2026-07-02。

## 1. 执行验证摘要

| 命令 / 检查                                  | 结果     | 备注                                                                                                                       |
| -------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                               | 通过     | ESLint 无报错。                                                                                                            |
| `npm run build`                              | 通过     | Vite 构建成功，主 JS gzip 后约 211 KB。                                                                                    |
| `cd server && npm run build`                 | 通过     | 后端 TypeScript 构建通过。                                                                                                 |
| `npm run dev`                                | 通过     | Vite 可启动于 `http://127.0.0.1:5173/`。                                                                                   |
| `cd server && npm run dev`                   | 通过     | 后端输出 `TripKin server listening on http://localhost:3001`。                                                             |
| 前端主要路由                                 | 通过     | `/`、`/mbti`、`/mbti/test`、`/mbti/result`、`/map`、`/bottle`、`/match`、`/profile` 均返回 SPA HTML，浏览器渲染到 `main`。 |
| `/api/health`                                | 通过     | 200 JSON。                                                                                                                 |
| `/api/matches`                               | 未通过   | 404；当前实际接口为 `/api/matches/partners` 和 `/api/matches/trips`。                                                      |
| `/api/matches/partners?destinationId=xizang` | 通过     | 200 JSON。                                                                                                                 |
| `/api/matches/trips?destinationId=xizang`    | 通过     | 200 JSON。                                                                                                                 |
| `/api/bottles`                               | 条件失败 | 缺少 `destinationId` 时返回 400 JSON。                                                                                     |
| `/api/bottles?destinationId=xizang`          | 通过     | 200 JSON。                                                                                                                 |
| `VITE_API_BASE_URL` 注入                     | 部分验证 | Vite 转译模块确认可注入；网络捕获受本地 watch/helper 生命周期影响，后续应补一条稳定 smoke 脚本。                           |
| 浏览器控制台                                 | 有风险   | 地图脚本出现 `FlyDataAuthTask error: INVALID_USER_DOMAIN`。                                                                |

## 2. P0 闭环断点

### Stage 1 前端资产持久化接入与补齐验收已完成

- 回标时间：2026-07-02。
- 已完成范围：`useUserAssetStore` 继续使用 `tripkin-user-assets-v1` 做 Stage 1 前端持久化；Bottle 收藏、点赞、关注，Match 行程申请、同行邀请，以及 Profile 故事、行程、搭子、收藏区块已读写同一前端资产源。
- 本轮补齐：Profile 已移除故事、行程、同行记录、收藏子页的隐式 mock fallback；空资产时展示“还没有沉淀行为”的空态，避免首页数字和点进列表不一致。
- 边界说明：这不是 Stage 2 完成标记；用户资产尚未迁移到 `server/` API/database，后续仍需通过 `src/services` 设计并接入后端契约。

### 用户资产没有统一模型，Profile 大部分不是行为沉淀

- 证据文件：`src/pages/Profile/index.tsx`、`src/pages/Profile/mock.ts`
- 当前行为：Profile 只读取 `useTripStore` 中的 MBTI、昵称和签名；旅行故事、行程、足迹、成就、收藏全部来自静态页面数据。
- 为什么影响闭环：Bottle 收藏、投瓶、Match 申请和邀请不会进入“我的”，用户行为没有资产沉淀。
- 建议修法：新增统一用户资产 store/service，先以前端持久化打通，再迁移到 server API。

### Bottle 点赞、收藏、关注只改页面临时 state

- 证据文件：`src/pages/Bottle/index.tsx` 的 `bottlePatches`、`handleToggleLike`、`handleToggleCollect`、`handleToggleFollow`
- 当前行为：交互只存在当前页面 state，刷新后丢失，也不会同步 Profile。
- 为什么影响闭环：用户看到“已收藏/已关注”，但收藏资产和关注关系不可追踪。
- 建议修法：写入 `savedBottleIds`、`likedBottleIds`、`followedAuthorIds`，由 Profile 读取同一资产源。

### Match 申请加入行程是假提交

- 证据文件：`src/pages/Match/components/JoinTripSheet/index.tsx`
- 当前行为：点击提交只 Toast “申请已提交，状态：待处理”，然后关闭弹层。
- 为什么影响闭环：Profile 的“我的行程/申请记录”没有来源。
- 建议修法：提交 `TripApplication`，记录 `tripId`、说明、状态和时间。

### Match 发起同行邀请是假提交

- 证据文件：`src/pages/Match/components/ProfileSheet/index.tsx`
- 当前行为：点击“发起同行邀请”只 Toast 成功。
- 为什么影响闭环：搭子关系、邀请记录和后续状态都不可追踪。
- 建议修法：写入 `CompanionInvitation`，Profile 搭子资产读取该记录。

### Profile 首屏编辑昵称/签名没有回写全局状态

- 证据文件：`src/pages/Profile/components/TravelIdentityCard/index.tsx`、`src/pages/Profile/index.tsx`
- 当前行为：身份卡编辑只改组件内 state；设置中心账号页才回写 `useTripStore`。
- 为什么影响闭环：同一资料编辑有两个结果，刷新后首屏编辑丢失。
- 建议修法：身份卡编辑和账号设置统一调用 Profile 层保存函数。

### 前后端阶段性数据源分裂

- 证据文件：`src/services/bottleService.ts`、`src/pages/Bottle/data/bottleMockData.ts`、`server/src/data/bottles.ts`、`src/pages/Match/matchMock.ts`、`server/src/data/matches.ts`
- 当前行为：前端本地数据和 server 数据各一套，依赖 service 适配。
- 为什么影响闭环：配置 API 后可能展示另一套数据，字段语义和行为回写容易不一致。
- 建议修法：先统一共享类型和资产写入契约，再逐步收敛数据源。

## 3. P1 产品补全项

- 首页搜索/推荐只跳路由，不写目的地上下文。证据：`src/pages/Home/index.tsx` 的 `mockSearchItems`、`recommendCards`、`quickActions`。
- Map 选择目的地能写 `useTripStore.destination` 并跳 Bottle/Match，但收藏目的地、浏览足迹、最近目的地没有沉淀。证据：`src/pages/Map/index.tsx`、`BottomSpotCard.tsx`、`BottomRegionCard.tsx`。
- Bottle 投瓶可新增到列表，但本地模式只存在模块内存 `localCreatedBottlesByDest`，刷新丢失。证据：`src/services/bottleService.ts`。
- Bottle “打招呼”“更换地点”“筛选”“图片上传”仍是占位反馈。证据：`src/pages/Bottle/index.tsx`。
- Match 筛选是假应用，不影响列表。证据：`src/pages/Match/components/FilterSheet/index.tsx`。
- 隐私/通知设置只在弹层内存。证据：`PrivacySettingsPage`、`NotificationSettingsPage`。
- 后端 CORS 只允许 `GET,POST,OPTIONS`，后续 `PATCH/DELETE` 接口需要同步扩展。证据：`server/src/app.ts`。

## 4. P2 上线前增强项

- 数据持久化：阶段 1 可先用 Zustand persist，阶段 2 再迁移 server API。
- 匿名身份：MVP 至少需要匿名 `userId` 或设备级身份，否则资产无法归属。
- 用户隐私：足迹、主页可见性、推荐可见性需要真实保存。
- 内容安全：漂流瓶、同行申请、AI 内容都需要举报、屏蔽和审核策略。
- AI 成本：真实 AI 前需要 mock AI、限流、超时、重试和降级。
- 地图服务：当前有 AMap 域名错误风险，需要 key/domain 配置检查和 fallback。
- 错误处理：Profile 和设置页缺加载、失败和保存失败状态。
- 前后端契约：Match/Bottle 已有双通道，但资产、申请、邀请、AI 卡片未形成契约。
- 移动端适配：仍需持续守住 375px 无横向溢出。
- 可观测性：缺少搜索、投瓶、收藏、申请、邀请、保存 AI 卡片等行为埋点。
- 测试缺口：当前无正式测试框架，MVP 阶段至少需要稳定 smoke 验证清单。

## 5. 推荐的最小修复路径

### 阶段 1：前端闭环

- 新增统一 `UserAsset` store，使用 Zustand persist。
- Bottle 收藏、投瓶、关注，Match 申请、邀请，Profile 收藏、行程、搭子全部读写同一资产源。
- 修正 Profile 身份卡编辑入口，统一回写 `useTripStore`。
- 保留本地阶段性数据源，先保证刷新后关键状态仍在。

### 阶段 2：后端闭环

- 将用户资料、用户资产、保存、申请、邀请迁移到 `server/` API。
- 前端继续通过 `src/services` 访问，不在页面里直接拼后端 URL。
- 收敛 Bottle/Match 前后端字段，减少适配层漂移。

### 阶段 3：AI 闭环

- 以 Home 搜索/推荐或 Map 目的地卡作为 AI 主入口。
- AI 输出结构化 `TravelFeedCard`，而不是只返回自然语言。
- 卡片支持保存、投瓶、找搭子、加入行程，并在 Profile 展示生成/保存历史。
- 真实 AI 接入前先用 mock AI 数据源、失败态和 fallback 跑通链路。

## 6. 建议的数据模型草案

```ts
interface UserProfile {
  userId: string
  nickname: string
  tagline: string
  personaId: PersonaId | null
  classicMbti: string | null
  currentDestinationId: string | null
}

interface UserAsset {
  profile: UserProfile
  savedFeedCards: SavedFeedCard[]
  bottles: BottleRecord[]
  savedBottleIds: string[]
  savedDestinationIds: string[]
  savedCompanionIds: string[]
  tripApplications: TripApplication[]
  companionInvitations: CompanionInvitation[]
  footprints: string[]
  achievements: string[]
}

interface TravelFeedCard {
  id: string
  destinationId: string
  title: string
  summary: string
  tags: string[]
  suggestedActions: Array<
    'save' | 'throw_bottle' | 'find_companion' | 'join_trip'
  >
  source: 'mock-ai' | 'ai'
}

interface SavedFeedCard extends TravelFeedCard {
  savedAt: string
}

interface BottleRecord {
  id: string
  destinationId: string
  content: string
  type: BottleType
  createdAt: string
  visibility: BottleVisibilityType
}

interface TripApplication {
  id: string
  tripId: string
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

interface CompanionInvitation {
  id: string
  companionId: string
  message?: string
  status: 'sent' | 'accepted' | 'declined'
  createdAt: string
}
```

## 7. 建议接口草案

| Method   | Endpoint                      | 优先级 | 用途                              |
| -------- | ----------------------------- | ------ | --------------------------------- |
| `GET`    | `/api/profile`                | P1     | 读取用户资料与 MBTI。             |
| `PATCH`  | `/api/profile`                | P1     | 保存昵称、签名、当前目的地。      |
| `GET`    | `/api/user-assets`            | P0     | Profile 聚合资产。                |
| `POST`   | `/api/saves`                  | P0     | 保存瓶子、目的地、搭子、AI 卡片。 |
| `DELETE` | `/api/saves/:id`              | P1     | 取消保存。                        |
| `POST`   | `/api/trips/applications`     | P0     | 申请加入行程。                    |
| `GET`    | `/api/trips/applications`     | P0     | 我的申请记录。                    |
| `POST`   | `/api/companions/invitations` | P0     | 发起同行邀请。                    |
| `GET`    | `/api/companions/invitations` | P1     | 我的邀请记录。                    |
| `GET`    | `/api/feed/cards`             | P1     | 获取阶段性或 AI 旅行卡流。        |
| `POST`   | `/api/feed/cards/generate`    | P1     | 按目的地/人格生成结构化旅行卡。   |
| `POST`   | `/api/feed/cards/:id/save`    | P1     | 保存 AI 卡片。                    |
| `GET`    | `/api/feed/history`           | P2     | 最近生成历史。                    |

## 8. 不建议现在做的事

- 完整登录、注册、实名系统。
- 复杂数据库和后台管理系统。
- 真实社交聊天、好友关系、消息中心。
- 真实 AI 付费接入和复杂推荐算法。
- 新 UI 组件库或大规模视觉重构。
- 正式 CI/E2E 测试框架。
- 一次性重写所有页面数据结构。
- 在页面里绕过 `src/services` 直接请求后端。
