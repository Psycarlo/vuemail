import http from 'node:http';
import path from 'node:path';
import { styleText } from 'node:util';
import logSymbols from 'log-symbols';
import type { PreviewConfig } from '../shared/types';
import { handleApiRequest } from './api';
import { createEmailLoader } from './email-loader';
import { setupHotReload } from './hot-reload';
import { serveFileFrom } from './http';
import {
  getPreviewAppHtml,
  getWorkspaceId,
  previewAppDirectory,
} from './preview-app';

export interface DevServerOptions {
  /** The directory with the emails, relative to the current directory. */
  emailsDir: string;
  port: number;
  /** The version of vuemail running the server. */
  version: string;
  resendApiKey?: string;
  compatibilityClients?: string[];
}

export interface DevServer {
  url: string;
  close(): Promise<void>;
}

const listen = (server: http.Server, port: number) =>
  new Promise<boolean>((resolve, reject) => {
    const onError = (error: NodeJS.ErrnoException) => {
      server.off('listening', onListening);
      if (error.code === 'EADDRINUSE') resolve(false);
      else reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve(true);
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen(port);
  });

/**
 * Starts the preview server: the preview app, the API it talks to, the
 * files in the `static` directory of the emails, and hot reloading.
 */
export async function startDevServer(
  options: DevServerOptions,
): Promise<DevServer> {
  const cwd = process.cwd();
  const emailsDirectory = path.resolve(cwd, options.emailsDir);
  const staticDirectory = path.join(emailsDirectory, 'static');

  const loader = await createEmailLoader(cwd);
  const hotReload = setupHotReload(loader, emailsDirectory);

  const config: PreviewConfig = {
    mode: 'development',
    version: options.version,
    emailsDirectoryName: path.basename(emailsDirectory),
    workspaceId: getWorkspaceId(emailsDirectory),
    hasResendApiKey: (options.resendApiKey ?? '').trim().length > 0,
    compatibilityClients: options.compatibilityClients ?? [],
  };

  const server = http.createServer(async (request, response) => {
    // Never cache anything, emails change all the time while developing
    response.setHeader(
      'Cache-Control',
      'no-cache, max-age=0, must-revalidate, no-store',
    );

    try {
      if (
        await handleApiRequest(
          {
            emailsDirectory,
            loader,
            hotReload,
            resendApiKey: options.resendApiKey,
          },
          request,
          response,
        )
      ) {
        return;
      }

      const { pathname } = new URL(request.url ?? '/', 'http://localhost');
      if (pathname.startsWith('/static/')) {
        const served = await serveFileFrom(
          staticDirectory,
          pathname.slice('/static/'.length),
          response,
        );
        if (!served) {
          response.writeHead(404);
          response.end();
        }
        return;
      }

      if (
        pathname !== '/' &&
        !pathname.startsWith('/preview') &&
        (await serveFileFrom(previewAppDirectory, pathname, response))
      ) {
        return;
      }

      // Every other route belongs to the preview app
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(await getPreviewAppHtml(config));
    } catch (exception) {
      console.error(exception);
      if (!response.headersSent) response.writeHead(500);
      response.end();
    }
  });

  let port = options.port;
  while (!(await listen(server, port))) {
    console.warn(
      ` ${logSymbols.warning} Port ${port} is already in use, trying ${port + 1}`,
    );
    port += 1;
  }

  const url = `http://localhost:${port}`;
  console.log(styleText('greenBright', `    Vuemail ${options.version}`));
  console.log(`    Running preview at:          ${url}\n`);

  return {
    url,
    async close() {
      hotReload.close();
      const closed = new Promise<void>((resolve) =>
        server.close(() => resolve()),
      );
      server.closeAllConnections();
      await closed;
      await loader.close();
    },
  };
}
