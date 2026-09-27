import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';
import type { Component } from 'vue';
import type { EmailsDirectory } from '../shared/types';
import { createEmailLoader } from './email-loader';
import { getEmailsDirectoryMetadata } from './emails-directory';
import { createSpinner, type Spinner, stopSpinnerAndPersist } from './spinner';
import { tree } from './tree';

type Vuemail = typeof import('vuemail');

export interface ExportTemplatesOptions {
  /** Where the rendered emails go, relative to the current directory. */
  outDir: string;
  /** The directory with the emails, relative to the current directory. */
  emailsDir: string;
  pretty?: boolean;
  plainText?: boolean;
  /** A custom extension for the rendered files, like `blade.php`. */
  extension?: string;
  silent?: boolean;
}

const getEmailTemplatesFromDirectory = (
  directory: EmailsDirectory,
): string[] => [
  ...directory.emailFilenames.map((filename) =>
    path.join(directory.absolutePath, filename),
  ),
  ...directory.subDirectories.flatMap(getEmailTemplatesFromDirectory),
];

const getOutputExtension = ({
  extension,
  plainText,
}: ExportTemplatesOptions) => {
  if (extension && extension.length > 0) {
    return extension.startsWith('.') ? extension : `.${extension}`;
  }
  return plainText ? '.txt' : '.html';
};

class ExportError extends Error {}

/**
 * Renders every email in the emails directory into the output directory,
 * keeping their folder structure, and copies the `static` directory along.
 */
export async function exportTemplates(options: ExportTemplatesOptions) {
  const cwd = process.cwd();
  const emailsDirectory = path.resolve(cwd, options.emailsDir);
  const outputDirectory = path.resolve(cwd, options.outDir);

  let spinner: Spinner | undefined;
  if (!options.silent) {
    spinner = createSpinner('Preparing files...\n');
    spinner.start();
  }

  const fail = (message: string): never => {
    stopSpinnerAndPersist(spinner, { symbol: logSymbols.error, text: message });
    throw new ExportError(message);
  };

  const metadata = await getEmailsDirectoryMetadata(emailsDirectory, true);
  if (!metadata) {
    return fail(`Could not find the directory at ${options.emailsDir}`);
  }

  await fs.promises.rm(outputDirectory, { recursive: true, force: true });

  const templates = getEmailTemplatesFromDirectory(metadata);
  const extension = getOutputExtension(options);
  const loader = await createEmailLoader(cwd);

  try {
    const { render, pretty, toPlainText } =
      await loader.load<Vuemail>('vuemail');

    for (const template of templates) {
      const relativePath = path.relative(emailsDirectory, template);
      spinner?.setText(`rendering ${relativePath}`);

      let rendered: string;
      try {
        if (path.extname(template) === '.html') {
          const markup = await fs.promises.readFile(template, 'utf8');
          rendered = options.plainText
            ? toPlainText(markup)
            : options.pretty
              ? await pretty(markup)
              : markup;
        } else {
          const { default: email } = await loader.load<{
            default: Component;
          }>(template);
          rendered = await render(
            email,
            {},
            options.plainText
              ? { plainText: true }
              : { pretty: options.pretty ?? false },
          );
        }
      } catch (exception) {
        if (exception instanceof Error) loader.fixStacktrace(exception);
        console.error(exception);
        return fail(`failed when rendering ${relativePath}`);
      }

      const outputPath = path.join(
        outputDirectory,
        relativePath.slice(0, -path.extname(relativePath).length) + extension,
      );
      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.promises.writeFile(outputPath, rendered, 'utf8');
    }
  } finally {
    await loader.close();
  }

  spinner?.succeed('Rendered all files');

  const staticDirectory = path.join(emailsDirectory, 'static');
  if (fs.existsSync(staticDirectory)) {
    spinner?.setText('Copying static files');
    await fs.promises.cp(
      staticDirectory,
      path.join(outputDirectory, 'static'),
      {
        recursive: true,
      },
    );
  }

  if (spinner) {
    console.log(await tree(outputDirectory, 4));
    console.log(`${logSymbols.success} Successfully exported emails`);
  }
}

export const isExportError = (error: unknown) => error instanceof ExportError;
