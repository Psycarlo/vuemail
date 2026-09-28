import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./index.ts', import.meta.url));

// Each test starts the CLI through tsx, which is slow when other test runs
// share the machine
vi.setConfig({ testTimeout: 60_000 });

const runCli = (args: string[], env: Record<string, string> = {}) =>
  spawnSync(process.execPath, ['--import', 'tsx', cli, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
    input: '',
  });

describe('email CLI', () => {
  it("doesn't show the clients from the environment as the default of --clients", () => {
    for (const command of ['dev', 'build']) {
      const { stdout, status } = runCli([command, '--help'], {
        COMPATIBILITY_EMAIL_CLIENTS: 'gmail,outlook',
      });

      expect(status).toBe(0);
      expect(stdout).toContain('-c, --clients <clients>');
      expect(stdout).not.toContain('gmail,outlook');
    }
  });

  it('takes Vite plugins to compile emails with, where upstream takes esbuild ones', () => {
    for (const command of ['dev', 'build', 'export']) {
      const { stdout } = runCli([command, '--help']);

      expect(stdout, command).toContain('--vite-plugins <path>');
    }
  });

  it('refuses email clients it does not know', () => {
    const { stderr, status } = runCli(['dev', '--clients', 'gmial,outlook']);

    expect(status).toBe(1);
    expect(stderr).toContain(
      "error: option '-c, --clients <clients>' argument 'gmial,outlook' is invalid. Unknown email client(s): gmial.",
    );
  });

  it('tells when the emails directory to preview is missing', () => {
    const { stderr, status } = runCli(['dev', '--dir', 'missing-emails']);

    expect(status).toBe(1);
    expect(stderr).toBe('Missing missing-emails folder\n');
  });
});
