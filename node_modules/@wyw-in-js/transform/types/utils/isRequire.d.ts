import type { NodePath } from '@babel/traverse';
/**
 * Checks that specified Identifier is a global `require`
 * @param id
 */
export declare function isRequire(id: NodePath | null | undefined): boolean;
