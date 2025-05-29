/// <reference types="debug" />
import type { Debugger } from '@wyw-in-js/shared';
import { BaseEntrypoint } from './BaseEntrypoint';
export interface IEvaluatedEntrypoint {
    evaluated: true;
    evaluatedOnly: string[];
    exports: Record<string | symbol, unknown>;
    generation: number;
    ignored: false;
    log: Debugger;
    only: string[];
}
export declare class EvaluatedEntrypoint extends BaseEntrypoint implements IEvaluatedEntrypoint {
    readonly evaluated = true;
    readonly ignored = false;
}
