"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.peek = void 0;
const peek = (stack, offset = 1) => stack[stack.length - offset];
exports.peek = peek;
