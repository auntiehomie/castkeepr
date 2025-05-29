"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseProcessingHandlers = void 0;
const explodeReexports_1 = require("./explodeReexports");
const getExports_1 = require("./getExports");
const processEntrypoint_1 = require("./processEntrypoint");
const processImports_1 = require("./processImports");
const transform_1 = require("./transform");
// eslint-disable-next-line require-yield
function* emptyHandler() {
    throw new Error(`Handler for ${this.type} is not implemented`);
}
exports.baseProcessingHandlers = {
    collect: (emptyHandler),
    evalFile: (emptyHandler),
    extract: (emptyHandler),
    workflow: (emptyHandler),
    explodeReexports: explodeReexports_1.explodeReexports,
    getExports: getExports_1.getExports,
    processEntrypoint: processEntrypoint_1.processEntrypoint,
    processImports: processImports_1.processImports,
    transform: transform_1.transform,
};
