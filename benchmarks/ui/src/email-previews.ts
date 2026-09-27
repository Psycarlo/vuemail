import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Bench } from 'tinybench';
import { fetchPreviewPage } from './utils/fetch-preview-page';
import { runServer } from './utils/run-server';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pathToLocalCliScript = path.resolve(
  __dirname,
  '../../../packages/vuemail/dist/cli/index.mjs',
);

(async () => {
  const bench = new Bench({
    iterations: 30,
  });

  const server = await runServer(pathToLocalCliScript);
  bench.add('hot email previews', async () => {
    await fetchPreviewPage(server.url);
  });

  await fetchPreviewPage(server.url);
  await bench.run();
  server.subprocess.kill();

  console.table(bench.table());
})();
