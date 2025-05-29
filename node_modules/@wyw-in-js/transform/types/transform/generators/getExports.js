"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExports = exports.findExportsInImports = void 0;
const collectExportsAndImports_1 = require("../../utils/collectExportsAndImports");
function findExportsInImports(entrypoint, imports) {
    const results = [];
    for (const imp of imports) {
        const { resolved } = imp;
        if (!resolved) {
            throw new Error(`Could not resolve import ${imp.source}`);
        }
        const newEntrypoint = entrypoint.createChild(resolved, []);
        if (newEntrypoint === 'loop') {
            // eslint-disable-next-line no-continue
            continue;
        }
        results.push({
            entrypoint: newEntrypoint,
            import: imp.source,
        });
    }
    return results;
}
exports.findExportsInImports = findExportsInImports;
function* getExports() {
    const { entrypoint, services: { cache }, } = this;
    const { loadedAndParsed } = entrypoint;
    if (loadedAndParsed.ast === undefined) {
        return [];
    }
    entrypoint.log(`get exports from %s`, entrypoint.name);
    if (cache.has('exports', entrypoint.name)) {
        return cache.get('exports', entrypoint.name);
    }
    let withWildcardReexport = [];
    const result = [];
    this.services.babel.traverse(loadedAndParsed.ast, {
        Program(path) {
            const { exports, reexports } = (0, collectExportsAndImports_1.collectExportsAndImports)(path, 'disabled');
            Object.keys(exports).forEach((token) => {
                result.push(token);
            });
            reexports.forEach((e) => {
                if (e.exported !== '*') {
                    result.push(e.exported);
                }
            });
            withWildcardReexport = reexports.filter((e) => e.exported === '*');
        },
    });
    if (withWildcardReexport.length) {
        const resolvedImports = yield* this.getNext('resolveImports', entrypoint, {
            imports: new Map(withWildcardReexport.map((i) => [i.source, []])),
        });
        const importedEntrypoints = findExportsInImports(entrypoint, resolvedImports);
        for (const importedEntrypoint of importedEntrypoints) {
            const exports = yield* this.getNext('getExports', importedEntrypoint.entrypoint, undefined);
            result.push(...exports);
        }
    }
    entrypoint.log(`exports: %o`, result);
    cache.add('exports', entrypoint.name, result);
    return result;
}
exports.getExports = getExports;
