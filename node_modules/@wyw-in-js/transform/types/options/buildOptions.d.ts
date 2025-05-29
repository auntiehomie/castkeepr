/// <reference types="src/options/babel-merge" />
import type { TransformOptions } from '@babel/core';
/**
 * Merges babel configs together. If a pair of configs were merged before,
 * it will return the cached result.
 */
export declare function buildOptions(...configs: (TransformOptions | null | undefined)[]): TransformOptions;
