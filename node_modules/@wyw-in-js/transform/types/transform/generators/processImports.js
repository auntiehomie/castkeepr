"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImports = void 0;
/**
 * Creates new entrypoints and emits processEntrypoint for each resolved import
 */
function* processImports() {
    for (const dependency of this.data.resolved) {
        const { resolved, only } = dependency;
        if (!resolved) {
            continue;
        }
        this.entrypoint.addDependency(dependency);
        const nextEntrypoint = this.entrypoint.createChild(resolved, only);
        if (nextEntrypoint === 'loop' || nextEntrypoint.ignored) {
            continue;
        }
        yield* this.getNext('processEntrypoint', nextEntrypoint, undefined, null);
    }
}
exports.processImports = processImports;
