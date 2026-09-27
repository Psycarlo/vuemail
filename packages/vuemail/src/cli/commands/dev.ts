import fs from 'node:fs';
import { conf } from '../utils/conf';
import { loadUi } from '../utils/load-ui';
import { packageJson } from '../utils/package-json';

interface Args {
  dir: string;
  port: string;
  clients?: string;
}

export const dev = async ({ dir, port, clients }: Args) => {
  if (!fs.existsSync(dir)) {
    console.error(`Missing ${dir} folder`);
    process.exit(1);
  }

  const ui = await loadUi();
  const server = await ui.startDevServer({
    emailsDir: dir,
    port: Number.parseInt(port, 10),
    version: packageJson.version,
    resendApiKey: conf.get('resendApiKey'),
    compatibilityClients: clients?.split(','),
  });

  const shutdown = () => {
    console.log('\nshutting down dev server');
    void server.close().finally(() => process.exit(0));
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
};
