import fs from 'node:fs';
import logSymbols from 'log-symbols';
import { conf } from '../utils/conf';
import { loadUi } from '../utils/load-ui';
import { packageJson } from '../utils/package-json';

interface Args {
  dir: string;
  port: string;
  clients?: string;
  vitePlugins?: string;
}

export const dev = async ({ dir, port, clients, vitePlugins }: Args) => {
  if (!fs.existsSync(dir)) {
    console.error(`Missing ${dir} folder`);
    process.exit(1);
  }

  const [major = 0, minor = 0] = process.versions.node.split('.').map(Number);
  if (major < 20 || (major === 20 && minor < 19)) {
    console.error(
      ` ${logSymbols.error}  Node ${process.versions.node} is not supported. Please upgrade to Node 20.19 or higher.`,
    );
    process.exit(1);
  }

  const ui = await loadUi();
  let server: Awaited<ReturnType<typeof ui.startDevServer>>;
  try {
    server = await ui.startDevServer({
      emailsDir: dir,
      port: Number.parseInt(port, 10),
      version: packageJson.version,
      resendApiKey: conf.get('resendApiKey'),
      compatibilityClients: (
        clients ?? process.env.COMPATIBILITY_EMAIL_CLIENTS
      )?.split(','),
      vitePlugins,
    });
  } catch (exception) {
    if (!ui.isReportedError(exception)) console.log(exception);
    process.exit(1);
  }

  const shutdown = () => {
    console.log('\nshutting down dev server');
    void server.close().finally(() => process.exit(0));
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
};
