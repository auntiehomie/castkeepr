/// <reference types="debug" />
import type { Debugger } from '@wyw-in-js/shared';
import type { ParentEntrypoint } from '../types';
import type { Services } from './types';
export declare const createExports: (log: Debugger) => Record<string | symbol, unknown>;
export declare abstract class BaseEntrypoint {
    #private;
    protected services: Services;
    readonly evaluatedOnly: string[];
    readonly generation: number;
    readonly name: string;
    readonly only: string[];
    readonly parents: ParentEntrypoint[];
    static createExports: (log: Debugger) => Record<string | symbol, unknown>;
    readonly idx: string;
    readonly log: Debugger;
    readonly seqId: number;
    protected constructor(services: Services, evaluatedOnly: string[], exports: Record<string | symbol, unknown> | undefined, generation: number, name: string, only: string[], parents: ParentEntrypoint[]);
    get exports(): Record<string | symbol, unknown>;
    set exports(value: unknown);
    get ref(): string;
    protected get exportsProxy(): Record<string | symbol, unknown>;
}
