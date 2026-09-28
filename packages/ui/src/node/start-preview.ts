import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { styleText } from 'node:util';
import { serveFileFrom } from './http';
import { ReportedError } from './reported-error';

export interface StartPreviewOptions {
  /** Where the built preview is, relative to the current directory. */
  dir?: string;
  port: number;
}

/** Serves a preview built with `email build`. */
export async function startPreview(options: StartPreviewOptions) {
  const directory = path.resolve(process.cwd(), options.dir ?? '.vuemail');
  if (!fs.existsSync(path.join(directory, 'index.html'))) {
    const message = `Could not find ${options.dir ?? '.vuemail'}, maybe you haven't ran email build?`;
    console.error(message);
    throw new ReportedError(message);
  }

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const { pathname } = url;

    // Paths don't end with a slash, as in `/preview/welcome`
    if (pathname !== '/' && pathname.endsWith('/')) {
      response.writeHead(308, {
        Location: `${pathname.replace(/\/+$/, '')}${url.search}`,
      });
      response.end();
      return;
    }

    const candidates =
      pathname === '/' ? ['/index.html'] : [pathname, `${pathname}/index.html`];
    for (const candidate of candidates) {
      if (await serveFileFrom(directory, candidate, response)) return;
    }

    // There's no such email to preview
    if (pathname.startsWith('/preview/')) {
      response.writeHead(307, { Location: '/' });
      response.end();
      return;
    }

    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(
      await fs.promises.readFile(path.join(directory, '404.html'), 'utf8'),
    );
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port, () => {
      server.off('error', reject);
      resolve();
    });
  });
  console.log(
    `${styleText('greenBright', '    Vuemail preview')} running at http://localhost:${options.port}`,
  );

  return {
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
