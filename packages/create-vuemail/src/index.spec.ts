import { spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { installDependencies, runScript } from 'nypm';
import { beforeAll, describe, expect, test } from 'vitest';

const cliPath = path.resolve(import.meta.dirname, './index.js');
const templatePath = path.resolve(import.meta.dirname, '../template');
const testPath = path.resolve(import.meta.dirname, '../.test');

// Loaded into the CLI's process in place of the npm registry,
// so that creating a project doesn't need the network
const registryStub = `
const registry = 'https://registry.npmjs.org/vuemail/';
const versions = { latest: '1.2.3', canary: '1.3.0-canary.0' };
globalThis.fetch = async (url) => {
  const tag = String(url).startsWith(registry)
    ? String(url).slice(registry.length)
    : undefined;
  return Object.hasOwn(versions, tag)
    ? Response.json({ version: versions[tag] })
    : new Response('Not Found', { status: 404 });
};
`;

const createVuemail = (args: string[]) =>
  spawnSync(
    process.execPath,
    [
      '--import',
      `data:text/javascript,${encodeURIComponent(registryStub)}`,
      cliPath,
      ...args,
    ],
    { cwd: testPath, encoding: 'utf8' },
  );

const listFiles = async (directory: string) => {
  const dirents = await fs.readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  return dirents
    .filter((dirent) => dirent.isFile())
    .map((dirent) =>
      path.relative(directory, path.join(dirent.parentPath, dirent.name)),
    )
    .sort();
};

const readPackageJson = async (directory: string) =>
  JSON.parse(await fs.readFile(path.join(directory, 'package.json'), 'utf8'));

describe('create-vuemail', () => {
  beforeAll(async () => {
    await fs.rm(testPath, { recursive: true, force: true });
    await fs.mkdir(testPath, { recursive: true });
  });

  test('creates vuemail-starter from the template', async () => {
    const createProcess = createVuemail([]);
    expect(createProcess.status, createProcess.stderr).toBe(0);
    expect(createProcess.stderr).toContain('Vuemail Starter files ready');
    expect(createProcess.stdout).toContain('vercel-invite-user.vue');

    const starterPath = path.join(testPath, 'vuemail-starter');
    const files = await listFiles(templatePath);
    expect(files).toContain(path.join('emails', 'static', 'vercel-user.png'));
    expect(await listFiles(starterPath)).toEqual(files);
    for (const file of files.filter((file) => file !== 'package.json')) {
      const copy = await fs.readFile(path.join(starterPath, file));
      const original = await fs.readFile(path.join(templatePath, file));
      expect(copy.equals(original), `${file} should be copied as is`).toBe(
        true,
      );
    }

    const templatePackageJson = await readPackageJson(templatePath);
    expect(await readPackageJson(starterPath)).toEqual({
      ...templatePackageJson,
      dependencies: { ...templatePackageJson.dependencies, vuemail: '1.2.3' },
      devDependencies: {
        ...templatePackageJson.devDependencies,
        '@vuemail/ui': '1.2.3',
      },
    });
  });

  test('uses the vuemail version of --tag', async () => {
    const createProcess = createVuemail(['canary-starter', '--tag', 'canary']);
    expect(createProcess.status, createProcess.stderr).toBe(0);

    const packageJson = await readPackageJson(
      path.join(testPath, 'canary-starter'),
    );
    expect(packageJson.dependencies.vuemail).toBe('1.3.0-canary.0');
  });

  test('fails when the project already exists', () => {
    const createProcess = createVuemail(['vuemail-starter']);
    expect(createProcess.status).toBe(1);
    expect(createProcess.stderr).toContain(
      'Project called vuemail-starter already exists!',
    );
  });

  test('fails when the tag does not exist', () => {
    const createProcess = createVuemail(['missing-starter', '--tag', 'nope']);
    expect(createProcess.status).toBe(1);
    expect(createProcess.stderr).toContain(
      'Tag nope does not exist for vuemail.',
    );
  });
});

// Installs the starter's dependencies from npm, so it needs the network and a
// published vuemail. Run it with CREATE_VUEMAIL_E2E=1
describe.skipIf(!process.env.CREATE_VUEMAIL_E2E)('automatic setup', () => {
  const starterPath = path.resolve(import.meta.dirname, '../.test/e2e');
  test('creation', async () => {
    if (existsSync(starterPath)) {
      await fs.rm(starterPath, { recursive: true });
    }

    const createProcess = spawnSync(process.execPath, [cliPath, starterPath], {
      cwd: path.resolve(import.meta.dirname, '../'),
      stdio: 'pipe',
    });
    if (createProcess.stderr) {
      console.log(createProcess.stderr.toString());
    }
    expect(createProcess.status, 'starter creation should return 0').toBe(0);
  });

  test('install', { timeout: 120_000 }, async () => {
    await installDependencies({
      cwd: starterPath,
      packageManager: 'npm',
    });
  });

  test('export', { timeout: 60_000 }, async () => {
    await runScript('export', {
      cwd: starterPath,
      packageManager: 'npm',
    });
  });

  test('type checking', { timeout: 60_000 }, async () => {
    // tsc doesn't read .vue files, vue-tsc does
    const typecheckingProcess = spawnSync('npx --yes vue-tsc --noEmit', {
      cwd: starterPath,
      shell: true,
      stdio: 'pipe',
    });
    if (typecheckingProcess.stderr) {
      console.log(typecheckingProcess.stderr.toString());
    }
    if (typecheckingProcess.stdout) {
      console.log(typecheckingProcess.stdout.toString());
    }
    expect(
      typecheckingProcess.status,
      'type checking should return status code 0',
    ).toBe(0);
  });
});
