import { Reactive, SceneContext } from '../base';
import { Field } from '../field';

export type When<T extends SceneContext = SceneContext> = (cxt: T, invoke: (...args: unknown[]) => void, field?: Field) => void;

export type WhenPlugin<T, K extends SceneContext = SceneContext> = (args: T) => When<K> | undefined;

export type Handle<T extends SceneContext = SceneContext> = (cxt: T, value?: unknown) => Promise<unknown> | unknown;

export interface Action {
    name?: string;
    label?: string;
    component?: string;
    props?: Reactive;
    when?: When;
    handles?: Handle | Handle[];
}
