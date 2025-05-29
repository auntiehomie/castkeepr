import type { Services } from '../types';
type RequiredServices = 'options';
export type PartialServices = Partial<Omit<Services, RequiredServices>> & Pick<Services, RequiredServices>;
export declare const withDefaultServices: ({ babel, cache, eventEmitter, loadAndParseFn, log, options, }: PartialServices) => Services;
export {};
