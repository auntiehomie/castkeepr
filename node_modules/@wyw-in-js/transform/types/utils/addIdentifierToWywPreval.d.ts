import type { NodePath, Scope } from '@babel/traverse';
import type { ObjectExpression } from '@babel/types';
export declare function getOrAddWywPreval(scope: Scope): NodePath<ObjectExpression>;
export declare function addIdentifierToWywPreval(scope: Scope, name: string): void;
