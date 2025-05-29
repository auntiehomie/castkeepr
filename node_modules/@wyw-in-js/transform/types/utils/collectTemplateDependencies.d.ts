import type { NodePath } from '@babel/traverse';
import type { Expression, TaggedTemplateExpression, TemplateElement } from '@babel/types';
import type { ExpressionValue } from '@wyw-in-js/shared';
import type { IImport } from './collectExportsAndImports';
/**
 * Only an expression that can be evaluated in the root scope can be
 * used in a WYW template. This function tries to hoist the expression.
 * @param ex The expression to hoist.
 * @param evaluate If true, we try to statically evaluate the expression.
 * @param imports All the imports of the file.
 */
export declare function extractExpression(ex: NodePath<Expression>, evaluate?: boolean, imports?: IImport[]): Omit<ExpressionValue, 'buildCodeFrameError' | 'source'>;
/**
 * Collects, hoists, and makes lazy all expressions in the given template
 * If evaluate is true, it will try to evaluate the expressions
 */
export declare function collectTemplateDependencies(path: NodePath<TaggedTemplateExpression>, evaluate?: boolean): [quasis: TemplateElement[], expressionValues: ExpressionValue[]];
