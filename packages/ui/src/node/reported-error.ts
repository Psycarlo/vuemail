/**
 * A failure the user has been told about already, as in `✖ Failed to build
 * emails`, so the CLI only has to exit with an error code.
 */
export class ReportedError extends Error {
  override name = 'ReportedError';
}

export const isReportedError = (error: unknown) =>
  error instanceof ReportedError;
