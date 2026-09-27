import fs from 'node:fs';
import { loadUi } from '../utils/load-ui';
import { packageJson } from '../utils/package-json';

interface Args {
  dir: string;
  outDir: string;
  clients?: string;
}

export const build = async ({ dir, outDir, clients }: Args) => {
  if (!fs.existsSync(dir)) {
    console.error(`Missing ${dir} folder`);
    process.exit(1);
  }

  const ui = await loadUi();
  try {
    await ui.buildPreview({
      emailsDir: dir,
      outDir,
      version: packageJson.version,
      compatibilityClients: clients?.split(','),
    });
  } catch {
    process.exit(1);
  }
};
