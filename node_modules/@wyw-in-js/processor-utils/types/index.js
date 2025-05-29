"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toValidCSSIdentifier = exports.TaggedTemplateProcessor = exports.validateParams = exports.isValidParams = exports.buildSlug = exports.BaseProcessor = void 0;
var BaseProcessor_1 = require("./BaseProcessor");
Object.defineProperty(exports, "BaseProcessor", { enumerable: true, get: function () { return BaseProcessor_1.BaseProcessor; } });
__exportStar(require("./types"), exports);
var buildSlug_1 = require("./utils/buildSlug");
Object.defineProperty(exports, "buildSlug", { enumerable: true, get: function () { return buildSlug_1.buildSlug; } });
var validateParams_1 = require("./utils/validateParams");
Object.defineProperty(exports, "isValidParams", { enumerable: true, get: function () { return validateParams_1.isValidParams; } });
Object.defineProperty(exports, "validateParams", { enumerable: true, get: function () { return validateParams_1.validateParams; } });
var TaggedTemplateProcessor_1 = require("./TaggedTemplateProcessor");
Object.defineProperty(exports, "TaggedTemplateProcessor", { enumerable: true, get: function () { return TaggedTemplateProcessor_1.TaggedTemplateProcessor; } });
var toValidCSSIdentifier_1 = require("./utils/toValidCSSIdentifier");
Object.defineProperty(exports, "toValidCSSIdentifier", { enumerable: true, get: function () { return toValidCSSIdentifier_1.toValidCSSIdentifier; } });
