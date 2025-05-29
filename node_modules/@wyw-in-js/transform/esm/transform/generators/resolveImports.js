/* eslint-disable no-continue,no-await-in-loop,require-yield */
import { getFileIdx } from '../../utils/getFileIdx';
import { getStack, isSuperSet, mergeOnly } from '../Entrypoint.helpers';
function emitDependency(emitter, entrypoint, imports) {
  emitter.single({
    type: 'dependency',
    file: entrypoint.name,
    only: entrypoint.only,
    imports: imports.map(({
      resolved,
      only
    }) => ({
      from: resolved,
      what: only
    })),
    fileIdx: getFileIdx(entrypoint.name)
  });
}
function filterUnresolved(entrypoint, resolvedImports) {
  return resolvedImports.filter(i => {
    if (i.resolved === null) {
      entrypoint.log(`[resolve] ✅ %s in %s is ignored`, i.source, entrypoint.name);
      return false;
    }
    return true;
  });
}

/**
 * Synchronously resolves specified imports with a provided resolver.
 */
export function* syncResolveImports(resolve) {
  const {
    data: {
      imports
    },
    entrypoint,
    services: {
      eventEmitter
    }
  } = this;
  const listOfImports = Array.from(imports?.entries() ?? []);
  const {
    log
  } = entrypoint;
  if (listOfImports.length === 0) {
    emitDependency(eventEmitter, entrypoint, []);
    log('%s has no imports', entrypoint.name);
    return [];
  }
  const resolvedImports = listOfImports.map(([source, only]) => {
    let resolved = null;
    try {
      resolved = resolve(source, entrypoint.name, getStack(entrypoint));
      log('[sync-resolve] ✅ %s -> %s (only: %o)', source, resolved, only);
    } catch (err) {
      log('[sync-resolve] ❌ cannot resolve %s: %O', source, err);
    }
    return {
      source,
      only,
      resolved
    };
  });
  const filteredImports = filterUnresolved(entrypoint, resolvedImports);
  emitDependency(eventEmitter, entrypoint, filteredImports);
  return filteredImports;
}

/**
 * Asynchronously resolves specified imports with a provided resolver.
 */
export async function* asyncResolveImports(resolve) {
  const {
    data: {
      imports
    },
    entrypoint,
    services: {
      eventEmitter
    }
  } = this;
  const listOfImports = Array.from(imports?.entries() ?? []);
  const {
    log
  } = entrypoint;
  if (listOfImports.length === 0) {
    emitDependency(eventEmitter, entrypoint, []);
    log('%s has no imports', entrypoint.name);
    return [];
  }
  log('resolving %d imports', listOfImports.length);
  const getResolveTask = async (source, only) => {
    let resolved = null;
    try {
      resolved = await resolve(source, entrypoint.name, getStack(entrypoint));
    } catch (err) {
      log('[async-resolve] ❌ cannot resolve %s in %s: %O', source, entrypoint.name, err);
    }
    if (resolved !== null) {
      log('[async-resolve] ✅ %s (%o) in %s -> %s', source, only, entrypoint.name, resolved);
    }
    return {
      source,
      only,
      resolved
    };
  };
  const resolvedImports = await Promise.all(listOfImports.map(([source, importsOnly]) => {
    const cached = entrypoint.getDependency(source);
    if (cached) {
      return {
        source,
        only: mergeOnly(cached.only, importsOnly),
        resolved: cached.resolved
      };
    }
    const task = entrypoint.getResolveTask(source);
    if (task) {
      // If we have cached task, we need to merge only…
      const newTask = task.then(res => {
        if (isSuperSet(res.only, importsOnly)) {
          return res;
        }

        // Is this branch even possible?
        const merged = mergeOnly(res.only, importsOnly);
        log('merging imports %o and %o: %o', importsOnly, res.only, merged);
        return {
          ...res,
          only: merged
        };
      });

      // … and update the cache
      entrypoint.addResolveTask(source, newTask);
      return newTask;
    }
    const resolveTask = getResolveTask(source, importsOnly);
    entrypoint.addResolveTask(source, resolveTask);
    return resolveTask;
  }));
  log('resolved %d imports', resolvedImports.length);
  const filteredImports = filterUnresolved(entrypoint, resolvedImports);
  emitDependency(eventEmitter, entrypoint, filteredImports);
  return filteredImports;
}
//# sourceMappingURL=resolveImports.js.map