---
sidebarDepth: 3
---
# Preset
Preset是负责渲染koala-form，比如根据字段定义的type，决定如何渲染对应的form控件。

Preset就像是koala-form和UI组件库的一个连接桥梁。

比如@koala-form/fesd-preset，是通过preset接口将UI组件库fes-design和koala-form进行连接；

@koala-form/antd-preset，是通过preset接口将UI组件库ant-design和koala-form进行连接。

## 上手开发
这里选用fes-design作为ui框架

1. 安装依赖
```
npm i @fesjs/fes-design
npm i @koala-form/core
```

2. 实现preset
通过preset提供的definePreset方法，实现部分方法
```jsx
export default definePreset({
    // 实现模态框渲染
    modalRender(defaultSlot, { modalModel, onOk, onCancel, modalProps }) {
        return (
            <FModal
                show={modalModel.visible}
                title={modalModel.title}
                displayDirective="if"
                okText={modalModel.okText || undefined}
                cancelText={modalModel.cancelText || undefined}
                onOk={() => onOk()}
                onCancel={() => onCancel()}
                {...modalProps}
            >
                {defaultSlot()}
            </FModal>
        );
    },
    // 实现表单页面渲染
    pageRender(defaultSlot) {
        return (
            <FConfigProvider>
                <div class="fesd-koala-page">{defaultSlot()}</div>
            </FConfigProvider>
        );
    },
    // message组件渲染
    message: FMessage,
    // confirm渲染
    confirm(params) {
        FModal.confirm(params);
    },
})
```

3. 发布到npm

## 使用技巧