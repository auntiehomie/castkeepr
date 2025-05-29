import { explodeReexports } from './explodeReexports';
import { getExports } from './getExports';
import { processEntrypoint } from './processEntrypoint';
import { processImports } from './processImports';
import { transform } from './transform';

// eslint-disable-next-line require-yield
function* emptyHandler() {
  throw new Error(`Handler for ${this.type} is not implemented`);
}
export const baseProcessingHandlers = {
  collect: emptyHandler,
  evalFile: emptyHandler,
  extract: emptyHandler,
  workflow: emptyHandler,
  explodeReexports,
  getExports,
  processEntrypoint,
  processImports,
  transform
};
//# sourceMappingURL=baseProcessingHandlers.js.map