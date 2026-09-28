import path from 'node:path';
import { type PluginOption, runnerImport } from 'vite';

type PluginsModuleExport =
  | PluginOption[]
  | (() => PluginOption[] | Promise<PluginOption[]>);

/**
 * Loads the Vite plugins a user wants applied when their emails are
 * compiled, from `--vite-plugins`. The module's default export is either an
 * array of plugins or a function returning one, so plugins that need setup
 * can do it lazily. It can be written in TypeScript.
 */
export const loadVitePlugins = async (
  modulePath: string,
): Promise<PluginOption[]> => {
  const absolutePath = path.resolve(process.cwd(), modulePath);
  const { module } = await runnerImport<{ default?: PluginsModuleExport }>(
    absolutePath,
    { configFile: false, logLevel: 'silent' },
  );
  const exported = module.default;
  const plugins = typeof exported === 'function' ? await exported() : exported;
  if (!Array.isArray(plugins)) {
    throw new Error(
      `Expected the default export of ${absolutePath} to be an array of Vite plugins or a function returning one`,
    );
  }
  return plugins;
};
