import { collect } from './collect';
import { evalFile } from './evalFile';
import { extract } from './extract';
import { workflow } from './workflow';
export declare const baseHandlers: {
    collect: typeof collect;
    evalFile: typeof evalFile;
    extract: typeof extract;
    workflow: typeof workflow;
    explodeReexports: typeof import("./explodeReexports").explodeReexports;
    getExports: typeof import("./getExports").getExports;
    processEntrypoint: typeof import("./processEntrypoint").processEntrypoint;
    processImports: typeof import("./processImports").processImports;
    transform: typeof import("./transform").transform;
};
