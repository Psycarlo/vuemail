import { loadUi } from '../utils/load-ui';
import { packageJson } from '../utils/package-json';

interface Args {
  dir: string;
  outDir: string;
  clients?: string;
  vitePlugins?: string;
}

export const build = async ({ dir, outDir, clients, vitePlugins }: Args) => {
  const ui = await loadUi();
  try {
    await ui.buildPreview({
      emailsDir: dir,
      outDir,
      version: packageJson.version,
      compatibilityClients: (
        clients ?? process.env.COMPATIBILITY_EMAIL_CLIENTS
      )?.split(','),
      vitePlugins,
    });
  } catch (exception) {
    if (!ui.isReportedError(exception)) console.log(exception);
    process.exit(1);
  }
};
