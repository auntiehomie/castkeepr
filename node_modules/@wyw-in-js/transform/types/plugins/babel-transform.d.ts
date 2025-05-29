import type { PluginObj } from '@babel/core';
import type { Core } from '../babel';
import type { IPluginState, PluginOptions } from '../types';
export default function babelTransform(babel: Core, options: Partial<PluginOptions>): PluginObj<IPluginState>;
