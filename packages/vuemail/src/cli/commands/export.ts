import { loadUi } from '../utils/load-ui';

interface Args {
  outDir: string;
  pretty: boolean;
  plainText: boolean;
  dir: string;
  extension?: string;
  silent: boolean;
  vitePlugins?: string;
}

export const exportTemplates = async ({
  outDir,
  pretty,
  plainText,
  dir,
  extension,
  silent,
  vitePlugins,
}: Args) => {
  const ui = await loadUi();
  try {
    await ui.exportTemplates({
      outDir,
      emailsDir: dir,
      pretty,
      plainText,
      extension,
      silent,
      vitePlugins,
    });
  } catch (exception) {
    if (!ui.isReportedError(exception)) console.log(exception);
    process.exit(1);
  }
};
