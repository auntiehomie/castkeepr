"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.features = exports.uvCounters = exports.memoryUsage = exports.uptime = exports.dlopen = exports.umask = exports.chdir = exports.kill = exports.exit = exports.cwd = exports.binding = exports.argv = exports.browser = exports.pid = exports.title = exports.execPath = exports.arch = exports.platform = exports.nextTick = void 0;
/**
 * It contains API for mocked process variable available in node environment used to evaluate scripts with node's `vm` in ./module.ts
 */
const nextTick = (fn) => setTimeout(fn, 0);
exports.nextTick = nextTick;
exports.platform = 'browser';
exports.arch = 'browser';
exports.execPath = 'browser';
exports.title = 'browser';
exports.pid = 1;
exports.browser = true;
exports.argv = [];
const binding = function binding() {
    throw new Error('No such module. (Possibly not yet loaded)');
};
exports.binding = binding;
const cwd = () => '/';
exports.cwd = cwd;
const noop = () => { };
exports.exit = noop;
exports.kill = noop;
exports.chdir = noop;
exports.umask = noop;
exports.dlopen = noop;
exports.uptime = noop;
exports.memoryUsage = noop;
exports.uvCounters = noop;
exports.features = {};
exports.env = process.env;
