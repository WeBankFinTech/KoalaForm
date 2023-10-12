# 如何贡献Demo

通过提PR的形式贡献，步骤如下：

### 1. 启动项目

通过git clone KoalaForm的github地址，执行以下命令

```bash
pnpm i
pnpm run docs:dev
```
启动后可访问文档地址：`http://localhost:3000/`

### 2. 新建demo的md文件

在`docs/zh/demos`目录新建md文件，比如login.md

### 3. 配置md文件

在`docs/.vitepress/config.js`中，找到getDemosSidebar方法，配置md文件的路由，比如
```js
function getDemosSidebar() {
  return [
    { text: '如何贡献Demo', link: '/zh/demos/' },
    { text: '登录', link: '/zh/demos/login' },
  ]
}
```

保存后，访问：`http://localhost:3000/zh/demos/login` 可以看到配置的md文件

### 4. 开发demo示例

在`docs/examples/demos`目录下，新建demo文件，比如login.vue

开发完demo后，将文件导出到`docs/examples/demos/index.js`中

### 5. 配置demo到md文件

回到md文件上，使用`ExampleDoc`组件引用示例和代码，如：
```html

<ExampleDoc expanded>
<Login>
</Login>
<template #code>

<<< @/examples/demos/login.vue

</template>
</ExampleDoc>

```

配置保存之后，可以在浏览器看到效果。

### 6. 提交PR

提交PR到gitHub上。