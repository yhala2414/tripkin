# 决策记录

本文档记录会影响多人协作、目录结构、阶段口径、公共组件、全局样式、数据访问或验证流程的长期决策。

普通页面内部样式、文案、页面私有数据和局部 bug 修复不需要写入这里。

## 当前有效决策摘要

- 产品阶段：TripKin 当前处于 **MVP 闭环奠基期**；Stage 1 核心用户资产闭环已完成，当前默认焦点是 Stage 2 API 契约准备。先定义用户资料、用户资产、行程申请和同行邀请的 API 边界，不因此开放数据库、完整登录、正式后端持久化或真实 AI。
- 文档入口：日常开发优先阅读 `README.md`、`AGENTS.md`、`docs/coding-guide.md` 和 `docs/collaboration-guide.md`；产品范围看 `docs/tripkin-product-prd.md`；已知闭环断点看 `docs/product-closure-audit.md`。
- 数据访问：页面通过 `src/services` 和 `src/store` 访问数据，不直接拼后端 URL。
- 行为闭环：提交、保存、收藏、点赞、关注、申请、邀请、编辑资料等行为不能只 Toast 成功，必须写入 store/service/API，或明确标注为阶段性占位。
- 底部导航：只有 `/`、`/map`、`/match`、`/profile` 显示主底栏；`/mbti`、`/mbti/test`、`/mbti/result`、`/bottle` 是流程页或分支页。
- 组件库：标准移动端交互可使用 `antd-mobile`，视觉仍由 TripKin CSS Modules 和设计 token 控制。
- 验证边界：源码或运行行为变更运行 `npm run lint` 和 `npm run build`；纯文档变更可按需运行 `npm run format:check`。
- 偏航复盘：当人或 AI 误读上下文、跳过规则、扩大范围、把本地草稿当正式规则、或重复同类错误时，先做 Failure Review，分类失败来源，再决定修正行动、正式文档、决策记录或本地草稿。

## 记录模板

```md
### YYYY-MM-DD Decision title

- Type:
- Background:
- Decision:
- Impact:
- Follow-up:
```

## 历史决策

### 2026-07-14 Move the default focus to Stage 2 API contract preparation

- Type: product scope / collaboration rule
- Background: Stage 1 now persists created bottles, saves, likes, follows, trip applications and companion invitations through the shared user asset service/store, and Profile reads the same asset source. The previous stage description did not identify the next default execution focus.
- Decision: Mark the Stage 1 core user asset loop as complete and make Stage 2 API contract preparation the default focus. Contract preparation covers user profile, user assets, trip applications and companion invitations; it does not authorize database adoption, full login, production backend persistence or real AI.
- Impact: `README.md`, this decision summary and `docs/product-closure-audit.md` use the same current-stage wording. Remaining Stage 1 placeholder behaviors still require task-level review.
- Follow-up: Create a separate implementation plan before adding or changing server endpoints, request fields or migration behavior.

### 2026-07-09 Add Failure Review loop for AI collaboration drift

- Type: collaboration workflow / correction loop
- Background: AI and humans can both propagate mistakes when an execution miss, stale draft, ambiguous rule, or documentation drift is treated as the next valid starting point.
- Decision: Add a lightweight Failure Review protocol to `docs/collaboration-guide.md`. When collaboration drifts, classify the failure before changing formal docs or continuing implementation.
- Impact: Agents and collaborators must distinguish agent execution failures from context discovery, documentation ambiguity, documentation drift, documentation gaps, and process failures.
- Follow-up: Keep local drafts clearly subordinate to formal docs, and add status markers to historical audit records when closed findings are kept for context.

### 2026-07-02 Add persisted user asset store for frontend closure

- Type: shared state / data access
- Background: Product closure audit identified that Bottle and Match actions did
  not accumulate in Profile, leaving user behavior without asset continuity.
- Decision: Add `src/store/useUserAssetStore.ts` persisted under
  `tripkin-user-assets-v1`, with `src/services/userAssetService.ts` as the
  page-facing write boundary for created bottles, saves, likes, follows, trip
  applications, companion invitations, and saved assets.
- Impact: Bottle, Match, and Profile read/write the same Stage 1 frontend asset
  source before Stage 2 server API migration.
- Follow-up: Keep future user-asset writes behind `src/services`; migrate this
  contract to `server/` API before adding database-backed persistence.

### 2026-07-02 Adopt staged MVP closure phase

