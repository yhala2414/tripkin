# 协作说明

本文档说明 TripKin **MVP 闭环奠基期** 的团队协作方式。目标是让每个人和 AI 都能按阶段推进产品闭环，减少互相覆盖、假提交和一次性过度开发。

## 当前协作方式

当前不再只按单页视觉推进，而是按“一个可验证闭环”拆任务。

推荐顺序：

1. 前端闭环：先让用户行为写入 Zustand/local storage 或本地阶段性数据源。
2. 后端闭环：再把已验证的资产和行为迁移到 `server/` API。
3. AI 闭环：最后引入结构化 AI 旅行卡，并进入保存、投瓶、找搭子和 Profile 沉淀。

每次任务只打开一个闭环能力。不要在同一轮里同时做登录、数据库、AI、推荐、后台、复杂测试框架和大规模视觉重构。

## 开发前

新拉代码后，先安装依赖：

```bash
npm install
```

每次开始开发前：

1. 先确认本次任务属于哪个阶段。
2. 阅读 `README.md`、`AGENTS.md`、`docs/coding-guide.md` 和本文件。
3. 如果涉及产品范围，阅读 `docs/tripkin-product-prd.md`。
4. 如果涉及已知断点，阅读 `docs/product-closure-audit.md`。
5. 如果任务明确要求自动化验证、Playwright、截图验证或 webapp-testing，阅读 `docs/webapp-testing-guide.md`。

## 文档权威来源

当同一规则出现在多个地方时，先确认 source of truth，再同步或删减旧副本。

| 文档                            | 主要职责                                                                  |
| ------------------------------- | ------------------------------------------------------------------------- |
| `AGENTS.md`                     | AI 必读入口、执行边界、验证要求和 Failure Review 触发规则。               |
| `docs/collaboration-guide.md`   | 团队协作流程、Failure Review、`.local-docs/` 使用边界和决策记录触发条件。 |
| `docs/coding-guide.md`          | 代码位置、样式、目录职责、行为闭环实现规则。                              |
| `docs/decision-notes/README.md` | 长期有效决策摘要和会影响多人协作的历史决策。                              |
| `docs/product-closure-audit.md` | 阶段审计证据和闭环断点记录，不是实时任务清单。                            |
| `DESIGN.md`                     | 已确认的视觉规则和受保护视觉基准，是视觉工作的 source of truth。          |
| `audit.md`                      | 当前视觉差距、验证证据和下一批候选项，不是设计规范或功能闭环清单。        |
| `.local-docs/`                  | ignored 本地草稿和线索，不能作为正式需求、规范或决策依据。                |

## 开发中

必须：

- 尽量只改本次闭环相关页面、store、service 或 API。
- 不随便改别人页面的主结构。
- 不确定需求先写到计划或讨论，不直接写进仓库代码。
- 新增依赖、数据库、完整登录、真实 AI、新 UI 组件库、复杂 CI 或正式测试框架前必须先确认。
- 用户行为成功反馈前必须有写入路径，或明确标注为阶段性占位。

推荐：

- 页面内部内容先就近写。
- 重复 UI 出现后，再考虑抽到 `src/components`。
- 页面内部大功能块可以抽到 `src/modules`。
- 普通页面内部变更不需要写决策记录。

## 偏航复盘与纠偏

当人或 AI 发现协作偏离了项目规则，不能直接把错误包装成下一次行动继续推进。先做一次轻量 Failure Review，判断错误来自执行、上下文发现、文档歧义、文档漂移、文档缺口还是流程缺口，再决定是否修改正式文档。

需要触发 Failure Review 的情况包括：

- AI 忽略了已存在的正式规则。
- AI 只读 README 就开始改动，漏读了本次任务需要的上下文。
- `.local-docs/` 草稿、旧审计、截图或临时计划被当成正式规则。
- 同一条规则在多个文档里出现不同版本。
- 用户指出 AI 跳过验证、扩大范围、假装完成或重复同类错误。
- 文档本身让两个协作者产生了合理但不同的理解。

Failure Review 使用这个格式：

```txt
Miss:
Expected rule:
Failure type: agent execution / context discovery / documentation ambiguity / documentation drift / documentation gap / process failure
Immediate correction:
System change: none / context map / doc clarification / decision note / local draft cleanup / workflow
Prevention:
```

判断规则：

- 如果正式规则已经清楚，只是 AI 或人没有执行，先修正行为，不改团队文档。
- 如果信息存在但不容易被找到，改阅读入口、上下文地图或协作说明。
- 如果文档允许多种合理解释，澄清正式文档或补充反例。
- 如果多个正式文档之间发生漂移，确定 source of truth，同步或删减旧副本。
- 如果项目没有覆盖这个高频情况，补充正式规则或决策记录。
- 如果缺少验证、反馈或交接流程，改工作流，而不是只写“下次注意”。

复盘必须改变下一次行动。可以选择“不改文档”，但需要说明本轮如何修正，以及下一次如何避免同类偏航。

