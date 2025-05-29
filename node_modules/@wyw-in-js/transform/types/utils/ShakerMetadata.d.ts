export interface IShakerMetadata {
    imports: Map<string, string[]>;
}
export interface IMetadata {
    wywEvaluator: IShakerMetadata;
}
export declare const hasShakerMetadata: (metadata: object | undefined) => metadata is IMetadata;
