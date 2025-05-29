"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncActionRunner = exports.asyncActionRunner = void 0;
const types_1 = require("../types");
const AbortError_1 = require("./AbortError");
function getHandler(action, actionHandlers) {
    const handler = actionHandlers[action.type];
    if (!handler) {
        throw new Error(`No handler for action ${action.type}`);
    }
    // FIXME Handlers<TMode>[TAction['type']] is not assignable to Handler<TMode, TAction>
    return handler;
}
const getActionRef = (type, entrypoint) => `${type}@${entrypoint.ref}`;
const ACTION_ERROR = Symbol('ACTION_ERROR');
const isActionError = (e) => Array.isArray(e) && e[0] === ACTION_ERROR;
async function asyncActionRunner(action, actionHandlers, stack = [getActionRef(action.type, action.entrypoint)]) {
    if (action.result !== types_1.Pending) {
        action.log('result is cached');
        return action.result;
    }
    const handler = getHandler(action, actionHandlers);
    const generator = action.run(handler);
    let actionResult;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (action.abortSignal?.aborted) {
            action.log('action is aborted');
            generator.throw(new AbortError_1.AbortError(stack[0]));
        }
        const result = await (isActionError(actionResult)
            ? generator.throw(actionResult[1])
            : generator.next(actionResult));
        if (result.done) {
            return result.value;
        }
        const [type, entrypoint, data, abortSignal] = result.value;
        const nextAction = entrypoint.createAction(type, data, abortSignal);
        try {
            actionResult = await asyncActionRunner(nextAction, actionHandlers, [
                ...stack,
                getActionRef(type, entrypoint),
            ]);
        }
        catch (e) {
            nextAction.log('error', e);
            actionResult = [ACTION_ERROR, e];
        }
    }
}
exports.asyncActionRunner = asyncActionRunner;
function syncActionRunner(action, actionHandlers, stack = [getActionRef(action.type, action.entrypoint)]) {
    if (action.result !== types_1.Pending) {
        action.log('result is cached');
        return action.result;
    }
    const handler = getHandler(action, actionHandlers);
    const generator = action.run(handler);
    let actionResult;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (action.abortSignal?.aborted) {
            action.log('action is aborted');
            generator.throw(new AbortError_1.AbortError(stack[0]));
        }
        const result = isActionError(actionResult)
            ? generator.throw(actionResult[1])
            : generator.next(actionResult);
        if (result.done) {
            return result.value;
        }
        const [type, entrypoint, data, abortSignal] = result.value;
        const nextAction = entrypoint.createAction(type, data, abortSignal);
        try {
            actionResult = syncActionRunner(nextAction, actionHandlers, [
                ...stack,
                getActionRef(type, entrypoint),
            ]);
        }
        catch (e) {
            nextAction.log('error', e);
            actionResult = [ACTION_ERROR, e];
        }
    }
}
exports.syncActionRunner = syncActionRunner;
