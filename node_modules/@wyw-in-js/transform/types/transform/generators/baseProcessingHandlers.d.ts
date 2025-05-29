import type { SyncScenarioForAction, ICollectAction, IEvalAction, IExtractAction, IWorkflowAction } from '../types';
import { explodeReexports } from './explodeReexports';
import { getExports } from './getExports';
import { processEntrypoint } from './processEntrypoint';
import { processImports } from './processImports';
import { transform } from './transform';
export declare const baseProcessingHandlers: {
    collect: (this: ICollectAction) => SyncScenarioForAction<ICollectAction>;
    evalFile: (this: IEvalAction) => SyncScenarioForAction<IEvalAction>;
    extract: (this: IExtractAction) => SyncScenarioForAction<IExtractAction>;
    workflow: (this: IWorkflowAction) => SyncScenarioForAction<IWorkflowAction>;
    explodeReexports: typeof explodeReexports;
    getExports: typeof getExports;
    processEntrypoint: typeof processEntrypoint;
    processImports: typeof processImports;
    transform: typeof transform;
};
