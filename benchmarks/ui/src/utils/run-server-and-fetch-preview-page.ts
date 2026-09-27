import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPreviewPage } from './fetch-preview-page';

const decoder = new TextDecoder();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Starts the `vuemail dev` preview server and fetches a single preview page from it. */
export function runServerAndFetchPreviewPage(pathToCliScript: string) {
  return new Promise<void>((resolve, reject) => {
    const node = spawn('node', [pathToCliScript, 'dev'], {
      cwd: path.resolve(__dirname, '../../../../apps/demo'),
    });

    node.stdout.on('data', (data) => {
      const content = decoder.decode(data);
      if (content.includes('Running preview at')) {
        const url = /http:\/\/localhost:[\d]+/.exec(content)?.[0];
        if (url) {
          fetchPreviewPage(url)
            .then(() => {
              node.kill();
              resolve();
            })
            .catch(() => {
              node.kill();
              reject();
            });
        } else {
          node.kill();
          reject(
            new Error(
              'URL was non existant in the same line, maybe we changed the way this is displayed?',
              {
                cause: { content, pathToCliScript },
              },
            ),
          );
        }
      }
    });
  });
}
