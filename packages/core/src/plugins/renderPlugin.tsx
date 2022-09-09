import { isArray, isString, isUndefined } from 'lodash-es';
import { Slots, unref } from 'vue';
import { KoalaPlugin, SchemeStatus } from '../base';

export const renderPlugin: KoalaPlugin = (ctx) => {
    const renderNode = (scheme: SchemeStatus) => {
        if (!scheme) return;
        if (scheme.vIf?.value === false) return;
        const Component = ctx.getComponent(scheme.component);
        const show = isUndefined(scheme.vShow) ? true : scheme.vShow.value;
        const children = renderSchemes(scheme.children);
        if (!isUndefined(scheme.vModel)) {
            const vModel = scheme.vModel;
            return (
                <Component v-show={show} v-model={vModel.value + 1} {...scheme.props} {...scheme.events}>
                    {children}
                </Component>
            );
        } else {
            return (
                <Component v-show={show} {...scheme.props} {...scheme.events}>
                    {children}
                </Component>
            );
        }
    };

    const renderSchemes = (schemes?: Array<string | SchemeStatus> | Slots) => {
        if (!schemes) return;
        if (isArray(schemes)) {
            return schemes.map((scheme) => (isString(scheme) ? scheme : renderNode(scheme)));
        }
    };
    ctx.render = (slots) => renderSchemes(ctx.schemes);
};