## 用户行为闭环协作

如果按钮、表单或弹层会让用户以为操作成功，例如：

- 投瓶。
- 点赞、收藏、关注。
- 申请加入行程。
- 发起同行邀请。
- 保存 AI 卡片。
- 编辑昵称、签名、隐私或通知设置。

实现时必须回答：

- 写入哪个 store？
- 是否通过哪个 service？
- 后续是否迁移到哪个 API？
- Profile 或其他页面从哪里读取？

如果当前阶段不实现写入，不要写“已成功”。使用“暂未接入”“阶段性占位”或同等明确文案。

## 公共骨架协作

当前公共骨架包括：

- 首页路由 `/`。
- `/mbti`、`/mbti/test`、`/mbti/result`。
- 四栏 `BottomNav`：首页 / 地图 / 匹配 / 我的。
- `MbtiEntryModal`。
- `src/layouts/AppLayout/` 控制底部导航显示。

底部主 Tab 白名单为：

```txt
/ /map /match /profile
```

`/mbti`、`/mbti/test`、`/mbti/result` 和 `/bottle` 不显示底部导航。

如果确实需要修改路由、`AppLayout`、底部导航、全局样式、共享 store 或共享组件，先说明影响范围；影响多人协作的，记录到 `docs/decision-notes/README.md`。

## 后端协作原则

`server/` 是 MVP API 雏形，当前以内存和阶段性数据源承载。

规则：

- 后端接口可以逐步扩展，但必须先有前端闭环需求和接口草案。
- 前端页面不要直接请求后端 URL，应通过 `src/services` 统一访问。
- 接口字段变化时，说明影响哪些 service 和页面。
- 修改后端 API 后，优先确认后端能启动、目标接口能返回 JSON；必要时运行 `server/` 下的 `npm run build`。
- 当前不要擅自加入数据库、完整登录、真实 AI、真实匹配算法、复杂 CI 或正式测试框架。

## 本地开发资料与草稿区

团队成员可以使用 `.local-docs/` 保存个人草稿、AI 对话总结、截图参考、分步计划和未确认需求。

`.local-docs/` 不进入 Git 提交，不作为正式需求、规范或决策依据。

`.local-docs/` 中的文件默认可能过期。除非用户明确点名，否则它们只能作为线索使用；如果它们与 `AGENTS.md`、`README.md` 或 `docs/` 下的正式文档冲突，以正式文档为准，并按 Failure Review 判断是否需要清理本地草稿或更新正式说明。

如果 `.local-docs/` 中有参考图，AI 或协作者不能直接猜测使用方式，必须先确认：

- 严格还原。
- 风格参考。
- 指定部分参考。

## 什么时候写决策记录

如果一个改动会影响多人协作或后续开发理解，需要记录到 `docs/decision-notes/README.md`。

需要记录：

- 修改当前产品阶段或协作口径。
- 新增或修改全局样式变量。
- 新增依赖。
- 引入组件库。
- 修改路由结构。
- 修改目录结构。
- 修改工程化配置。
- 抽跨页面公共组件。
- 新增跨页面 store 或后端 API 契约。

不需要记录：

- 页面内部样式。
- 页面内部阶段性数据。
- 页面内部小组件。
- 文案调整。
- 修自己页面里的 bug。

## 提交前

如果本次改动包含源码、样式、路由、脚本、依赖、工程配置、后端代码，或会影响页面运行行为，提交前运行：

```bash
npm run format:check
npm run lint
npm run build
npm --prefix server run build
```

如果只修改 Markdown 文档，且不改变代码、配置、脚本或运行行为，不强制运行上述命令。

如果修改了 Markdown 或格式相关内容，可以按需运行：

```bash
npm run format:check
```

## GitHub CI

Pull Request 和推送到 `main` 会触发 `.github/workflows/ci.yml`：

- 前端使用锁文件重新安装依赖，并依次执行格式检查、代码检查和构建。
- 服务端使用 `server/package-lock.json` 独立安装依赖并构建 TypeScript。
- 两个检查使用 Node.js `20.19.0` 和 npm `10.8.2`，任一失败都会使 CI 失败。
- 同一分支推送新提交时，旧的未完成运行会被取消。

CI 是本地验证契约的远端重复，不替代开发者在提交前运行相关命令。当前 CI 不包含部署、Docker、E2E、Playwright、正式测试框架、发布产物或远端提交信息检查。

## 本地页面验证

`webapp-testing` 不是默认开发流程。

只有当用户或任务明确提到测试、自动化验证、截图验证、Playwright、`webapp-testing` 或需要可重复验证时，AI 或协作者才使用它。

使用时遵守 `docs/webapp-testing-guide.md`，所有临时脚本、截图、trace、日志和浏览器产物都放在 `.venv/` 下。

## 提交信息

推荐使用：

```bash
npm run commit
```

提交格式只使用：

```txt
type: subject
type(scope): subject
```

不要使用：

```txt
feat(): subject
update
改了一个
```
