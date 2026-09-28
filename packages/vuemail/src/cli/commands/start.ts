import { loadUi } from '../utils/load-ui';

interface Args {
  dir: string;
  port: string;
}

export const start = async ({ dir, port }: Args) => {
  const ui = await loadUi();
  try {
    await ui.startPreview({ dir, port: Number.parseInt(port, 10) });
  } catch (exception) {
    if (!ui.isReportedError(exception)) console.log(exception);
    process.exit(1);
  }
};
