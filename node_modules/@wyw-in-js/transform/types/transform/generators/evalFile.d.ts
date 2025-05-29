import type { IEvalAction, SyncScenarioForAction } from '../types';
/**
 * Executes the code prepared in previous steps within the current `Entrypoint`.
 * Returns all exports that were requested in `only`.
 */
export declare function evalFile(this: IEvalAction): SyncScenarioForAction<IEvalAction>;
