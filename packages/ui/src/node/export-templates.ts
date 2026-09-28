import fs from 'node:fs';
import path from 'node:path';
import logSymbols from 'log-symbols';
import type { PluginOption } from 'vite';
import type { App, Component } from 'vue';
import type { EmailsDirectory } from '../shared/types';
import { createEmailLoader, type EmailLoader } from './email-loader';
import { getEmailsDirectoryMetadata } from './emails-directory';
import { loadVitePlugins } from './load-vite-plugins';
import { registerSpinnerAutostopping } from './register-spinner-autostopping';
import { ReportedError } from './reported-error';
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
  /** A module with more Vite plugins to compile emails with. */
  vitePlugins?: string;
}

const getEmailTemplatesFromDirectory = (
  directory: EmailsDirectory,
): string[] => [
  ...directory.emailFilenames.map((filename) =>
    path.join(directory.absolutePath, filename),
  ),
  ...directory.subDirectories.flatMap(getEmailTemplatesFromDirectory),
];

const silenceWarnings = (app: App) => {
  app.config.warnHandler = () => {};
};

const toError = (exception: unknown) =>
  exception instanceof Error ? exception : new Error(String(exception));

/**
 * Compiles every email, and `vuemail` to render them with, collecting what
 * fails to compile. HTML emails need no compiling.
 */
const compileTemplates = async (loader: EmailLoader, templates: string[]) => {
  const failures: Error[] = [];
  const emails = new Map<string, Component>();

  let vuemail: Vuemail | undefined;
  try {
    vuemail = await loader.load<Vuemail>('vuemail');
  } catch (exception) {
    failures.push(toError(exception));
  }

  for (const template of templates) {
    if (path.extname(template) === '.html') continue;
    try {
      const { default: email } = await loader.load<{ default: Component }>(
        template,
      );
      emails.set(template, email);
    } catch (exception) {
      failures.push(toError(exception));
    }
  }

  return { vuemail, emails, failures };
};

const getOutputExtension = ({
  extension,
  plainText,
}: ExportTemplatesOptions) => {
  if (extension && extension.length > 0) {
    return extension.startsWith('.') ? extension : `.${extension}`;
  }
  return plainText ? '.txt' : '.html';
};

/**
 * Renders every email in the emails directory into the output directory,
 * keeping their folder structure, and copies the `static` directory along.
 *
 * Emails are compiled first, and only rendered once all of them compile.
 * Failures are reported as they happen and then thrown as a
 * `ReportedError`.
 */
export async function exportTemplates(options: ExportTemplatesOptions) {
  const cwd = process.cwd();
  const emailsDirectory = path.resolve(cwd, options.emailsDir);
  const outputDirectory = path.resolve(cwd, options.outDir);

  let spinner: Spinner | undefined;
  if (!options.silent) {
    spinner = createSpinner('Preparing files...\n');
    spinner.start();
    registerSpinnerAutostopping(spinner);
  }

  const metadata = await getEmailsDirectoryMetadata(emailsDirectory, true);
  if (!metadata) {
    const message = `Could not find the directory at ${options.emailsDir}`;
    if (spinner) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: message,
      });
    } else {
      console.error(message);
    }
    throw new ReportedError(message);
  }

  await fs.promises.rm(outputDirectory, { recursive: true, force: true });

  const templates = getEmailTemplatesFromDirectory(metadata);
  const extension = getOutputExtension(options);
  let plugins: PluginOption[] = [];
  if (options.vitePlugins) {
    try {
      plugins = await loadVitePlugins(options.vitePlugins);
    } catch (exception) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: 'Failed to build emails',
      });
      console.error(`\n${toError(exception).message}`);
      throw new ReportedError('Failed to build emails', { cause: exception });
    }
  }
  const loader = await createEmailLoader(cwd, { plugins });

  try {
    const { vuemail, emails, failures } = await compileTemplates(
      loader,
      templates,
    );
    if (!vuemail || failures.length > 0) {
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: 'Failed to build emails',
      });
      console.error(
        `\n${failures.map((failure) => failure.message).join('\n\n')}`,
      );
      throw new ReportedError('Failed to build emails');
    }

    spinner?.succeed();

    for (const [index, template] of templates.entries()) {
      const templateName = path.basename(template);
      spinner?.setText(`rendering ${templateName}`);
      if (index === 0) spinner?.start();

      let rendered: string;
      try {
        const email = emails.get(template);
        if (email) {
          rendered = await vuemail.render(
            email,
            {},
            {
              ...(options.plainText
                ? { plainText: true }
                : { pretty: options.pretty ?? false }),
              // Emails are exported without props, which would warn about each
              // missing required one: React Email doesn't validate props either
              setupApp: silenceWarnings,
            },
          );
        } else {
          const markup = await fs.promises.readFile(template, 'utf8');
          rendered = options.plainText
            ? vuemail.toPlainText(markup)
            : options.pretty
              ? await vuemail.pretty(markup)
              : markup;
        }
      } catch (exception) {
        if (exception instanceof Error) loader.fixStacktrace(exception);
        stopSpinnerAndPersist(spinner, {
          symbol: logSymbols.error,
          text: `failed when rendering ${templateName}`,
        });
        console.error(exception);
        throw new ReportedError(`failed when rendering ${templateName}`, {
          cause: exception,
        });
      }

      const relativePath = path.relative(emailsDirectory, template);
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

  if (spinner) {
    spinner.succeed('Rendered all files');
    spinner.setText('Copying static files');
    spinner.start();
  }

  const staticDirectory = path.join(emailsDirectory, 'static');
  if (fs.existsSync(staticDirectory)) {
    const outputStaticDirectory = path.join(outputDirectory, 'static');
    try {
      await fs.promises.rm(outputStaticDirectory, {
        recursive: true,
        force: true,
      });
      await fs.promises.cp(staticDirectory, outputStaticDirectory, {
        recursive: true,
      });
    } catch (exception) {
      console.error(exception);
      stopSpinnerAndPersist(spinner, {
        symbol: logSymbols.error,
        text: 'Failed to copy static files',
      });
      console.error(
        `Something went wrong while copying the file to ${options.outDir}/static, ${exception}`,
      );
      throw new ReportedError('Failed to copy static files', {
        cause: exception,
      });
    }
  }

  if (spinner) {
    spinner.succeed();
    console.log(await tree(outputDirectory, 4));
    console.log(`${logSymbols.success} Successfully exported emails`);
  }
}
