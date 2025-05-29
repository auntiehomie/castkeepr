/**
 * This file exposes sync and async transform functions that:
 * - parse the passed code to AST
 * - builds a dependency graph for the file
 * - shakes each dependency and removes unused code
 * - runs generated code in a sandbox
 * - collects artifacts
 * - returns transformed code (without WYW template literals), generated CSS, source maps and babel metadata from transform step.
 */
import type { PartialOptions } from './transform/helpers/loadWywOptions';
import type { Handlers, Services } from './transform/types';
import type { Result } from './types';
type PartialServices = Partial<Omit<Services, 'options'>> & {
    options: Omit<Services['options'], 'pluginOptions'> & {
        pluginOptions?: PartialOptions;
    };
};
type AllHandlers<TMode extends 'async' | 'sync'> = Handlers<TMode>;
export declare function transformSync(partialServices: PartialServices, originalCode: string, syncResolve: (what: string, importer: string, stack: string[]) => string, customHandlers?: Partial<AllHandlers<'sync'>>): Result;
export declare function transform(partialServices: PartialServices, originalCode: string, asyncResolve: (what: string, importer: string, stack: string[]) => Promise<string | null>, customHandlers?: Partial<AllHandlers<'sync'>>): Promise<Result>;
export {};
