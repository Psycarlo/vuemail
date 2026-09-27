import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const decoder = new TextDecoder();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface Server {
  subprocess: ChildProcessWithoutNullStreams;
  url: string;
}

/** Starts the `vuemail dev` preview server against the demo app's emails. */
export function runServer(pathToCliScript: string) {
  return new Promise<Server>((resolve, reject) => {
    const node = spawn('node', [pathToCliScript, 'dev'], {
      cwd: path.resolve(__dirname, '../../../../apps/demo'),
    });

    node.on('exit', (code) => {
      reject(new Error(`The preview server exited with code ${code}`));
    });

    node.stdout.on('data', (data) => {
      const content = decoder.decode(data);
      if (content.includes('Running preview at')) {
        const url = /http:\/\/localhost:[\d]+/.exec(content)?.[0];
        if (url) {
          resolve({
            subprocess: node,
            url,
          });
        } else {
          node.kill();
          reject(
            new Error(
              "The URL wasn't on the same line, maybe the way it's displayed changed?",
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
