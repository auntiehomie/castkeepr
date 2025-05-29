/// <reference types="debug" />
import '../../utils/dispose-polyfill';
import type { Debugger } from '@wyw-in-js/shared';
import type { Entrypoint } from '../Entrypoint';
import type { ActionQueueItem, ActionTypes, AnyIteratorResult, Handler, IBaseAction, Services, TypeOfResult, YieldResult } from '../types';
import { Pending } from '../types';
export type ActionByType<TType extends ActionTypes> = Extract<ActionQueueItem, {
    type: TType;
}>;
type GetBase<TAction extends ActionQueueItem> = IBaseAction<TAction, TypeOfResult<TAction>, TAction['data']>;
export declare class BaseAction<TAction extends ActionQueueItem> implements GetBase<TAction> {
    readonly type: TAction['type'];
    readonly services: Services;
    readonly entrypoint: Entrypoint;
    readonly data: TAction['data'];
    readonly abortSignal: AbortSignal | null;
    readonly idx: string;
    result: TypeOfResult<TAction> | typeof Pending;
    private activeScenario;
    private activeScenarioError?;
    private activeScenarioNextResults;
    constructor(type: TAction['type'], services: Services, entrypoint: Entrypoint, data: TAction['data'], abortSignal: AbortSignal | null);
    get log(): Debugger;
    get ref(): string;
    createAbortSignal(): AbortSignal & Disposable;
    getNext<TNextType extends ActionTypes, TNextAction extends ActionByType<TNextType> = ActionByType<TNextType>>(type: TNextType, entrypoint: Entrypoint, data: TNextAction['data'], abortSignal?: AbortSignal | null): Generator<[
        TNextType,
        Entrypoint,
        TNextAction['data'],
        AbortSignal | null
    ], TypeOfResult<TNextAction>, YieldResult>;
    onAbort(fn: () => void): () => void;
    run<TMode extends 'async' | 'sync', THandler extends Handler<TMode, TAction> = Handler<TMode, TAction>>(handler: THandler): {
        next: (arg: YieldResult) => AnyIteratorResult<TMode, TypeOfResult<TAction>>;
        throw: (e: unknown) => AnyIteratorResult<TMode, TypeOfResult<TAction>>;
    };
    protected emitAction<TRes>(yieldIdx: number, fn: () => TRes): TRes;
    private rethrowActiveScenarioError;
}
export {};
