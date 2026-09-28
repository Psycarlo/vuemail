import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import logSymbols from 'log-symbols';
import type { PluginOption } from 'vite';
import type {
  EmailsDirectory,
  ErrorObject,
  PreviewConfig,
  SpamCheckingResult,
  ToolbarData,
} from '../shared/types';
import { renderEmailBySlug } from './api';
import { createEmailLoader } from './email-loader';
import { checkCompatibility } from './email-validation/check-compatibility';
import { getRelevantEmailClients } from './email-validation/email-clients';
import { getLintingRows } from './email-validation/linting';
import { createTailwindSetup } from './email-validation/tailwind-setup';
import {
  getEmailPathFromSlug,
  getEmailSlugs,
  getEmailsDirectoryMetadata,
} from './emails-directory';
import { serveFileFrom } from './http';
import { loadVitePlugins } from './load-vite-plugins';
import {
  getPreviewAppHtml,
  getWorkspaceId,
  previewAppDirectory,
} from './preview-app';
import { registerSpinnerAutostopping } from './register-spinner-autostopping';
import { ReportedError } from './reported-error';
import { createSpinner, stopSpinnerAndPersist } from './spinner';

export interface BuildPreviewOptions {
  /** The directory with the emails, relative to the current directory. */
  emailsDir: string;
  /** Where the built preview goes, relative to the current directory. */
  outDir?: string;
  version: string;
  compatibilityClients?: string[];
  /** A module with more Vite plugins to compile emails with. */
  vitePlugins?: string;
}

/** Built previews are published, so they leave out local absolute paths. */
const withoutAbsolutePaths = (directory: EmailsDirectory): EmailsDirectory => ({
  ...directory,
  absolutePath: directory.relativePath,
  subDirectories: directory.subDirectories.map(withoutAbsolutePaths),
});

const writeFile = async (filePath: string, contents: string) => {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, contents, 'utf8');
};

/**
 * Serves the `static` directory while building, so that the linter checks
 * the images in it just like the preview server serves them.
 */
const serveStaticDirectory = async (staticDirectory: string) => {
  const server = http.createServer(async (request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost');
    try {
      if (
        pathname.startsWith('/static/') &&
        (await serveFileFrom(
          staticDirectory,
          pathname.slice('/static/'.length),
          response,
        ))
      ) {
        return;
      }
      response.writeHead(404);
    } catch {
      if (!response.headersSent) response.writeHead(500);
    }
    response.end();
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;

  return {
    url: `http://127.0.0.1:${port}`,
    async close() {
      const closed = new Promise<void>((resolve) =>
        server.close(() => resolve()),
      );
      server.closeAllConnections();
      await closed;
    },
  };
};

/**
 * Scores an email with SpamAssassin through Vuemail's website, as the Spam
 * tab of the preview does.
 */
const checkSpam = async (html: string, plainText: string) => {
  const response = await fetch('https://vuemail.dev/api/check-spam', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html, plainText }),
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await response.json()) as
    | { error: string }
    | SpamCheckingResult;
  if ('error' in body) {
    throw new Error(body.error);
  }
  return body;
};

const isNetworkFailure = (exception: unknown) =>
  exception instanceof TypeError ||
  (exception instanceof DOMException && exception.name === 'TimeoutError');

/**
 * Builds the preview into a static website that can be hosted anywhere:
 * every email is rendered, linted and checked for compatibility and spam
 * ahead of time, and every preview page gets its own `index.html` so that links to
 * them work without any rewrites.
 */
