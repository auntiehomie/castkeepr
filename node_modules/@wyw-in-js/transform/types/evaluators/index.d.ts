/**
 * This file is an entry point for module evaluation for getting lazy dependencies.
 */
import type { Entrypoint } from '../transform/Entrypoint';
import type { Services } from '../transform/types';
export interface IEvaluateResult {
    dependencies: string[];
    value: Record<string | symbol, unknown>;
}
export default function evaluate(services: Services, entrypoint: Entrypoint): IEvaluateResult;
