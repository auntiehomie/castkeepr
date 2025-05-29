"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAborted = exports.AbortError = void 0;
class AbortError extends Error {
    constructor(reason) {
        super(reason);
        this.name = 'AbortError';
    }
}
exports.AbortError = AbortError;
const isAborted = (value) => value instanceof AbortError;
exports.isAborted = isAborted;
