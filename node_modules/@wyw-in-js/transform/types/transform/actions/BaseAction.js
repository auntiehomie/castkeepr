"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAction = void 0;
/* eslint-disable no-plusplus */
require("../../utils/dispose-polyfill");
const types_1 = require("../types");
let actionIdx = 0;
class BaseAction {
    type;
    services;
    entrypoint;
    data;
    abortSignal;
    idx;
    result = types_1.Pending;
    activeScenario = null;
    activeScenarioError;
    activeScenarioNextResults = [];
    constructor(type, services, entrypoint, data, abortSignal) {
        this.type = type;
        this.services = services;
        this.entrypoint = entrypoint;
        this.data = data;
        this.abortSignal = abortSignal;
        actionIdx += 1;
        this.idx = actionIdx.toString(16).padStart(6, '0');
    }
    get log() {
        return this.entrypoint.log.extend(this.ref);
    }
    get ref() {
        return `${this.type}@${this.idx}`;
    }
    createAbortSignal() {
        const abortController = new AbortController();
        const unsubscribeFromParentAbort = this.onAbort(() => {
            this.entrypoint.log('parent aborted');
            abortController.abort();
        });
        const unsubscribeFromSupersede = this.entrypoint.onSupersede(() => {
            this.entrypoint.log('entrypoint superseded, aborting processing');
            abortController.abort();
        });
        const abortSignal = abortController.signal;
        abortSignal[Symbol.dispose] = () => {
            unsubscribeFromParentAbort();
            unsubscribeFromSupersede();
        };
        return abortSignal;
    }
    *getNext(type, entrypoint, data, abortSignal = this.abortSignal) {
        return (yield [
            type,
            entrypoint,
            data,
            abortSignal,
        ]);
    }
    onAbort(fn) {
        this.abortSignal?.addEventListener('abort', fn);
        return () => {
            this.abortSignal?.removeEventListener('abort', fn);
        };
    }
    run(handler) {
        if (!this.activeScenario) {
            this.activeScenario = handler.call(this);
            this.activeScenarioNextResults = [];
        }
        let nextIdx = 0;
        const throwFn = (e) => this.emitAction(nextIdx, () => this.activeScenario.throw(e));
        const nextFn = (arg) => this.emitAction(nextIdx, () => this.activeScenario.next(arg));
        const processNextResult = (result, onError) => {
            if ('then' in result) {
                result.then((r) => {
                    if (r.done) {
                        this.result = r.value;
                    }
                }, onError);
            }
            else if (result.done) {
                this.result = result.value;
            }
            this.activeScenarioNextResults.push(result);
        };
        const processError = (e) => {
            if (this.activeScenarioNextResults.length > nextIdx) {
                this.log('error was already handled in another branch, result idx is %d', nextIdx);
                return;
            }
            this.log('error processing, result idx is %d', nextIdx);
            try {
                const nextResult = throwFn(e);
                processNextResult(nextResult, processError);
            }
            catch (errorInGenerator) {
                const { recover } = handler;
                if (recover) {
                    const nextResult = {
                        done: false,
                        value: recover(errorInGenerator, this),
                    };
                    processNextResult(nextResult, processError);
                    return;
                }
                this.activeScenarioError = errorInGenerator;
                throw errorInGenerator;
            }
        };
        const processNext = (arg) => {
            if (this.activeScenarioNextResults.length > nextIdx) {
                this.log('next was already handled in another branch, result idx is %d', nextIdx);
                return;
            }
            this.log('next processing, result idx is %d', nextIdx);
            try {
                const nextResult = nextFn(arg);
                processNextResult(nextResult, processError);
            }
            catch (e) {
                processError(e);
            }
        };
        return {
            next: (arg) => {
                this.rethrowActiveScenarioError();
                processNext(arg);
                return this.activeScenarioNextResults[nextIdx++];
            },
            throw: (e) => {
                this.rethrowActiveScenarioError();
                processError(e);
                return this.activeScenarioNextResults[nextIdx++];
            },
        };
    }
    emitAction(yieldIdx, fn) {
        return this.services.eventEmitter.action(this.type, `${this.idx}:${yieldIdx + 1}`, this.entrypoint.ref, fn);
    }
    rethrowActiveScenarioError() {
        if (!this.activeScenarioError) {
            return;
        }
        this.log('scenario has an unhandled error from another branch, rethrow %o', this.activeScenarioError);
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw this.activeScenarioError;
    }
}
exports.BaseAction = BaseAction;
