export class AbortError extends Error {
  constructor(reason) {
    super(reason);
    this.name = 'AbortError';
  }
}
export const isAborted = value => value instanceof AbortError;
//# sourceMappingURL=AbortError.js.map