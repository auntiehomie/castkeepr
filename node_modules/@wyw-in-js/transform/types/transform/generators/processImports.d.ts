import type { IProcessImportsAction, SyncScenarioForAction } from '../types';
/**
 * Creates new entrypoints and emits processEntrypoint for each resolved import
 */
export declare function processImports(this: IProcessImportsAction): SyncScenarioForAction<IProcessImportsAction>;
