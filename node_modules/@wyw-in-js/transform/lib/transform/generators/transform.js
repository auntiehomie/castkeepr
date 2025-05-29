"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internalTransform = internalTransform;
exports.prepareCode = void 0;
exports.transform = transform;
var _buildOptions = require("../../options/buildOptions");
var _TransformMetadata = require("../../utils/TransformMetadata");
var _getPluginKey = require("../../utils/getPluginKey");
const EMPTY_FILE = '=== empty file ===';
const hasKeyInList = (plugin, list) => {
  const pluginKey = (0, _getPluginKey.getPluginKey)(plugin);
  return pluginKey ? list.some(i => pluginKey.includes(i)) : false;
};
function runPreevalStage(babel, evalConfig, pluginOptions, code, originalAst, eventEmitter) {
  var _evalConfig$plugins$f, _evalConfig$plugins, _evalConfig$plugins2, _result$ast;
  const preShakePlugins = (_evalConfig$plugins$f = (_evalConfig$plugins = evalConfig.plugins) === null || _evalConfig$plugins === void 0 ? void 0 : _evalConfig$plugins.filter(i => hasKeyInList(i, pluginOptions.highPriorityPlugins))) !== null && _evalConfig$plugins$f !== void 0 ? _evalConfig$plugins$f : [];
  const plugins = [...preShakePlugins, [require.resolve('../../plugins/preeval'), {
    ...pluginOptions,
    eventEmitter
  }], [require.resolve('../../plugins/dynamic-import')], ...((_evalConfig$plugins2 = evalConfig.plugins) !== null && _evalConfig$plugins2 !== void 0 ? _evalConfig$plugins2 : []).filter(i => !hasKeyInList(i, pluginOptions.highPriorityPlugins))];
  const transformConfig = (0, _buildOptions.buildOptions)({
    ...evalConfig,
    envName: 'wyw-in-js',
    plugins
  });
  const result = babel.transformFromAstSync(originalAst, code, transformConfig);
  if (!result || !((_result$ast = result.ast) !== null && _result$ast !== void 0 && _result$ast.program)) {
    throw new Error('Babel transform failed');
  }
  return result;
}
const prepareCode = (services, item, originalAst) => {
  const {
    log,
    only,
    loadedAndParsed
  } = item;
  if (loadedAndParsed.evaluator === 'ignored') {
    var _loadedAndParsed$code;
    log('is ignored');
    return [(_loadedAndParsed$code = loadedAndParsed.code) !== null && _loadedAndParsed$code !== void 0 ? _loadedAndParsed$code : '', null, null];
  }
  const {
    code,
    evalConfig,
    evaluator
  } = loadedAndParsed;
  const {
    options,
    babel,
    eventEmitter
  } = services;
  const {
    pluginOptions
  } = options;
  const preevalStageResult = eventEmitter.perf('transform:preeval', () => runPreevalStage(babel, evalConfig, pluginOptions, code, originalAst, eventEmitter));
  const transformMetadata = (0, _TransformMetadata.getTransformMetadata)(preevalStageResult.metadata);
  if (only.length === 1 && only[0] === '__wywPreval' && !transformMetadata) {
    log('[evaluator:end] no metadata');
    return [preevalStageResult.code, null, null];
  }
  log('[preeval] metadata %O', transformMetadata);
  log('[evaluator:start] using %s', evaluator.name);
  log.extend('source')('%s', preevalStageResult.code);
  const evaluatorConfig = {
    onlyExports: only,
    highPriorityPlugins: pluginOptions.highPriorityPlugins,
    features: pluginOptions.features
  };
  const [, transformedCode, imports] = eventEmitter.perf('transform:evaluator', () => evaluator(evalConfig, preevalStageResult.ast, preevalStageResult.code, evaluatorConfig, babel));
  log('[evaluator:end]');
  return [transformedCode, imports, transformMetadata !== null && transformMetadata !== void 0 ? transformMetadata : null];
};
exports.prepareCode = prepareCode;
function* internalTransform(prepareFn) {
  const {
    only,
    loadedAndParsed,
    log
  } = this.entrypoint;
  if (loadedAndParsed.evaluator === 'ignored') {
    var _loadedAndParsed$code2;
    log('is ignored');
    return {
      code: (_loadedAndParsed$code2 = loadedAndParsed.code) !== null && _loadedAndParsed$code2 !== void 0 ? _loadedAndParsed$code2 : '',
      metadata: null
    };
  }
  log('>> (%o)', only);
  const [preparedCode, imports, metadata] = prepareFn(this.services, this.entrypoint, loadedAndParsed.ast);
  if (loadedAndParsed.code === preparedCode) {
    log('<< (%o)\n === no changes ===', only);
  } else {
    log('<< (%o)', only);
    log.extend('source')('%s', preparedCode || EMPTY_FILE);
  }
  if (preparedCode === '') {
    var _loadedAndParsed$code3;
    log('is skipped');
    return {
      code: (_loadedAndParsed$code3 = loadedAndParsed.code) !== null && _loadedAndParsed$code3 !== void 0 ? _loadedAndParsed$code3 : '',
      metadata: null
    };
  }
  if (imports !== null && imports.size > 0) {
    const resolvedImports = yield* this.getNext('resolveImports', this.entrypoint, {
      imports
    });
    if (resolvedImports.length !== 0) {
      yield ['processImports', this.entrypoint, {
        resolved: resolvedImports
      }];
    }
  }
  return {
    code: preparedCode,
    metadata
  };
}

/**
 * Prepares the code for evaluation. This includes removing dead and potentially unsafe code.
 * Emits resolveImports and processImports events.
 */
function transform() {
  return internalTransform.call(this, prepareCode);
}
//# sourceMappingURL=transform.js.map