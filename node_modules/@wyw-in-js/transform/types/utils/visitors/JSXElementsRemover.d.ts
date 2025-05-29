import type { NodePath } from '@babel/traverse';
import type { CallExpression, JSX } from '@babel/types';
export declare function JSXElementsRemover(path: NodePath<JSX | CallExpression>): void;
