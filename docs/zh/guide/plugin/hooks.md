---
sidebarDepth: 3
---

# 事件汇总

为了更好的编写插件，在此汇总所有内置插件的事件。

|  事件         |     触发插件        | 说明 |
| ------------ | ----------------------- | ----- |
| onStart | 所有插件 | 插件开始执行 |
| onSelfStart | 所有插件 | 当前插件开始执行 |
| on('started') | 所有插件 | 插件执行完成 |
| on('baseSchemeLoaded') | `base-comp-plugin` | 基础场景解析组件描述完成 |
| on('schemeLoaded') | `base-comp-plugin` `form-plugin` `table-plugin` `pager-plugin` `modal-plugin` | scheme已经加载 |
| on('formSchemeLoaded') | `form-plugin` | 表单场景字段已解析到scheme上 |
| on('tableSchemeLoaded') | `table-plugin` | 列表场景字段已解析到scheme上 |
| on('pagerSchemeLoaded') | `pager-plugin` | 分页场景已解析到scheme上 |
| on('modalSchemeLoaded') | `modal-plugin` | 弹框场景已解析到scheme上 |
