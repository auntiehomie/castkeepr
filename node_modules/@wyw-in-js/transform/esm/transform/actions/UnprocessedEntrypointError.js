export class UnprocessedEntrypointError extends Error {
  constructor(entrypoint) {
    super(`Entrypoint ${entrypoint.idx} is not processed and can't be evaluated`);
    this.entrypoint = entrypoint;
  }
}
export const isUnprocessedEntrypointError = value => value instanceof UnprocessedEntrypointError;
//# sourceMappingURL=UnprocessedEntrypointError.js.map