"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUnprocessedEntrypointError = exports.UnprocessedEntrypointError = void 0;
class UnprocessedEntrypointError extends Error {
    entrypoint;
    constructor(entrypoint) {
        super(`Entrypoint ${entrypoint.idx} is not processed and can't be evaluated`);
        this.entrypoint = entrypoint;
    }
}
exports.UnprocessedEntrypointError = UnprocessedEntrypointError;
const isUnprocessedEntrypointError = (value) => value instanceof UnprocessedEntrypointError;
exports.isUnprocessedEntrypointError = isUnprocessedEntrypointError;
