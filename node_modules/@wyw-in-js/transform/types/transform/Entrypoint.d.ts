import type { ParentEntrypoint, ITransformFileResult } from '../types';
import { BaseEntrypoint } from './BaseEntrypoint';
import type { IEntrypointCode, IEntrypointDependency, IIgnoredEntrypoint } from './Entrypoint.types';
import { EvaluatedEntrypoint } from './EvaluatedEntrypoint';
import type { ActionByType } from './actions/BaseAction';
import { BaseAction } from './actions/BaseAction';
import type { Services, ActionTypes } from './types';
export declare class Entrypoint extends BaseEntrypoint {
    #private;
    readonly initialCode: string | undefined;
    protected readonly resolveTasks: Map<string, Promise<IEntrypointDependency>>;
    protected readonly dependencies: Map<string, IEntrypointDependency>;
    readonly evaluated = false;
    readonly loadedAndParsed: IEntrypointCode | IIgnoredEntrypoint;
    protected onSupersedeHandlers: Array<(newEntrypoint: Entrypoint) => void>;
    private actionsCache;
    private constructor();
    get ignored(): boolean;
    get originalCode(): string | undefined;
    get supersededWith(): Entrypoint | null;
    get transformedCode(): string | null;
    static createRoot(services: Services, name: string, only: string[], loadedCode: string | undefined): Entrypoint;
    /**
     * Creates an entrypoint for the specified file.
     * If there is already an entrypoint for this file, there will be four possible outcomes:
     * 1. If `loadedCode` is specified and is different from the one that was used to create the existing entrypoint,
     *   the existing entrypoint will be superseded by a new one and all cached results for it will be invalidated.
     *   It can happen if the file was changed and the watcher notified us about it, or we received a new version
     *   of the file from a loader whereas the previous one was loaded from the filesystem.
     *   The new entrypoint will be returned.
     * 2. If `only` is subset of the existing entrypoint's `only`, the existing entrypoint will be returned.
     * 3. If `only` is superset of the existing entrypoint's `only`, the existing entrypoint will be superseded and the new one will be returned.
     * 4. If a loop is detected, 'ignored' will be returned, the existing entrypoint will be superseded or not depending on the `only` value.
     */
    protected static create(services: Services, parent: ParentEntrypoint | null, name: string, only: string[], loadedCode: string | undefined): Entrypoint | 'loop';
    private static innerCreate;
    addDependency(dependency: IEntrypointDependency): void;
    addResolveTask(name: string, dependency: Promise<IEntrypointDependency>): void;
    assertNotSuperseded(): void;
    assertTransformed(): void;
    createAction<TType extends ActionTypes, TAction extends ActionByType<TType>>(actionType: TType, data: TAction['data'], abortSignal?: AbortSignal | null): BaseAction<TAction>;
    createChild(name: string, only: string[], loadedCode?: string): Entrypoint | 'loop';
    createEvaluated(): EvaluatedEntrypoint;
    getDependency(name: string): IEntrypointDependency | undefined;
    getResolveTask(name: string): Promise<IEntrypointDependency> | undefined;
    hasWywMetadata(): boolean;
    onSupersede(callback: (newEntrypoint: Entrypoint) => void): () => void;
    setTransformResult(res: ITransformFileResult | null): void;
    private supersede;
}
