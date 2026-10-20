/** Thrown for network / HTTP failure. "No match" is NOT an error or (returns null) */
export class GeocodeError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "GeocodeError";
  }
}
