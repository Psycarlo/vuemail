import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { addDevDependency } from 'nypm';
import prompts from 'prompts';
import { packageJson } from './package-json';
import type { Ui } from './ui';

const installUi = async (message: string): Promise<never> => {
  const { install } = await prompts({
    type: 'confirm',
    name: 'install',
    message,
    initial: true,
  });
  if (install) {
    console.log('Installing "@vuemaildev/ui"');
    await addDevDependency(`@vuemaildev/ui@${packageJson.version}`);
  }
  process.exit(0);
};

/**
 * Loads the preview app from the project, where it has to be installed in
 * the same version as vuemail itself.
 */
export async function loadUi(): Promise<Ui> {
  let uiPath: string;
  try {
    uiPath = createRequire(path.join(process.cwd(), 'package.json')).resolve(
      '@vuemaildev/ui',
    );
  } catch {
    return installUi(
      'To run the preview server, the package "@vuemaildev/ui" must be installed. Would you like to install it?',
    );
  }

  const ui = (await import(pathToFileURL(uiPath).href)) as Ui;
  if (ui.version !== packageJson.version) {
    return installUi(
      `To run the preview server, the version of "@vuemaildev/ui" must match the version of "@vuemaildev/vuemail" (${packageJson.version}). Would you like to install it?`,
    );
  }
  return ui;
}
