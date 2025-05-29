"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseHandlers = void 0;
var _baseProcessingHandlers = require("./baseProcessingHandlers");
var _collect = require("./collect");
var _evalFile = require("./evalFile");
var _extract = require("./extract");
var _workflow = require("./workflow");
const baseHandlers = exports.baseHandlers = {
  ..._baseProcessingHandlers.baseProcessingHandlers,
  collect: _collect.collect,
  evalFile: _evalFile.evalFile,
  extract: _extract.extract,
  workflow: _workflow.workflow
};
//# sourceMappingURL=index.js.map