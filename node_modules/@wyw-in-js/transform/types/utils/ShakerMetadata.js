"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasShakerMetadata = void 0;
const hasShakerMetadata = (metadata) => metadata !== undefined && 'wywEvaluator' in metadata;
exports.hasShakerMetadata = hasShakerMetadata;
