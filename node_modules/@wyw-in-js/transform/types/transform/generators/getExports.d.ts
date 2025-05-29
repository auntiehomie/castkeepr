import type { Entrypoint } from '../Entrypoint';
import type { IEntrypointDependency } from '../Entrypoint.types';
import type { IGetExportsAction, SyncScenarioForAction } from '../types';
export declare function findExportsInImports(entrypoint: Entrypoint, imports: IEntrypointDependency[]): {
    entrypoint: Entrypoint;
    import: string;
}[];
export declare function getExports(this: IGetExportsAction): SyncScenarioForAction<IGetExportsAction>;
