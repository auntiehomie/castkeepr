import type { FeatureFlags, StrictOptions } from '@wyw-in-js/shared';
import type { PluginOptions } from '../../types';
export type PartialOptions = Partial<Omit<PluginOptions, 'features'>> & {
    features?: Partial<FeatureFlags>;
};
export declare function loadWywOptions(overrides?: PartialOptions): StrictOptions;
