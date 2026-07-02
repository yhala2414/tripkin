# antd-mobile 使用规范

本规范用于 TripKin **MVP 闭环奠基期**。目标是允许团队用 antd-mobile 快速完成移动端基础交互，同时避免页面被组件库默认视觉带跑，也避免用 Toast 伪装业务闭环。

## 当前结论

已确认：当前阶段可以在需要时使用 `antd-mobile`。

使用原则是：**用它提速交互，不让它决定风格，不让 Toast 替代数据写入。**

适合交给 antd-mobile 的部分：

- `Popup`、`Toast`、`Dialog` 等基础交互。
- `Tabs`、`Segmented`、`Picker`、`Selector` 等移动端常见控件。
- `Input`、`TextArea`、开关、单选、多选等标准表单行为。
- 加载、空状态、提示、轻确认等低风险反馈。

需要谨慎使用或优先自定义的部分：

- 大面积 `List`。
- 默认 `Card`。
- 默认 `NavBar`。
- 决定页面第一视觉的按钮、卡片、标签和头图区。

如果默认组件一眼看起来组件库味太重，可以只使用它的交互能力，外观通过页面 CSS Modules 自定义。

## Toast 使用规则

Toast 只能作为反馈，不能作为业务结果本身。

显示成功 Toast 前，必须满足以下之一：

- 已写入 `src/store`。
- 已通过 `src/services` 写入本地阶段性数据源。
- 已通过 `src/services` 写入 `server/` API。
- 当前阶段未实现写入，但 Toast 文案明确说明是占位或暂未接入。

不推荐：

```txt
已提交
已收藏
已发起邀请
```

除非已经有对应写入路径。

推荐：

```txt
已保存到我的收藏
申请已提交，已加入我的申请记录
该能力暂未接入，本阶段仅展示入口
```

## 使用边界

必须：

- 页面仍按 `375px` 移动端基准开发。
- 页面样式优先使用 `*.module.less`。
- 页面级视觉主题、间距、圆角、标签、卡片层级由当前页面样式控制。
- 标准移动端交互优先使用 antd-mobile，页面视觉再通过 CSS Modules 调整成 TripKin 风格。
- 引入新组件前确认它不会明显破坏当前页面视觉风格。

不要：

- 为了使用组件库而重写稳定页面结构。
- 直接堆默认 antd-mobile 组件当最终视觉。
- 为单个页面的小交互提前抽跨页面公共组件。
- 在没有必要时引入 antd-mobile 的全局样式改造方案。
- 暗示项目已经有真实登录、后端、聊天、AI 或复杂业务能力。

## 推荐用法

优先使用：

- `Popup`：底部弹层、筛选弹层、详情弹层。
- `Toast`：有写入结果后的轻反馈，或明确占位提示。
- `Dialog`：确认类操作。
- `Tabs` / `Segmented`：页面内部模式切换。
- `Selector` / `Picker`：移动端筛选控件。
- `Input` / `TextArea`：表单输入。

谨慎使用：

- `List`：容易形成标准设置页质感，除非信息结构非常适合。
- `Card`：容易压掉项目自己的卡片视觉，核心卡片优先自定义。
- `NavBar`：如果页面顶部需要强旅行产品氛围，优先自定义。
- `Button`：可以用，但主按钮样式应覆盖成项目视觉。

## 图标策略

通用 UI 图标优先复用 `antd-mobile-icons`，不要在每个页面继续手写重复 SVG。

适合统一图标来源：

- 返回、关闭、筛选、搜索、定位、日历。
- 消息、点赞、收藏、关注、编辑、相机、加号。

可以继续自定义：

- BottleGlyph。
- 地图图层、热力、点位等业务渲染。
- MBTI / TripKin 旅行人格头像。
- 页面插画、品牌符号和装饰性场景。

新增或替换图标时，不要为了图标统一改动业务逻辑、路由、阶段性数据源或页面信息结构。

## 样式约束

项目已经在 `src/styles/variables.less` 中覆盖 antd-mobile 的基础 CSS 变量，让组件主色、文字色、成功色和基础圆角接近 TripKin 视觉底座。

页面内覆盖 antd-mobile 样式时，优先把范围限制在当前页面容器内：

```tsx
<main className={styles.page}>...</main>
```

对应样式只写在当前页面 CSS Module 内，避免全局污染。

如果确实需要继续修改 antd-mobile 全局主题变量，必须先说明影响范围，并同步记录到 `docs/decision-notes/README.md`。

## React 19 兼容

当前项目使用 React 19。

项目已在 `src/main.tsx` 配置 `unstableSetRender`，让 antd-mobile 临时容器使用 `createRoot` 和 `root.unmount()`。页面和共享组件不要重复配置这段兼容逻辑。

## 新增依赖注意

如果当前分支首次安装或升级 `antd-mobile`，需要：

1. 在同一次变更中更新 `package.json` 和 lockfile。
2. 运行 `npm install`。
3. 运行 `npm run lint` 和 `npm run build`。
4. 在提交说明里写清楚它服务的页面或交互。

本规范只确认 antd-mobile 在当前阶段可用，不代表所有页面都必须使用它。
