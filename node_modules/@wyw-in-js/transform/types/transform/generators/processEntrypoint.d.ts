import type { IProcessEntrypointAction, SyncScenarioForAction } from '../types';
/**
 * The first stage of processing an entrypoint.
 * This stage is responsible for:
 * - scheduling the explodeReexports action
 * - scheduling the transform action
 * - rescheduling itself if the entrypoint is superseded
 */
export declare function processEntrypoint(this: IProcessEntrypointAction): SyncScenarioForAction<IProcessEntrypointAction>;
