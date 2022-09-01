import {
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onErrorCaptured,
    onMounted,
    onRenderTracked,
    onRenderTriggered,
    onUnmounted,
    onUpdated,
} from 'vue';
import { WhenPlugin } from '../base';

const LifeCycle = {
    beforeMount: onBeforeMount,
    mounted: onMounted,
    beforeUpdate: onBeforeUpdate,
    updated: onUpdated,
    beforeUnmount: onBeforeUnmount,
    unmounted: onUnmounted,
    errorCaptured: onErrorCaptured,
    renderTracked: onRenderTracked,
    renderTriggered: onRenderTriggered,
    activated: onActivated,
    deactivated: onDeactivated,
};

export type LifeCycleType = keyof typeof LifeCycle;

export const whenLifeCycle: WhenPlugin<LifeCycleType> = (type: LifeCycleType) => {
    const life = LifeCycle[type];
    if (!life) {
        console.warn();
        return;
    }
    return (cxt, invoke) => life(invoke);
};
