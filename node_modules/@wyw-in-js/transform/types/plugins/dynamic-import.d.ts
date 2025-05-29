import type { PluginObj } from '@babel/core';
import type { Core } from '../babel';
/**
 * The plugin that replaces `import()` with `__wyw_dynamic_import` as Node VM does not support dynamic imports yet.
 */
export default function dynamicImport(babel: Core): PluginObj;
