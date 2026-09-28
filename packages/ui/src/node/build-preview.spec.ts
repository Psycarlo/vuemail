// @vitest-environment node
import { fileURLToPath } from 'node:url';
import { buildPreview } from './build-preview';
import { isReportedError } from './reported-error';

const projectDirectory = fileURLToPath(
  new URL('./fixtures/project', import.meta.url),
);

describe('buildPreview()', () => {
  const cwd = process.cwd();

  beforeEach(() => {
    process.chdir(projectDirectory);
  });

  afterEach(() => {
    process.chdir(cwd);
    vi.restoreAllMocks();
  });

  it('fails the step that checks for the emails directory when it is missing', async () => {
    const output: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output.push(String(chunk));
      return true;
    });

    const building = buildPreview({
      emailsDir: 'missing',
      outDir: '.vuemail-never-built',
      version: '1.2.3',
    });

    await expect(building).rejects.toSatisfy(isReportedError);
    expect(output).toEqual([
      '  Starting build process...\n',
      '  Checking if missing folder exists\n',
      '  ✖ Checking if missing folder exists\n',
    ]);
  });
});
