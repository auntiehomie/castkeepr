import { buildOptions } from '../../options/buildOptions';
import { getTransformMetadata } from '../../utils/TransformMetadata';
import { getPluginKey } from '../../utils/getPluginKey';
const EMPTY_FILE = '=== empty file ===';
const hasKeyInList = (plugin, list) => {
  const pluginKey = getPluginKey(plugin);
  return pluginKey ? list.some(i => pluginKey.includes(i)) : false;
};
function runPreevalStage(babel, evalConfig, pluginOptions, code, originalAst, eventEmitter) {
  const preShakePlugins = evalConfig.plugins?.filter(i => hasKeyInList(i, pluginOptions.highPriorityPlugins)) ?? [];
  const plugins = [...preShakePlugins, [require.resolve('../../plugins/preeval'), {
    ...pluginOptions,
    eventEmitter
  }], [require.resolve('../../plugins/dynamic-import')], ...(evalConfig.plugins ?? []).filter(i => !hasKeyInList(i, pluginOptions.highPriorityPlugins))];
  const transformConfig = buildOptions({
    ...evalConfig,
    envName: 'wyw-in-js',
    plugins
  });
  const result = babel.transformFromAstSync(originalAst, code, transformConfig);
  if (!result || !result.ast?.program) {
    throw new Error('Babel transform failed');
  }
  return result;
}
export const prepareCode = (services, item, originalAst) => {
  const {
    log,
    only,
    loadedAndParsed
  } = item;
  if (loadedAndParsed.evaluator === 'ignored') {
    log('is ignored');
    return [loadedAndParsed.code ?? '', null, null];
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
  const transformMetadata = getTransformMetadata(preevalStageResult.metadata);
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
  return [transformedCode, imports, transformMetadata ?? null];
};
export function* internalTransform(prepareFn) {
  const {
    only,
    loadedAndParsed,
    log
  } = this.entrypoint;
  if (loadedAndParsed.evaluator === 'ignored') {
    log('is ignored');
    return {
      code: loadedAndParsed.code ?? '',
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
    log('is skipped');
    return {
      code: loadedAndParsed.code ?? '',
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
export function transform() {
  return internalTransform.call(this, prepareCode);
}
//# sourceMappingURL=transform.js.map