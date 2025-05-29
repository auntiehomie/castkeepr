import type { ICollectAction, SyncScenarioForAction } from '../types';
/**
 * Parses the specified file, finds tags, applies run-time replacements,
 * removes dead code.
 */
export declare function collect(this: ICollectAction): SyncScenarioForAction<ICollectAction>;
