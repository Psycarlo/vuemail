import fs from 'node:fs';
import path from 'node:path';
import { styleText } from 'node:util';
import logSymbols from 'log-symbols';
import type { Component } from 'vue';
import type { EmailRenderingResult, ErrorObject } from '../shared/types';
import type { EmailLoader } from './email-loader';
import { registerSpinnerAutostopping } from './register-spinner-autostopping';
import { createSpinner, type Spinner, stopSpinnerAndPersist } from './spinner';

type Vuemail = typeof import('@vuemaildev/vuemail');

type EmailComponent = Component & { PreviewProps?: Record<string, unknown> };

export const toErrorObject = (error: unknown): ErrorObject => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause === undefined ? undefined : toErrorObject(error.cause),
    };
  }
  return { name: 'Error', message: String(error), stack: undefined };
};

/**
 * Keeps only the frames of a stack, as in ` at setup (welcome.vue:4:7)`,
 * since the preview shows the name and the message of the error above it.
 */
export const toStackFrames = (stack: string | undefined) => {
  if (stack === undefined) return undefined;
  return stack
    .split('\n')
    .filter((line) => /^\s*at\s/.test(line))
    .map((line) => ` ${line.trim()}`)
    .join('\n');
};

/**
 * Props go to the preview app as JSON, so only what survives it can be
 * shown and edited there.
 */
const toJsonSafeProps = (props: unknown): Record<string, unknown> => {
  try {
    const serialized = JSON.parse(JSON.stringify(props ?? {})) as unknown;
    if (
      serialized !== null &&
      typeof serialized === 'object' &&
      !Array.isArray(serialized)
    ) {
      return serialized as Record<string, unknown>;
    }
  } catch {
    // Props with values JSON can't hold can't be edited as JSON either
  }
  return {};
};

type ConsoleMethod = 'log' | 'error' | 'info' | 'warn';

/**
 * Holds back what's logged while emails render, so that it shows up after
 * the line that tells how rendering went. Renders can overlap, so logs only
 * flow again once every one of them is done.
 */
const createLogBufferer = (method: ConsoleMethod) => {
  let logs: unknown[][] = [];
  let timesCorked = 0;
  let original = console[method];

  return {
    buffer() {
      if (timesCorked === 0) {
        original = console[method];
        console[method] = (...args: unknown[]) => {
          logs.push(args);
        };
      }
      timesCorked += 1;
    },
    flush() {
      timesCorked = Math.max(timesCorked - 1, 0);
      if (timesCorked === 0) {
        console[method] = original;
        for (const args of logs) {
          original(...args);
        }
        logs = [];
      }
    },
  };
};

const logBufferers = (['log', 'error', 'info', 'warn'] as const).map(
  createLogBufferer,
);

/** The terminal output of a render, as the preview server shows it. */
const startRenderLogging = (emailFilename: string) => {
  for (const bufferer of logBufferers) bufferer.buffer();
  const spinner: Spinner = createSpinner({
    text: `Rendering email template ${emailFilename}\n`,
    prefixText: ' ',
    stream: process.stderr,
  });
  spinner.start();
  const unregister = registerSpinnerAutostopping(spinner);

  return (symbol: string, text: string) => {
    stopSpinnerAndPersist(spinner, { symbol, text });
    unregister();
    for (const bufferer of logBufferers) bufferer.flush();
  };
};

const colorDuration = (milliseconds: number) => {
  const duration = `${milliseconds.toFixed(0)}ms`;
  if (milliseconds <= 450) return styleText('green', duration);
  if (milliseconds <= 1000) return styleText('yellow', duration);
  return styleText('red', duration);
};

