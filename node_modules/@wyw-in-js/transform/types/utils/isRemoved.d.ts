import type { NodePath } from '@babel/traverse';
/**
 * Checks if a given path has been removed from the AST.
 */
export declare function isRemoved(path: NodePath): boolean;
