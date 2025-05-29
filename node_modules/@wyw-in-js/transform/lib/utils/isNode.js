"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNode = void 0;
const isNode = obj => typeof obj === 'object' && obj !== null && (obj === null || obj === void 0 ? void 0 : obj.type) !== undefined;
exports.isNode = isNode;
//# sourceMappingURL=isNode.js.map