async function renderRawHtmlEmail(
  loader: EmailLoader,
  emailPath: string,
): Promise<EmailRenderingResult> {
  const basename = path.basename(emailPath, '.html');
  try {
    const { pretty, toPlainText } = await loader.load<Vuemail>(
      '@vuemaildev/vuemail',
    );
    const source = await fs.promises.readFile(emailPath, 'utf8');
    const markup = source.replaceAll('\0', '');

    let prettyMarkup = markup;
    try {
      prettyMarkup = await pretty(markup);
    } catch {
      // Markup Prettier can't parse is still shown, so that it can be
      // iterated on
    }

    return {
      previewProps: {},
      markup,
      prettyMarkup,
      plainText: toPlainText(markup),
      source,
      basename,
      extname: 'html',
    };
  } catch (exception) {
    return { error: toErrorObject(exception), basename, extname: 'html' };
  }
}

export interface RenderEmailOptions {
  /** Tells in the terminal how each render goes, as `email dev` does. */
  logging?: boolean;
}

/**
 * Renders an email the way it will be sent: into its HTML, a prettified copy
 * of it and its plain text version.
 *
 * `@vuemaildev/vuemail` is loaded from the project itself, so that the email renders
 * with the very same Vue and components it imports.
 */
export async function renderEmailByPath(
  loader: EmailLoader,
  emailPath: string,
  previewPropsOverride?: Record<string, unknown>,
  { logging = false }: RenderEmailOptions = {},
): Promise<EmailRenderingResult> {
  const emailFilename = path.basename(emailPath);
  const extension = path.extname(emailPath);
  const basename = path.basename(emailPath, extension);
  const extname = extension.slice(1);
  const finishLogging = logging ? startRenderLogging(emailFilename) : undefined;

  if (extension === '.html') {
    const result = await renderRawHtmlEmail(loader, emailPath);
    finishLogging?.(
      'error' in result ? logSymbols.error : logSymbols.success,
      'error' in result
        ? `Failed while rendering ${emailFilename}`
        : `Successfully rendered ${emailFilename}`,
    );
    return result;
  }

  let vuemail: Vuemail;
  let emailModule: { default?: EmailComponent };
  let source: string;
  const timeBeforeEmailLoaded = performance.now();
  try {
    [vuemail, emailModule, source] = await Promise.all([
      loader.load<Vuemail>('@vuemaildev/vuemail'),
      loader.load<{ default?: EmailComponent }>(emailPath),
      fs.promises.readFile(emailPath, 'utf8'),
    ]);
  } catch (exception) {
    // Like errors while bundling, these are shown as they come, with the
    // code frame of what couldn't compile
    if (exception instanceof Error) loader.fixStacktrace(exception);
    finishLogging?.(
      logSymbols.error,
      `Failed while rendering ${emailFilename}`,
    );
    return { error: toErrorObject(exception), basename, extname };
  }
  const millisecondsToLoaded = performance.now() - timeBeforeEmailLoaded;

  try {
    const email = emailModule.default;
    if (!email) {
      throw new Error(
        `${emailFilename} has no default export. Make sure it exports the email component as its default export.`,
      );
    }

    const timeBeforeEmailRendered = performance.now();
    const props = previewPropsOverride ?? email.PreviewProps ?? {};
    const markup = await vuemail.render(email, props);
    const result: EmailRenderingResult = {
      previewProps: toJsonSafeProps(props),
      markup,
      prettyMarkup: await vuemail.pretty(markup),
      plainText: vuemail.toPlainText(markup),
      source,
      basename,
      extname,
    };
    const millisecondsToRendered = performance.now() - timeBeforeEmailRendered;

    finishLogging?.(
      logSymbols.success,
      `Successfully rendered ${emailFilename} in ${colorDuration(millisecondsToRendered)} (bundled in ${millisecondsToLoaded.toFixed(0)}ms)`,
    );
    return result;
  } catch (exception) {
    if (exception instanceof Error) loader.fixStacktrace(exception);
    finishLogging?.(
      logSymbols.error,
      `Failed while rendering ${emailFilename}`,
    );
    const error = toErrorObject(exception);
    return {
      error: { ...error, stack: toStackFrames(error.stack) },
      basename,
      extname,
    };
  }
}
