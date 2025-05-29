import type { File } from '@babel/types';
import type { WYWTransformMetadata } from '../../utils/TransformMetadata';
import type { Entrypoint } from '../Entrypoint';
import type { ITransformAction, Services, SyncScenarioForAction } from '../types';
type PrepareCodeFn = (services: Services, item: Entrypoint, originalAst: File) => [
    code: string,
    imports: Map<string, string[]> | null,
    metadata: WYWTransformMetadata | null
];
export declare const prepareCode: (services: Services, item: Entrypoint, originalAst: File) => [code: string, imports: Map<string, string[]> | null, metadata: WYWTransformMetadata | null];
export declare function internalTransform(this: ITransformAction, prepareFn: PrepareCodeFn): SyncScenarioForAction<ITransformAction>;
/**
 * Prepares the code for evaluation. This includes removing dead and potentially unsafe code.
 * Emits resolveImports and processImports events.
 */
export declare function transform(this: ITransformAction): SyncScenarioForAction<ITransformAction>;
export {};