export async function buildPreview(options: BuildPreviewOptions) {
  const cwd = process.cwd();
  const emailsDirectory = path.resolve(cwd, options.emailsDir);
  const outputDirectory = path.resolve(cwd, options.outDir ?? '.vuemail');

  const spinner = createSpinner({
    text: 'Starting build process...',
    prefixText: '  ',
  });
  spinner.start();
  registerSpinnerAutostopping(spinner);

  spinner.setText(`Checking if ${options.emailsDir} folder exists`);
  const metadata = await getEmailsDirectoryMetadata(emailsDirectory);
  if (!metadata) {
    spinner.fail();
    throw new ReportedError(
      `Could not find the directory at ${options.emailsDir}`,
    );
  }

  spinner.setText('Copying the preview app into `.vuemail`');
  await fs.promises.rm(outputDirectory, { recursive: true, force: true });
  await fs.promises.cp(previewAppDirectory, outputDirectory, {
    recursive: true,
  });

  const staticDirectory = path.join(emailsDirectory, 'static');
  if (fs.existsSync(staticDirectory)) {
    spinner.setText('Copying the `static` directory');
    await fs.promises.cp(
      staticDirectory,
      path.join(outputDirectory, 'static'),
      {
        recursive: true,
      },
    );
  }

  await writeFile(
    path.join(outputDirectory, 'data', 'emails.json'),
    JSON.stringify({ directory: withoutAbsolutePaths(metadata) }),
  );

  const slugs = getEmailSlugs(metadata);
  const compatibilityClients = getRelevantEmailClients(
    options.compatibilityClients,
  );
  let plugins: PluginOption[] = [];
  if (options.vitePlugins) {
    try {
      plugins = await loadVitePlugins(options.vitePlugins);
    } catch (exception) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: 'Failed to build emails',
      });
      const message =
        exception instanceof Error ? exception.message : String(exception);
      console.error(`\n${message}`);
      throw new ReportedError('Failed to build emails', { cause: exception });
    }
  }
  const loader = await createEmailLoader(cwd, { plugins });
  const staticServer = await serveStaticDirectory(staticDirectory);
  // As the preview does, for the source of emails, which HTML ones don't have
  const checkEmailCompatibility = async (
    slug: string,
    extname: string,
    source: string,
  ) => {
    const emailPath = await getEmailPathFromSlug(emailsDirectory, slug);
    if (!emailPath || extname === 'html') return [];
    return checkCompatibility(
      source,
      emailPath,
      compatibilityClients,
      createTailwindSetup(loader, emailPath),
    );
  };
  const failed: { slug: string; error: ErrorObject | undefined }[] = [];
  const skippedSpamChecks: string[] = [];
  // Once the website can't be reached, the other emails don't wait for it
  let spamCheckUnavailableReason: string | undefined;
  try {
    for (const slug of slugs) {
      spinner.setText(`Rendering ${slug}`);
      const result = await renderEmailBySlug({ emailsDirectory, loader }, slug);
      await writeFile(
        path.join(outputDirectory, 'data', 'render', `${slug}.json`),
        JSON.stringify(result),
      );
      if (!result || 'error' in result) {
        failed.push({ slug, error: result?.error });
        continue;
      }

      spinner.setText(`Checking ${slug}`);
      const toolbarData: ToolbarData = {
        lintingRows: await getLintingRows(
          result.prettyMarkup,
          staticServer.url,
        ),
        compatibilityResults: await checkEmailCompatibility(
          slug,
          result.extname,
          result.source,
        ),
      };
      if (spamCheckUnavailableReason === undefined) {
        try {
          toolbarData.spamCheckingResult = await checkSpam(
            result.prettyMarkup,
            result.plainText,
          );
        } catch (exception) {
          const reason =
            exception instanceof Error ? exception.message : String(exception);
          if (isNetworkFailure(exception)) {
            spamCheckUnavailableReason = reason;
          } else {
            skippedSpamChecks.push(`${slug} (${reason})`);
          }
        }
      }
      await writeFile(
        path.join(outputDirectory, 'data', 'toolbar', `${slug}.json`),
        JSON.stringify(toolbarData),
      );
    }
  } finally {
    await Promise.all([loader.close(), staticServer.close()]);
  }

  const config: PreviewConfig = {
    mode: 'static',
    version: options.version,
    emailsDirectoryName: path.basename(emailsDirectory),
    workspaceId: getWorkspaceId(emailsDirectory),
    hasResendApiKey: false,
    compatibilityClients: options.compatibilityClients ?? [],
  };
  const html = await getPreviewAppHtml(config);
  await writeFile(path.join(outputDirectory, 'index.html'), html);
  await writeFile(path.join(outputDirectory, '404.html'), html);
  for (const slug of slugs) {
    await writeFile(
      path.join(outputDirectory, 'preview', slug, 'index.html'),
      html,
    );
  }

  if (failed.length > 0) {
    const failedSlugs = failed.map(({ slug }) => slug).join(', ');
    stopSpinnerAndPersist(spinner, {
      symbol: logSymbols.error,
      text: `Failed to render ${failedSlugs}`,
    });
    // Tells why, as the preview would
    for (const { slug, error } of failed) {
      if (!error) continue;
      const stack = error.stack ? `\n${error.stack}` : '';
      console.error(`\n${slug}: ${error.name}: ${error.message}${stack}`);
    }
    throw new ReportedError(`Failed to render ${failedSlugs}`);
  }

  stopSpinnerAndPersist(spinner, {
    symbol: logSymbols.success,
    text: `Built the preview of ${slugs.length} emails into ${path.relative(cwd, outputDirectory) || '.'}`,
  });
  if (spamCheckUnavailableReason !== undefined) {
    console.warn(
      `  ${logSymbols.warning} Skipped the spam checks: ${spamCheckUnavailableReason}`,
    );
  }
  if (skippedSpamChecks.length > 0) {
    console.warn(
      `  ${logSymbols.warning} Skipped the spam check of ${skippedSpamChecks.join(', ')}`,
    );
  }
}
