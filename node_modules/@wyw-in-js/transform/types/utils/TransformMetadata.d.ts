import type { Artifact, Replacement, Rules } from '@wyw-in-js/shared';
export type WYWTransformMetadata = {
    dependencies: string[];
    processors: {
        artifacts: Artifact[];
    }[];
    replacements: Replacement[];
    rules: Rules;
};
export declare const withTransformMetadata: (value: unknown) => value is {
    wywInJS: WYWTransformMetadata;
};
export declare const getTransformMetadata: (value: unknown) => WYWTransformMetadata | undefined;
