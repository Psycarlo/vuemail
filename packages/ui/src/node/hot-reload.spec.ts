// @vitest-environment node
import fs from 'node:fs';
import type http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createEmailLoader, type EmailLoader } from './email-loader';
import { type HotReload, setupHotReload } from './hot-reload';

vi.setConfig({ testTimeout: 30_000, hookTimeout: 30_000 });

const projectDirectory = fileURLToPath(
  new URL('./fixtures/project', import.meta.url),
);

/** Collects what the server sends a connected preview. */
const connect = (hotReload: HotReload) => {
  const received: string[] = [];
  const request = { on: vi.fn() } as unknown as http.IncomingMessage;
  const response = {
    writeHead: vi.fn(),
    write: (chunk: string) => received.push(chunk),
    end: vi.fn(),
  } as unknown as http.ServerResponse;
  hotReload.connect(request, response);
  return received;
};

describe('setupHotReload()', () => {
  let loader: EmailLoader;
  let hotReload: HotReload;
  let emailsDirectory: string;

  beforeAll(async () => {
    // Outside of the project, as with `email dev --dir ../emails`
    emailsDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'vuemail-emails-'));
    loader = await createEmailLoader(projectDirectory);
    hotReload = setupHotReload(loader, emailsDirectory);
    await new Promise((resolve) => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    hotReload.close();
    await loader.close();
    fs.rmSync(emailsDirectory, { recursive: true, force: true });
  });

  it('tells about the emails that come, even outside of the project', async () => {
    const received = connect(hotReload);

    fs.writeFileSync(path.join(emailsDirectory, 'new.vue'), '<template />\n');

    await vi.waitFor(
      () => {
        const events = received.filter((chunk) => chunk.startsWith('event:'));
        expect(events).toContain(
          `event: reload\ndata: ${JSON.stringify([{ event: 'add', filename: 'new.vue' }])}\n\n`,
        );
      },
      { timeout: 10_000, interval: 100 },
    );
  });
});
