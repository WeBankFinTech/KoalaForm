import './main';
import StartedScene from './started/useScene';
import StartedSceneVue from './started/useScene.vue';
import StartedUseForm from './started/useForm';
import StartedUseTable from './started/useTable';
import StartedUsePager from './started/usePager';
import StartedUseModal from './started/useModal';
import StartedUseCurd from './started/useCurd';
// import ComposeUseTableWithPager from './compose/useTableWithPager';
// import ComposeUseTableWithPager2 from './compose/useTableWithPager2';

import UseFormQuery from './useForm/query';
import UseFormEdit from './useForm/edit';
import UseFormRelation from './useForm/relation';
import UseFormValidate from './useForm/validate';

import BaseForm from './base/form';
import BaseComp from './base/comp';
import BaseField from './base/field';
import BaseSlotRender from './base/slotRender.vue';

import FesdCurd from './fesdCurd';
import FesdUseCurd from './fesdUseCurd.vue';

import LabelPlugin from './labelPlugin';

import ElementCurd from './elementCurd';
import ElementUseCurd from './elementUseCurd.vue';

import AntdCurd from './antdCurd';
import antdUseCurd from './antdUseCurd.vue';

import Demos from './demos/index';

export default {
    StartedSceneVue,
    StartedScene,
    StartedUseForm,
    StartedUseTable,
    StartedUsePager,
    StartedUseModal,
    StartedUseCurd,
    UseFormQuery,
    UseFormEdit,
    UseFormRelation,
    UseFormValidate,
    BaseForm,
    BaseComp,
    BaseField,
    BaseSlotRender,
    FesdCurd,
    FesdUseCurd,
    LabelPlugin,
    ElementCurd,
    ElementUseCurd,
    AntdCurd,
    antdUseCurd,
    ...Demos,
};
