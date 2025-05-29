"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseHandlers = void 0;
const baseProcessingHandlers_1 = require("./baseProcessingHandlers");
const collect_1 = require("./collect");
const evalFile_1 = require("./evalFile");
const extract_1 = require("./extract");
const workflow_1 = require("./workflow");
exports.baseHandlers = {
    ...baseProcessingHandlers_1.baseProcessingHandlers,
    collect: collect_1.collect,
    evalFile: evalFile_1.evalFile,
    extract: extract_1.extract,
    workflow: workflow_1.workflow,
};
