import type { PluginObj } from '@babel/core';
import type { Core } from '../babel';
import type { IState } from '../utils/collectExportsAndImports';
export interface IShakerOptions {
    ifUnknownExport?: 'error' | 'ignore' | 'reexport-all' | 'skip-shaking';
    keepSideEffects?: boolean;
    onlyExports: string[];
}
export default function shakerPlugin(babel: Core, { keepSideEffects, ifUnknownExport, onlyExports, }: IShakerOptions): PluginObj<IState & {
    filename: string;
}>;
