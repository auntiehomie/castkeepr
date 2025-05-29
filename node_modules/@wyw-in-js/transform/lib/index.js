"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  slugify: true,
  createFileReporter: true,
  babelTransformPlugin: true,
  preeval: true,
  getTransformMetadata: true,
  withTransformMetadata: true,
  Module: true,
  DefaultModuleImplementation: true,
  shaker: true,
  transform: true,
  isUnprocessedEntrypointError: true,
  UnprocessedEntrypointError: true,
  EvaluatedEntrypoint: true,
  parseFile: true,
  baseHandlers: true,
  prepareCode: true,
  Entrypoint: true,
  transformUrl: true,
  asyncResolveImports: true,
  syncResolveImports: true,
  loadWywOptions: true,
  withDefaultServices: true,
  EventEmitter: true,
  isNode: true,
  getFileIdx: true,
  applyProcessors: true,
  getVisitorKeys: true,
  peek: true,
  TransformCacheCollection: true,
  findIdentifiers: true
};
Object.defineProperty(exports, "DefaultModuleImplementation", {
  enumerable: true,
  get: function () {
    return _module.DefaultModuleImplementation;
  }
});
Object.defineProperty(exports, "Entrypoint", {
  enumerable: true,
  get: function () {
    return _Entrypoint2.Entrypoint;
  }
});
Object.defineProperty(exports, "EvaluatedEntrypoint", {
  enumerable: true,
  get: function () {
    return _EvaluatedEntrypoint.EvaluatedEntrypoint;
  }
});
Object.defineProperty(exports, "EventEmitter", {
  enumerable: true,
  get: function () {
    return _EventEmitter.EventEmitter;
  }
});
Object.defineProperty(exports, "Module", {
  enumerable: true,
  get: function () {
    return _module.Module;
  }
});
Object.defineProperty(exports, "TransformCacheCollection", {
  enumerable: true,
  get: function () {
    return _cache.TransformCacheCollection;
  }
});
Object.defineProperty(exports, "UnprocessedEntrypointError", {
  enumerable: true,
  get: function () {
    return _UnprocessedEntrypointError.UnprocessedEntrypointError;
  }
});
Object.defineProperty(exports, "applyProcessors", {
  enumerable: true,
  get: function () {
    return _getTagProcessor.applyProcessors;
  }
});
Object.defineProperty(exports, "asyncResolveImports", {
  enumerable: true,
  get: function () {
    return _resolveImports.asyncResolveImports;
  }
});
Object.defineProperty(exports, "babelTransformPlugin", {
  enumerable: true,
  get: function () {
    return _babelTransform.default;
  }
});
Object.defineProperty(exports, "baseHandlers", {
  enumerable: true,
  get: function () {
    return _generators.baseHandlers;
  }
});
Object.defineProperty(exports, "createFileReporter", {
  enumerable: true,
  get: function () {
    return _fileReporter.createFileReporter;
  }
});
Object.defineProperty(exports, "findIdentifiers", {
  enumerable: true,
  get: function () {
    return _findIdentifiers.findIdentifiers;
  }
});
Object.defineProperty(exports, "getFileIdx", {
  enumerable: true,
  get: function () {
    return _getFileIdx.getFileIdx;
  }
});
Object.defineProperty(exports, "getTransformMetadata", {
  enumerable: true,
  get: function () {
    return _TransformMetadata.getTransformMetadata;
  }
});
Object.defineProperty(exports, "getVisitorKeys", {
  enumerable: true,
  get: function () {
    return _getVisitorKeys.getVisitorKeys;
  }
});
Object.defineProperty(exports, "isNode", {
  enumerable: true,
  get: function () {
    return _isNode.isNode;
  }
});
Object.defineProperty(exports, "isUnprocessedEntrypointError", {
  enumerable: true,
  get: function () {
    return _UnprocessedEntrypointError.isUnprocessedEntrypointError;
  }
});
Object.defineProperty(exports, "loadWywOptions", {
  enumerable: true,
  get: function () {
    return _loadWywOptions.loadWywOptions;
  }
});
Object.defineProperty(exports, "parseFile", {
  enumerable: true,
  get: function () {
    return _Entrypoint.parseFile;
  }
});
Object.defineProperty(exports, "peek", {
  enumerable: true,
  get: function () {
    return _peek.peek;
  }
});
Object.defineProperty(exports, "preeval", {
  enumerable: true,
  get: function () {
    return _preeval.default;
  }
});
Object.defineProperty(exports, "prepareCode", {
  enumerable: true,
  get: function () {
    return _transform2.prepareCode;
  }
});
Object.defineProperty(exports, "shaker", {
  enumerable: true,
  get: function () {
    return _shaker.default;
  }
});
Object.defineProperty(exports, "slugify", {
  enumerable: true,
  get: function () {
    return _shared.slugify;
  }
});
Object.defineProperty(exports, "syncResolveImports", {
  enumerable: true,
  get: function () {
    return _resolveImports.syncResolveImports;
  }
});
Object.defineProperty(exports, "transform", {
  enumerable: true,
  get: function () {
    return _transform.transform;
  }
});
Object.defineProperty(exports, "transformUrl", {
  enumerable: true,
  get: function () {
    return _createStylisPreprocessor.transformUrl;
  }
});
Object.defineProperty(exports, "withDefaultServices", {
  enumerable: true,
  get: function () {
    return _withDefaultServices.withDefaultServices;
  }
});
Object.defineProperty(exports, "withTransformMetadata", {
  enumerable: true,
  get: function () {
    return _TransformMetadata.withTransformMetadata;
  }
});
var _shared = require("@wyw-in-js/shared");
var _fileReporter = require("./debug/fileReporter");
var _babelTransform = _interopRequireDefault(require("./plugins/babel-transform"));
var _preeval = _interopRequireDefault(require("./plugins/preeval"));
var _TransformMetadata = require("./utils/TransformMetadata");
var _module = require("./module");
var _shaker = _interopRequireDefault(require("./shaker"));
var _transform = require("./transform");
var _UnprocessedEntrypointError = require("./transform/actions/UnprocessedEntrypointError");
var _types = require("./types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _EvaluatedEntrypoint = require("./transform/EvaluatedEntrypoint");
var _Entrypoint = require("./transform/Entrypoint.helpers");
var _generators = require("./transform/generators");
var _transform2 = require("./transform/generators/transform");
var _Entrypoint2 = require("./transform/Entrypoint");
var _createStylisPreprocessor = require("./transform/generators/createStylisPreprocessor");
var _resolveImports = require("./transform/generators/resolveImports");
var _loadWywOptions = require("./transform/helpers/loadWywOptions");
var _withDefaultServices = require("./transform/helpers/withDefaultServices");
var _EventEmitter = require("./utils/EventEmitter");
var _isNode = require("./utils/isNode");
var _getFileIdx = require("./utils/getFileIdx");
var _getTagProcessor = require("./utils/getTagProcessor");
var _getVisitorKeys = require("./utils/getVisitorKeys");
var _peek = require("./utils/peek");
var _cache = require("./cache");
var _findIdentifiers = require("./utils/findIdentifiers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map