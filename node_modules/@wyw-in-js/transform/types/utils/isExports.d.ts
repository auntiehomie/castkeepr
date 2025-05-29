import type { NodePath } from '@babel/traverse';
/**
 * Checks that specified Identifier is a global `exports` or `module.exports`
 * @param node
 */
export declare function isExports(node: NodePath | null | undefined): boolean;
