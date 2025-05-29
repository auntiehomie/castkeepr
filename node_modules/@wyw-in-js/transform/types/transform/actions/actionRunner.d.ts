import type { ActionQueueItem, Handlers, TypeOfResult } from '../types';
import type { BaseAction } from './BaseAction';
export declare function asyncActionRunner<TAction extends ActionQueueItem>(action: BaseAction<TAction>, actionHandlers: Handlers<'async' | 'sync'>, stack?: string[]): Promise<TypeOfResult<TAction>>;
export declare function syncActionRunner<TAction extends ActionQueueItem>(action: BaseAction<TAction>, actionHandlers: Handlers<'sync'>, stack?: string[]): TypeOfResult<TAction>;
