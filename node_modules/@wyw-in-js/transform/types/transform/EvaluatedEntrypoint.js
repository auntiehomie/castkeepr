"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluatedEntrypoint = void 0;
const BaseEntrypoint_1 = require("./BaseEntrypoint");
class EvaluatedEntrypoint extends BaseEntrypoint_1.BaseEntrypoint {
    evaluated = true;
    ignored = false;
}
exports.EvaluatedEntrypoint = EvaluatedEntrypoint;
