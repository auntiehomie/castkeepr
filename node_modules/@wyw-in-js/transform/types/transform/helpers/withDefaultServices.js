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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDefaultServices = void 0;
const babelCore = __importStar(require("@babel/core"));
const cache_1 = require("../../cache");
const EventEmitter_1 = require("../../utils/EventEmitter");
const Entrypoint_helpers_1 = require("../Entrypoint.helpers");
const rootLog_1 = require("../rootLog");
const withDefaultServices = ({ babel = babelCore, cache = new cache_1.TransformCacheCollection(), eventEmitter = EventEmitter_1.EventEmitter.dummy, loadAndParseFn = Entrypoint_helpers_1.loadAndParse, log = rootLog_1.rootLog, options, }) => ({
    babel,
    cache,
    eventEmitter,
    loadAndParseFn,
    log,
    options,
});
exports.withDefaultServices = withDefaultServices;
