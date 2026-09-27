// @vitest-environment node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getEmailPathFromSlug,
  getEmailSlugs,
  getEmailsDirectoryMetadata,
  isFileAnEmail,
} from './emails-directory';

const emailsDirectory = fileURLToPath(
  new URL('./fixtures/project/emails', import.meta.url),
);

describe('isFileAnEmail()', () => {
  it('recognizes single file components that render <Html> or have PreviewProps', async () => {
    expect(await isFileAnEmail(path.join(emailsDirectory, 'welcome.vue'))).toBe(
      true,
    );
    expect(
      await isFileAnEmail(
        path.join(emailsDirectory, 'auth', 'magic-link', 'code.vue'),
      ),
    ).toBe(true);
  });

  it('leaves out the components emails are made of', async () => {
    expect(
      await isFileAnEmail(
        path.join(emailsDirectory, 'components', 'footer-note.vue'),
      ),
    ).toBe(false);
  });

  it('leaves out files starting with an underscore and plain modules', async () => {
    expect(await isFileAnEmail(path.join(emailsDirectory, '_draft.vue'))).toBe(
      false,
    );
    expect(await isFileAnEmail(path.join(emailsDirectory, 'theme.ts'))).toBe(
      false,
    );
  });

  it('shows HTML files as they are', async () => {
    expect(await isFileAnEmail(path.join(emailsDirectory, 'raw.html'))).toBe(
      true,
    );
  });
});

describe('getEmailsDirectoryMetadata()', () => {
  it('lists the emails, merging directories that only hold another directory', async () => {
    const metadata = await getEmailsDirectoryMetadata(emailsDirectory);

    expect(metadata?.emailFilenames).toEqual(['broken', 'raw', 'welcome']);
    expect(
      metadata?.subDirectories.map((directory) => ({
        directoryName: directory.directoryName,
        relativePath: directory.relativePath,
        emailFilenames: directory.emailFilenames,
      })),
    ).toEqual([
      {
        directoryName: path.join('auth', 'magic-link'),
        relativePath: path.join('auth', 'magic-link'),
        emailFilenames: ['code'],
      },
    ]);
  });

  it('can keep the file extensions', async () => {
    const metadata = await getEmailsDirectoryMetadata(emailsDirectory, true);

    expect(metadata?.emailFilenames).toEqual([
      'broken.vue',
      'raw.html',
      'welcome.vue',
    ]);
  });

  it('resolves to undefined when the directory does not exist', async () => {
    expect(
      await getEmailsDirectoryMetadata(path.join(emailsDirectory, 'missing')),
    ).toBeUndefined();
  });
});

describe('getEmailSlugs()', () => {
  it('lists every email as a path relative to the emails directory', async () => {
    const metadata = await getEmailsDirectoryMetadata(emailsDirectory);

    expect(getEmailSlugs(metadata!)).toEqual([
      'broken',
      'raw',
      'welcome',
      'auth/magic-link/code',
    ]);
  });
});

describe('getEmailPathFromSlug()', () => {
  it('finds the file of an email, whatever its extension', async () => {
    expect(await getEmailPathFromSlug(emailsDirectory, 'welcome')).toBe(
      path.join(emailsDirectory, 'welcome.vue'),
    );
    expect(await getEmailPathFromSlug(emailsDirectory, 'raw')).toBe(
      path.join(emailsDirectory, 'raw.html'),
    );
    expect(
      await getEmailPathFromSlug(emailsDirectory, 'auth/magic-link/code'),
    ).toBe(path.join(emailsDirectory, 'auth', 'magic-link', 'code.vue'));
  });

  it("doesn't find files that aren't emails", async () => {
    expect(
      await getEmailPathFromSlug(emailsDirectory, 'components/footer-note'),
    ).toBeUndefined();
  });

  it('never resolves files outside of the emails directory', async () => {
    expect(
      await getEmailPathFromSlug(emailsDirectory, '../package.json'),
    ).toBeUndefined();
    expect(
      await getEmailPathFromSlug(
        path.join(emailsDirectory, 'auth'),
        '../welcome',
      ),
    ).toBeUndefined();
  });
});
