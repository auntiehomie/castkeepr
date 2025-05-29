import * as babelCore from '@babel/core';
import { TransformCacheCollection } from '../../cache';
import { EventEmitter } from '../../utils/EventEmitter';
import { loadAndParse } from '../Entrypoint.helpers';
import { rootLog } from '../rootLog';
export const withDefaultServices = ({
  babel = babelCore,
  cache = new TransformCacheCollection(),
  eventEmitter = EventEmitter.dummy,
  loadAndParseFn = loadAndParse,
  log = rootLog,
  options
}) => ({
  babel,
  cache,
  eventEmitter,
  loadAndParseFn,
  log,
  options
});
//# sourceMappingURL=withDefaultServices.js.map