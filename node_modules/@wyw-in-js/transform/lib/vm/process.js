"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uvCounters = exports.uptime = exports.umask = exports.title = exports.platform = exports.pid = exports.nextTick = exports.memoryUsage = exports.kill = exports.features = exports.exit = exports.execPath = exports.env = exports.dlopen = exports.cwd = exports.chdir = exports.browser = exports.binding = exports.argv = exports.arch = void 0;
/**
 * It contains API for mocked process variable available in node environment used to evaluate scripts with node's `vm` in ./module.ts
 */
const nextTick = fn => setTimeout(fn, 0);
exports.nextTick = nextTick;
const platform = exports.platform = 'browser';
const arch = exports.arch = 'browser';
const execPath = exports.execPath = 'browser';
const title = exports.title = 'browser';
const pid = exports.pid = 1;
const browser = exports.browser = true;
const argv = exports.argv = [];
const binding = exports.binding = function binding() {
  throw new Error('No such module. (Possibly not yet loaded)');
};
const cwd = () => '/';
exports.cwd = cwd;
const noop = () => {};
const exit = exports.exit = noop;
const kill = exports.kill = noop;
const chdir = exports.chdir = noop;
const umask = exports.umask = noop;
const dlopen = exports.dlopen = noop;
const uptime = exports.uptime = noop;
const memoryUsage = exports.memoryUsage = noop;
const uvCounters = exports.uvCounters = noop;
const features = exports.features = {};
const {
  env
} = process;
exports.env = env;
//# sourceMappingURL=process.js.map