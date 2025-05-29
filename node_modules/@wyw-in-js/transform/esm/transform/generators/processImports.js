/* eslint-disable no-continue */

/**
 * Creates new entrypoints and emits processEntrypoint for each resolved import
 */
export function* processImports() {
  for (const dependency of this.data.resolved) {
    const {
      resolved,
      only
    } = dependency;
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
//# sourceMappingURL=processImports.js.map