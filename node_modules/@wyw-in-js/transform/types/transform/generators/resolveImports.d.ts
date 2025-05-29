import type { AsyncScenarioForAction, IResolveImportsAction, SyncScenarioForAction } from '../types';
/**
 * Synchronously resolves specified imports with a provided resolver.
 */
export declare function syncResolveImports(this: IResolveImportsAction, resolve: (what: string, importer: string, stack: string[]) => string): SyncScenarioForAction<IResolveImportsAction>;
/**
 * Asynchronously resolves specified imports with a provided resolver.
 */
export declare function asyncResolveImports(this: IResolveImportsAction, resolve: (what: string, importer: string, stack: string[]) => Promise<string | null>): AsyncScenarioForAction<IResolveImportsAction>;
