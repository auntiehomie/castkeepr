export declare class AbortError extends Error {
    constructor(reason?: string);
}
export declare const isAborted: (value: unknown) => value is AbortError;
