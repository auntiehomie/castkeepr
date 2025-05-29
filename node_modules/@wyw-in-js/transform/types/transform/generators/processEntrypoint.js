"use strict";
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEntrypoint = void 0;
const AbortError_1 = require("../actions/AbortError");
/**
 * The first stage of processing an entrypoint.
 * This stage is responsible for:
 * - scheduling the explodeReexports action
 * - scheduling the transform action
 * - rescheduling itself if the entrypoint is superseded
 */
function* processEntrypoint() {
    const { only, log } = this.entrypoint;
    log('start processing (only: %o)', only);
    try {
        const env_1 = { stack: [], error: void 0, hasError: false };
        try {
            const abortSignal = __addDisposableResource(env_1, this.createAbortSignal(), false);
            yield ['explodeReexports', this.entrypoint, undefined, abortSignal];
            const result = yield* this.getNext('transform', this.entrypoint, undefined, abortSignal);
            this.entrypoint.assertNotSuperseded();
            this.entrypoint.setTransformResult(result);
            log('entrypoint processing finished');
        }
        catch (e_1) {
            env_1.error = e_1;
            env_1.hasError = true;
        }
        finally {
            __disposeResources(env_1);
        }
    }
    catch (e) {
        if ((0, AbortError_1.isAborted)(e) && this.entrypoint.supersededWith) {
            log('processing aborted, schedule the next attempt');
            yield* this.getNext('processEntrypoint', this.entrypoint.supersededWith, undefined, null);
            return;
        }
        log(`Unhandled error: %O`, e);
        throw e;
    }
}
exports.processEntrypoint = processEntrypoint;
