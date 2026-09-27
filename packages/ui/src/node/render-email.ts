import fs from 'node:fs';
import path from 'node:path';
import type { Component } from 'vue';
import type { EmailRenderingResult, ErrorObject } from '../shared/types';
import type { EmailLoader } from './email-loader';

type Vuemail = typeof import('vuemail');

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

async function renderRawHtmlEmail(
  loader: EmailLoader,
  emailPath: string,
): Promise<EmailRenderingResult> {
  const { pretty, toPlainText } = await loader.load<Vuemail>('vuemail');
  const markup = await fs.promises.readFile(emailPath, 'utf8');

  return {
    previewProps: {},
    markup,
    prettyMarkup: await pretty(markup),
    plainText: toPlainText(markup),
    source: markup,
    basename: path.basename(emailPath, '.html'),
    extname: 'html',
  };
}

/**
 * Renders an email the way it will be sent: into its HTML, a prettified copy
 * of it and its plain text version.
 *
 * `vuemail` is loaded from the project itself, so that the email renders
 * with the very same Vue and components it imports.
 */
export async function renderEmailByPath(
  loader: EmailLoader,
  emailPath: string,
  previewPropsOverride?: Record<string, unknown>,
): Promise<EmailRenderingResult> {
  try {
    if (path.extname(emailPath) === '.html') {
      return await renderRawHtmlEmail(loader, emailPath);
    }

    const [{ render, pretty, toPlainText }, emailModule, source] =
      await Promise.all([
        loader.load<Vuemail>('vuemail'),
        loader.load<{ default?: EmailComponent }>(emailPath),
        fs.promises.readFile(emailPath, 'utf8'),
      ]);

    const email = emailModule.default;
    if (!email) {
      throw new Error(
        `${path.basename(emailPath)} has no default export. Make sure it exports the email component as its default export.`,
      );
    }

    const props = previewPropsOverride ?? email.PreviewProps ?? {};
    const markup = await render(email, props);

    return {
      previewProps: toJsonSafeProps(props),
      markup,
      prettyMarkup: await pretty(markup),
      plainText: toPlainText(markup),
      source,
      basename: path.basename(emailPath, path.extname(emailPath)),
      extname: path.extname(emailPath).slice(1),
    };
  } catch (exception) {
    if (exception instanceof Error) loader.fixStacktrace(exception);
    return { error: toErrorObject(exception) };
  }
}
