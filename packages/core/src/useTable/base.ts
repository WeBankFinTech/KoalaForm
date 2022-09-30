import { Ref } from 'vue';
import { SceneConfig, SceneContext, Field, ComponentDesc } from '../base';

export interface TableSceneContext extends SceneContext {
    ref: Ref;
    model: Ref<Array<unknown>>;
}

export interface TableSceneConfig extends SceneConfig {
    table: ComponentDesc;
    fields: Field[];
}
