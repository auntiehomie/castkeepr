import type { IWorkflowAction, SyncScenarioForAction } from '../types';
/**
 * The entry point for file processing. Sequentially calls `processEntrypoint`,
 * `evalFile`, `collect`, and `extract`. Returns the result of transforming
 * the source code as well as all artifacts obtained from code execution.
 */
export declare function workflow(this: IWorkflowAction): SyncScenarioForAction<IWorkflowAction>;
