import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { styleText } from 'node:util';
import { serveFileFrom } from './http';

export interface StartPreviewOptions {
  /** Where the built preview is, relative to the current directory. */
  dir?: string;
  port: number;
}

/** Serves a preview built with `email build`. */
export async function startPreview(options: StartPreviewOptions) {
  const directory = path.resolve(process.cwd(), options.dir ?? '.vuemail');
  if (!fs.existsSync(path.join(directory, 'index.html'))) {
    throw new Error(
      "Could not find .vuemail, maybe you haven't ran email build?",
    );
  }

  const server = http.createServer(async (request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    const candidates = pathname.endsWith('/')
      ? [`${pathname}index.html`]
      : [pathname, `${pathname}/index.html`];

    for (const candidate of candidates) {
      if (await serveFileFrom(directory, candidate, response)) return;
    }

    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(
      await fs.promises.readFile(path.join(directory, '404.html'), 'utf8'),
    );
  });

  await new Promise<void>((resolve) => server.listen(options.port, resolve));
  console.log(
    `${styleText('greenBright', '    Vuemail preview')} running at http://localhost:${options.port}`,
  );

  return {
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
