import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { styleText } from 'node:util';
import logSymbols from 'log-symbols';
import type { PreviewConfig } from '../shared/types';
import { type ApiContext, handleApiRequest } from './api';
import { createEmailLoader } from './email-loader';
import { getEmailPathFromSlug } from './emails-directory';
import { setupHotReload } from './hot-reload';
import { serveFileFrom, serveStaticFile } from './http';
import { loadVitePlugins } from './load-vite-plugins';
import {
  getPreviewAppHtml,
  getWorkspaceId,
  previewAppDirectory,
} from './preview-app';
import { registerSpinnerAutostopping } from './register-spinner-autostopping';
import { createRenderingCache } from './rendering-cache';
import { ReportedError } from './reported-error';
import { createSpinner, stopSpinnerAndPersist } from './spinner';

export interface DevServerOptions {
  /** The directory with the emails, relative to the current directory. */
  emailsDir: string;
  port: number;
  /** The version of vuemail running the server. */
  version: string;
  resendApiKey?: string;
  compatibilityClients?: string[];
  /** A module with more Vite plugins to compile emails with. */
  vitePlugins?: string;
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

/** The preview of the email a path points to, as in `/preview/welcome`. */
const getPreviewSlug = (pathname: string) => {
  try {
    return decodeURIComponent(pathname.slice('/preview/'.length));
  } catch {
    return undefined;
  }
};

/**
 * Starts the preview server: the preview app, the API it talks to, the
 * files in the `static` directory of the emails, and hot reloading.
 *
 * It listens right away, and requests wait for the emails to be ready to
 * render, which takes a moment.
 */
export async function startDevServer(
  options: DevServerOptions,
): Promise<DevServer> {
  const cwd = process.cwd();
  const emailsDirectory = path.resolve(cwd, options.emailsDir);
  const staticDirectory = path.join(emailsDirectory, 'static');

  const config: PreviewConfig = {
    mode: 'development',
    version: options.version,
    emailsDirectoryName: path.basename(emailsDirectory),
    workspaceId: getWorkspaceId(emailsDirectory),
    hasResendApiKey: (options.resendApiKey ?? '').trim().length > 0,
    compatibilityClients: options.compatibilityClients ?? [],
  };

  let resolveContext!: (context: ApiContext) => void;
  const contextReady = new Promise<ApiContext>((resolve) => {
    resolveContext = resolve;
  });

  const sendPreviewApp = async (
    response: http.ServerResponse,
    status: number,
  ) => {
    response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await getPreviewAppHtml(config));
  };

  const server = http.createServer(async (request, response) => {
    // Never cache anything, emails change all the time while developing
    response.setHeader(
      'Cache-Control',
      'no-cache, max-age=0, must-revalidate, no-store',
    );
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '-1');

    try {
      const url = new URL(request.url ?? '/', 'http://localhost');
      const { pathname } = url;

      // The files of the emails don't need the rest of the server
      if (pathname.startsWith('/static/')) {
        await serveStaticFile(response, pathname, staticDirectory);
        return;
      }

      const context = await contextReady;
      if (await handleApiRequest(context, request, response)) return;

      // Paths don't end with a slash, as in `/preview/welcome`
      if (pathname !== '/' && pathname.endsWith('/')) {
        response.writeHead(308, {
          Location: `${pathname.replace(/\/+$/, '')}${url.search}`,
        });
        response.end();
        return;
      }

      if (pathname === '/') {
        await sendPreviewApp(response, 200);
        return;
      }

      if (pathname.startsWith('/preview/')) {
        const slug = getPreviewSlug(pathname);
        if (slug && (await getEmailPathFromSlug(emailsDirectory, slug))) {
          await sendPreviewApp(response, 200);
        } else {
          // There's no such email to preview
          response.writeHead(307, { Location: '/' });
          response.end();
        }
        return;
      }

      if (
        pathname !== '/index.html' &&
        (await serveFileFrom(previewAppDirectory, pathname, response))
      ) {
        return;
      }

      // The preview app tells that there's nothing here
      await sendPreviewApp(response, 404);
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

  const url = `http://localhost:${(server.address() as AddressInfo).port}`;
  console.log(styleText('greenBright', `    Vuemail ${options.version}`));
  console.log(`    Running preview at:          ${url}\n`);

  const spinner = createSpinner({
    text: 'Getting vuemail preview server ready...\n',
    prefixText: ' ',
  });
  spinner.start();
  registerSpinnerAutostopping(spinner);

  server.on('error', (error) => {
    stopSpinnerAndPersist(spinner, {
      symbol: logSymbols.error,
      text: `Preview Server had an error: ${error}`,
    });
    process.exit(1);
  });

  const timeBeforeReady = performance.now();
  let context: ApiContext;
  let renderingCache: ReturnType<typeof createRenderingCache>;
  try {
    const loader = await createEmailLoader(cwd, {
      plugins: options.vitePlugins
        ? await loadVitePlugins(options.vitePlugins)
        : [],
    });
    renderingCache = createRenderingCache(loader);
    context = {
      emailsDirectory,
      loader,
      hotReload: setupHotReload(loader, emailsDirectory),
      resendApiKey: options.resendApiKey,
      renderEmail: renderingCache.render,
    };
  } catch (exception) {
    stopSpinnerAndPersist(spinner, {
      symbol: logSymbols.error,
      text: ` Preview Server had an error: ${exception}`,
    });
    server.close();
    throw new ReportedError(String(exception), { cause: exception });
  }
  resolveContext(context);

  const secondsToReady = ((performance.now() - timeBeforeReady) / 1000).toFixed(
    1,
  );
  stopSpinnerAndPersist(spinner, {
    text: `Ready in ${secondsToReady}s\n`,
    symbol: logSymbols.success,
  });

  return {
    url,
    async close() {
      context.hotReload.close();
      renderingCache.close();
      const closed = new Promise<void>((resolve) =>
        server.close(() => resolve()),
      );
      server.closeAllConnections();
      await closed;
      await context.loader.close();
    },
  };
}
