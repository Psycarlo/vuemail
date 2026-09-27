import type { ErrorObject } from '../../shared/types';

/** Turns anything thrown into what the error overlay shows. */
export const toErrorObject = (error: unknown): ErrorObject => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause === undefined ? undefined : toErrorObject(error.cause),
    };
  }
  return { name: 'Error', message: String(error), stack: undefined };
};
