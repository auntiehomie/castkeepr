"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asyncActionRunner = asyncActionRunner;
exports.syncActionRunner = syncActionRunner;
var _types = require("../types");
var _AbortError = require("./AbortError");
/* eslint-disable no-await-in-loop */

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
const isActionError = e => Array.isArray(e) && e[0] === ACTION_ERROR;
async function asyncActionRunner(action, actionHandlers, stack = [getActionRef(action.type, action.entrypoint)]) {
  if (action.result !== _types.Pending) {
    action.log('result is cached');
    return action.result;
  }
  const handler = getHandler(action, actionHandlers);
  const generator = action.run(handler);
  let actionResult;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    var _action$abortSignal;
    if ((_action$abortSignal = action.abortSignal) !== null && _action$abortSignal !== void 0 && _action$abortSignal.aborted) {
      action.log('action is aborted');
      generator.throw(new _AbortError.AbortError(stack[0]));
    }
    const result = await (isActionError(actionResult) ? generator.throw(actionResult[1]) : generator.next(actionResult));
    if (result.done) {
      return result.value;
    }
    const [type, entrypoint, data, abortSignal] = result.value;
    const nextAction = entrypoint.createAction(type, data, abortSignal);
    try {
      actionResult = await asyncActionRunner(nextAction, actionHandlers, [...stack, getActionRef(type, entrypoint)]);
    } catch (e) {
      nextAction.log('error', e);
      actionResult = [ACTION_ERROR, e];
    }
  }
}
function syncActionRunner(action, actionHandlers, stack = [getActionRef(action.type, action.entrypoint)]) {
  if (action.result !== _types.Pending) {
    action.log('result is cached');
    return action.result;
  }
  const handler = getHandler(action, actionHandlers);
  const generator = action.run(handler);
  let actionResult;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    var _action$abortSignal2;
    if ((_action$abortSignal2 = action.abortSignal) !== null && _action$abortSignal2 !== void 0 && _action$abortSignal2.aborted) {
      action.log('action is aborted');
      generator.throw(new _AbortError.AbortError(stack[0]));
    }
    const result = isActionError(actionResult) ? generator.throw(actionResult[1]) : generator.next(actionResult);
    if (result.done) {
      return result.value;
    }
    const [type, entrypoint, data, abortSignal] = result.value;
    const nextAction = entrypoint.createAction(type, data, abortSignal);
    try {
      actionResult = syncActionRunner(nextAction, actionHandlers, [...stack, getActionRef(type, entrypoint)]);
    } catch (e) {
      nextAction.log('error', e);
      actionResult = [ACTION_ERROR, e];
    }
  }
}
//# sourceMappingURL=actionRunner.js.map