---
sidebarDepth: 3
---
# useTableWithPager
列表和分页的组合场景


## 前端分页
当`dataSource.value.length > pager.model.pageSize`时，前端自动分页

<ExampleDoc>
<ComposeUseTableWithPager>
</ComposeUseTableWithPager>
<template #code>

<<< @/examples/compose/useTableWithPager.js

</template>
</ExampleDoc>


## 后端分页
当`dataSource.value.length <= pager.model.pageSize`时，后端分页

<ExampleDoc>
<ComposeUseTableWithPager2>
</ComposeUseTableWithPager2>
<template #code>

<<< @/examples/compose/useTableWithPager2.js

</template>
</ExampleDoc>