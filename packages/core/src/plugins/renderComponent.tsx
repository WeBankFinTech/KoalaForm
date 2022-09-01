import { KoalaPlugin } from '../base';

export const renderComponentPlugin: KoalaPlugin = (ctx) => {
    ctx.renderComponent = (name, props, slots) => {
        const Component = ctx.getComponent(name || '');
        if (!Component) return slots?.default?.();
        return <Component {...(props || {})}>{slots?.default?.()}</Component>;
    };
};
