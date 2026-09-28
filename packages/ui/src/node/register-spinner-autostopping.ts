import type { Spinner } from './spinner';

const spinners = new Set<Spinner>();

process.on('SIGINT', () => {
  for (const spinner of spinners) {
    if (spinner.running) {
      spinner.stop();
    }
  }
});

process.on('exit', (code) => {
  if (code !== 0) {
    for (const spinner of spinners) {
      if (spinner.running) {
        spinner.fail();
      }
    }
  }
});

/**
 * Stops the spinner if the process gets interrupted, and marks it as failed
 * if the process exits with an error while it's still spinning. Returns a
 * function that forgets about the spinner once it's done.
 */
export const registerSpinnerAutostopping = (spinner: Spinner) => {
  spinners.add(spinner);
  return () => {
    spinners.delete(spinner);
  };
};
