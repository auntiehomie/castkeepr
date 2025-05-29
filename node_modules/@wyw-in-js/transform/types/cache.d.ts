import type { Entrypoint } from './transform/Entrypoint';
import type { IEvaluatedEntrypoint } from './transform/EvaluatedEntrypoint';
interface ICaches {
    entrypoints: Map<string, Entrypoint | IEvaluatedEntrypoint>;
    exports: Map<string, string[]>;
}
type MapValue<T> = T extends Map<string, infer V> ? V : never;
declare const cacheNames: readonly ["entrypoints", "exports"];
type CacheNames = (typeof cacheNames)[number];
export declare class TransformCacheCollection {
    readonly entrypoints: Map<string, Entrypoint | IEvaluatedEntrypoint>;
    readonly exports: Map<string, string[]>;
    private contentHashes;
    constructor(caches?: Partial<ICaches>);
    add<TCache extends CacheNames, TValue extends MapValue<ICaches[TCache]>>(cacheName: TCache, key: string, value: TValue): void;
    clear(cacheName: CacheNames | 'all'): void;
    delete(cacheName: CacheNames, key: string): void;
    get<TCache extends CacheNames, TValue extends MapValue<ICaches[TCache]>>(cacheName: TCache, key: string): TValue | undefined;
    has(cacheName: CacheNames, key: string): boolean;
    invalidate(cacheName: CacheNames, key: string): void;
    invalidateForFile(filename: string): void;
    invalidateIfChanged(filename: string, content: string): boolean;
}
export {};
