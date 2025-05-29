import type { Entrypoint } from '../Entrypoint';
export declare class UnprocessedEntrypointError extends Error {
    entrypoint: Entrypoint;
    constructor(entrypoint: Entrypoint);
}
export declare const isUnprocessedEntrypointError: (value: unknown) => value is UnprocessedEntrypointError;
