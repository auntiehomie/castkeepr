"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseProcessingHandlers = void 0;
var _explodeReexports = require("./explodeReexports");
var _getExports = require("./getExports");
var _processEntrypoint = require("./processEntrypoint");
var _processImports = require("./processImports");
var _transform = require("./transform");
// eslint-disable-next-line require-yield
function* emptyHandler() {
  throw new Error(`Handler for ${this.type} is not implemented`);
}
const baseProcessingHandlers = exports.baseProcessingHandlers = {
  collect: emptyHandler,
  evalFile: emptyHandler,
  extract: emptyHandler,
  workflow: emptyHandler,
  explodeReexports: _explodeReexports.explodeReexports,
  getExports: _getExports.getExports,
  processEntrypoint: _processEntrypoint.processEntrypoint,
  processImports: _processImports.processImports,
  transform: _transform.transform
};
//# sourceMappingURL=baseProcessingHandlers.js.map