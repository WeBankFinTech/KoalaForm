import { Ref } from 'vue';
import { SceneConfig, SceneContext, ComponentDesc, Reactive } from '../base';

export interface PagerSceneContext extends SceneContext {
    model: {
        pageSize: number;
        currentPage: number;
        totalCount: number;
    };
    ref: Ref;
}

export interface PagerSceneConfig extends SceneConfig {
    pager: ComponentDesc;
}