- Type: product scope / collaboration rule
- Background: Product audit found the main risk is not page rendering, but missing data and user-behavior closure.
- Decision: TripKin enters MVP closure foundation phase. Work proceeds in stages: frontend user-asset closure, server API closure, then structured AI card closure.
- Impact: `AGENTS.md`, `README.md`, PRD, coding guide, collaboration guide, testing guide, antd-mobile guide, and product closure audit.
- Follow-up: Do not open database, full login, real AI, complex recommendation, or formal CI/test framework until the relevant phase is explicitly planned.

### 2026-06-21 Add shared base UI shells through Bottle pilot

- Type: shared components
- Background: Bottle had repeated page-shell patterns likely to recur across pages.
- Decision: Add `src/components/PageTopBar`, `src/components/BaseBottomSheet`, and `src/components/EmptyState` as small shared UI shells. Bottle is the first adopter.
- Impact: `src/components`, Bottle page shell code, and future pages that need the same shell behavior.
- Follow-up: Do not migrate every page mechanically. Reuse only when the same shell behavior is needed.

### 2026-06-21 Prefer antd-mobile-backed base interactions

- Type: component library / collaboration rule
- Background: The project already uses `antd-mobile` for mobile interaction primitives.
- Decision: Standard mobile interactions should prefer antd-mobile-backed behavior while TripKin CSS Modules keep page-level visual control.
- Impact: Future work on overlays, forms, tabs, toasts, Map controls, Match/Profile sheets, and icon cleanup.
- Follow-up: Do not turn pages into generic component demos; adjust CSS before expanding a pattern.

### 2026-06-21 Configure antd-mobile React 19 dynamic rendering

- Type: runtime compatibility
- Background: antd-mobile dynamic containers require React 19-compatible mounting and unmounting.
- Decision: Configure `unstableSetRender` once in `src/main.tsx` so dynamic containers use `createRoot` and `root.unmount()`.
- Impact: antd-mobile `Popup`, `Toast`, `Dialog`, and future overlay-style components.
- Follow-up: Do not duplicate this adapter in pages or shared UI shells.

### 2026-06-21 Converge TripKin design tokens to DESIGN.md

- Type: global style
- Background: The visual baseline was consolidated around Map / Match / Bottle.
- Decision: Keep approved typography, spacing, radius, semantic color, shadow, gradient, Map rendering, and antd-mobile adapter variables in `src/styles/variables.less`.
- Impact: Global styles, Profile, Home, MBTI, Bottle, Map, Match, BottomNav, and MBTI entry modal styles.
- Follow-up: Do not add page-specific token systems such as `--lv-*`.

### 2026-06-20 Introduce server API prototype

- Type: backend structure / data access
- Background: Match and Bottle needed a backend handoff path without opening database, login, real AI, or real matching algorithm work.
- Decision: Add `server/` as an independent TypeScript Express API prototype with `/api/health`, Bottle routes, and Match routes. Frontend pages access it through `src/services` when `VITE_API_BASE_URL` is configured.
- Impact: `server/src`, `src/services/matchService.ts`, `src/services/bottleService.ts`, README environment variable docs, and backend verification commands.
- Follow-up: Future API expansion must be tied to a specific product closure need and interface draft.

### 2026-06-19 Add shared Trip session store

- Type: shared state
- Background: MBTI results and destination context needed to persist across pages.
- Decision: Add `src/store/useTripStore.ts` as a Zustand store for TripKin session data, persisted under `tripkin-trip-session-v1`.
- Impact: MBTI writes persona/session data; Map, Bottle, Match, and Profile can read the shared destination and identity context.
- Follow-up: Do not treat `mbtiTypeEn` as the 16-type MBTI code. Use `personaId` for TripKin persona matching.

### 2026-06-19 Allow optional webapp-testing workflow

- Type: verification workflow
- Background: Some tasks need repeatable browser checks, screenshots, or console inspection, but the project should not adopt a formal E2E framework yet.
- Decision: Allow `webapp-testing` only when a task explicitly asks for testing, Playwright, screenshots, automated verification, or repeatable browser checks. Temporary scripts and artifacts must stay under ignored `.venv/` paths.
- Impact: `docs/webapp-testing-guide.md`, `.venv/` workflow, and local verification habits.
- Follow-up: Long-term reusable tests require a separate decision about test directory, dependencies, and CI.

### 2026-06-18 Use AMap with static map fallback

- Type: map integration
- Background: `/map` needs a real map option while keeping local development runnable.
- Decision: Use AMap Web JSAPI when `VITE_AMAP_KEY` and `VITE_AMAP_SECURITY_CODE` are configured; otherwise use the static map fallback.
- Impact: `/map`, local environment variables, and README setup docs.
- Follow-up: Never commit real keys or security codes.
