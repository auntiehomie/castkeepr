import type { BuildCodeFrameErrorFn } from '@wyw-in-js/shared';
declare function throwIfInvalid<T>(checker: (value: unknown) => value is T, value: Error | unknown, ex: {
    buildCodeFrameError: BuildCodeFrameErrorFn;
}, source: string): asserts value is T;
export default throwIfInvalid;
