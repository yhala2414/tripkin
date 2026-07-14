# TripKin 产品闭环审计

> 本文记录 TripKin 从页面型演示向 MVP 闭环产品演进前的技术产品审计结果。审计时间：2026-07-02。
>
> 最近回标：2026-07-14。Stage 1 核心用户资产闭环已完成，当前默认焦点为 Stage 2 API 契约准备。

## 0. 阅读状态说明

本文是阶段审计记录，不是永远实时的当前任务清单。阅读时需要区分：

- `已完成`：该项已通过后续实现或验收关闭，但边界说明仍然有效。
- `未关闭`：该项仍可作为当前修复线索，需要结合代码现状复核。
- `历史断点`：该项保留为复盘证据，不能直接当作当前事实继续传播。

如果本文与 `docs/decision-notes/README.md`、`docs/tripkin-product-prd.md` 或当前代码实现冲突，先做 Failure Review：判断是审计记录过期、正式规则漂移、代码实现变化，还是协作者误读，然后再决定更新审计、同步正式文档或只修正本轮行动。

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

## 2. 当前阶段结论

### Stage 1 核心用户资产闭环已完成

- 回标时间：2026-07-14。
- `useUserAssetStore` 使用 `tripkin-user-assets-v1` 持久化 Stage 1 用户资产。
- Bottle 创建、收藏、点赞和关注通过 `src/services/userAssetService.ts` 写入共享资产。
- Match 行程申请和同行邀请通过同一 service 写入，Profile 从同一 store 读取故事、行程、搭子和收藏资产。
- Profile 身份卡和账号设置共同调用 Profile 层保存函数，昵称和签名写入持久化的 `useTripStore`。
- Profile 已移除故事、行程、同行记录和收藏子页的隐式 mock fallback；空资产展示明确空态。
- 边界：这只关闭 Stage 1 核心资产断点，不表示所有前端占位行为已经完成，也不是 Stage 2 实现完成标记。

### 当前默认焦点：Stage 2 API 契约准备

- 状态：未关闭，属于 Stage 2 契约风险。
- 证据：前端本地数据与 `server/` 数据仍分别维护，依赖 `src/services` 适配；用户资料和用户资产尚未形成后端契约。
- 下一步：单独规划用户资料、用户资产、行程申请和同行邀请的 API 边界，再决定迁移顺序和实现。
- 限制：契约准备不开放数据库、完整登录、正式后端持久化、真实 AI 或页面直连后端 URL。

### Stage 1 历史断点摘要

- 统一用户资产模型、Bottle 持久化互动、Match 申请/邀请写入和 Profile 双入口资料保存均已关闭。
- 这些历史断点只用于解释行为成功必须对应 store/service/API 写入路径，不再作为当前任务或推荐修法。
- 详细实现和决策依据见 `docs/decision-notes/README.md` 的 2026-07-02 用户资产决策及当前代码。

## 3. P1 产品补全项

状态：未关闭清单。以下条目是后续产品补齐线索，实施前需要结合当前代码和阶段目标复核，不应被当作已确认的本轮范围。

- 首页搜索/推荐只跳路由，不写目的地上下文。证据：`src/pages/Home/index.tsx` 的 `mockSearchItems`、`recommendCards`、`quickActions`。
- Map 选择目的地能写 `useTripStore.destination` 并跳 Bottle/Match，但收藏目的地、浏览足迹、最近目的地没有沉淀。证据：`src/pages/Map/index.tsx`、`BottomSpotCard.tsx`、`BottomRegionCard.tsx`。
- Bottle “打招呼”“更换地点”“筛选”“图片上传”仍是占位反馈。证据：`src/pages/Bottle/index.tsx`。
- Match 筛选是假应用，不影响列表。证据：`src/pages/Match/components/FilterSheet/index.tsx`。
- 隐私/通知设置只在弹层内存。证据：`PrivacySettingsPage`、`NotificationSettingsPage`。
- 后端 CORS 只允许 `GET,POST,OPTIONS`，后续 `PATCH/DELETE` 接口需要同步扩展。证据：`server/src/app.ts`。

## 4. P2 上线前增强项

状态：未关闭增强项。以下内容只说明上线前风险方向，不代表当前阶段可以直接打开对应能力。

- 数据持久化：Stage 1 已使用 Zustand persist；Stage 2 先定义 API 契约，再规划迁移，当前不引入数据库。
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

### Stage 1 收尾：逐项判断剩余占位行为

- 对首页目的地上下文、Map 资产沉淀、Bottle 占位操作、Match 筛选和隐私/通知设置逐项确认产品意图。
- 只有被当前任务明确打开的行为才实现写入；其余继续使用明确的阶段性占位文案，不显示假成功。
- 不再重复新增用户资产 store，也不重做已经关闭的 Bottle、Match、Profile 核心链路。

### 当前焦点：Stage 2 API 契约准备

- 先定义用户资料、用户资产、保存、申请和邀请的服务/API 边界，形成独立实施计划。
- 前端继续通过 `src/services` 访问，不在页面里直接拼后端 URL。
- 复核 Bottle/Match 的前后端字段和阶段性数据源差异，明确迁移兼容要求。
- 本轮只准备契约，不实现数据库、完整登录、正式后端持久化或真实 AI。

### 阶段 3：AI 闭环

- 以 Home 搜索/推荐或 Map 目的地卡作为 AI 主入口。
- AI 输出结构化 `TravelFeedCard`，而不是只返回自然语言。
- 卡片支持保存、投瓶、找搭子、加入行程，并在 Profile 展示生成/保存历史。
- 真实 AI 接入前先用 mock AI 数据源、失败态和 fallback 跑通链路。

## 6. 历史数据模型草案

> 状态：2026-07-02 审计草案，仅作为 Stage 2 契约讨论输入，不是当前已确认接口或类型。正式字段必须在单独的 API 契约计划中确定。

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

## 7. 历史接口草案

> 状态：2026-07-02 审计草案，不代表接口已经获准或实现。Stage 2 开发前必须重新核对当前 service、server 路由和迁移边界。

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
