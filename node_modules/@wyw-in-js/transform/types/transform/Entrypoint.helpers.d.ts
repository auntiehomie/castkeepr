/// <reference types="debug" />
import type { TransformOptions } from '@babel/core';
import type { File } from '@babel/types';
import type { Debugger, EvalRule } from '@wyw-in-js/shared';
import type { Core } from '../babel';
import type { ParentEntrypoint } from '../types';
import type { IEntrypointCode, IIgnoredEntrypoint } from './Entrypoint.types';
import type { Services } from './types';
export declare function getMatchedRule(rules: EvalRule[], filename: string, code: string): EvalRule;
export declare function parseFile(babel: Core, filename: string, originalCode: string, parseConfig: TransformOptions): File;
export declare function loadAndParse(services: Services, name: string, loadedCode: string | undefined, log: Debugger): IEntrypointCode | IIgnoredEntrypoint;
export declare function getStack(entrypoint: ParentEntrypoint): string[];
export declare function mergeOnly(a: string[], b: string[]): string[];
export declare const isSuperSet: <T>(a: (T | "*")[], b: (T | "*")[]) => boolean;
