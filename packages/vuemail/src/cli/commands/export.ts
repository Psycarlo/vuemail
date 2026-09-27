import { loadUi } from '../utils/load-ui';

interface Args {
  outDir: string;
  pretty: boolean;
  plainText: boolean;
  dir: string;
  extension?: string;
  silent: boolean;
}

export const exportTemplates = async ({
  outDir,
  pretty,
  plainText,
  dir,
  extension,
  silent,
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
    });
  } catch (exception) {
    if (silent) console.error(exception);
    process.exit(1);
  }
};
