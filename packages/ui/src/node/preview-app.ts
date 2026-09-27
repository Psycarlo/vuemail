import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { PreviewConfig } from '../shared/types';

/** The built preview app, next to the built server code. */
export const previewAppDirectory = fileURLToPath(
  new URL('../client/', import.meta.url),
);

const configPlaceholder = '<!--vuemail-config-->';

/** Identifies a project in the preview app's local storage. */
export const getWorkspaceId = (emailsDirectory: string) =>
  createHash('sha256').update(emailsDirectory).digest('hex').slice(0, 12);

/**
 * The preview app's HTML with the configuration it runs with, escaped so
 * that nothing in it can close the script tag it goes into.
 */
export async function getPreviewAppHtml(config: PreviewConfig) {
  const html = await fs.promises.readFile(
    `${previewAppDirectory}index.html`,
    'utf8',
  );
  const serializedConfig = JSON.stringify(config).replaceAll('<', '\\u003c');
  return html.replace(
    configPlaceholder,
    `<script>window.__VUEMAIL_CONFIG__=${serializedConfig}</script>`,
  );
}
