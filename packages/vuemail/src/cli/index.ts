#!/usr/bin/env node
import { InvalidArgumentError, program } from 'commander';
import { build } from './commands/build';
import { dev } from './commands/dev';
import { exportTemplates } from './commands/export';
import { resendReset } from './commands/resend/reset';
import { resendSetup } from './commands/resend/setup';
import { start } from './commands/start';
import { ALL_EMAIL_CLIENTS } from './utils/email-clients';
import { packageJson } from './utils/package-json';

const parseClientsOption = (value: string): string => {
  const requested = value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (requested.length === 0) {
    throw new InvalidArgumentError(
      '--clients requires at least one email client.',
    );
  }

  const known = new Set<string>(ALL_EMAIL_CLIENTS);
  const invalid = requested.filter((entry) => !known.has(entry));
  if (invalid.length > 0) {
    throw new InvalidArgumentError(
      `Unknown email client(s): ${invalid.join(', ')}. Supported: ${ALL_EMAIL_CLIENTS.join(', ')}.`,
    );
  }

  return requested.join(',');
};

program
  .name('vuemail')
  .description('A live preview of your emails right in your browser')
  .version(packageJson.version);

program
  .command('dev')
  .description('Starts the preview email development app')
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option('-p --port <port>', 'Port to run dev server on', '3000')
  .option(
    '-c, --clients <clients>',
    'Comma-separated list of email clients to show compatibility warnings for (overrides COMPATIBILITY_EMAIL_CLIENTS)',
    parseClientsOption,
  )
  .option(
    '--vite-plugins <path>',
    'Path to a module whose default export is an array of Vite plugins (or a function returning one) applied when compiling email templates',
  )
  .action(dev);

program
  .command('build')
  .description(
    'Builds the preview app, with all of your emails, into a static website',
  )
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option('-o, --outDir <path>', 'Output directory', '.vuemail')
  .option(
    '-c, --clients <clients>',
    'Comma-separated list of email clients to show compatibility warnings for (overrides COMPATIBILITY_EMAIL_CLIENTS)',
    parseClientsOption,
  )
  .option(
    '--vite-plugins <path>',
    'Path to a module whose default export is an array of Vite plugins (or a function returning one) applied when compiling email templates',
  )
  .action(build);

program
  .command('start')
  .description('Runs the built preview app that is inside of ".vuemail"')
  .option('-d, --dir <path>', 'Directory with the built preview', '.vuemail')
  .option('-p --port <port>', 'Port to run the server on', '3000')
  .action(start);

program
  .command('export')
  .description('Build the templates to the `out` directory')
  .option('--outDir <path>', 'Output directory', 'out')
  .option('-p, --pretty', 'Pretty print the output', false)
  .option('-t, --plainText', 'Set output format as plain text', false)
  .option('-d, --dir <path>', 'Directory with your email templates', './emails')
  .option(
    '-e, --extension <extension>',
    'Set a custom file extension for rendered emails (e.g. blade.php)',
  )
  .option(
    '-s, --silent',
    'To, or not to show a spinner with process information',
    false,
  )
  .option(
    '--vite-plugins <path>',
    'Path to a module whose default export is an array of Vite plugins (or a function returning one) applied when compiling email templates',
  )
  .action(exportTemplates);

const resend = program.command('resend');

resend
  .command('setup')
  .description(
    'Sets up the integration between the Vuemail CLI, and your Resend account through an API Key',
  )
  .action(resendSetup);

resend
  .command('reset')
  .description('Deletes your API Key from the Vuemail configuration')
  .action(resendReset);

program.parse();
