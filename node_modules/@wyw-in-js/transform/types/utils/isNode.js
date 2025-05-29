"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNode = void 0;
const isNode = (obj) => typeof obj === 'object' &&
    obj !== null &&
    obj?.type !== undefined;
exports.isNode = isNode;
