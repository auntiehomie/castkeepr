import type { IExplodeReexportsAction, SyncScenarioForAction } from '../types';
/**
 * Replaces wildcard reexports with named reexports.
 * Recursively emits getExports for each reexported module,
 * and replaces wildcard with resolved named.
 */
export declare function explodeReexports(this: IExplodeReexportsAction): SyncScenarioForAction<IExplodeReexportsAction>;
