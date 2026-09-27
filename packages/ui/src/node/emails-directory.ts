import fs from 'node:fs';
import path from 'node:path';
import type { EmailsDirectory } from '../shared/types';

export const emailExtensions = ['.vue', '.tsx', '.jsx', '.js', '.html'];

const hasDefaultExport = (contents: string) =>
  /\bexport\s+default\b/.test(contents) ||
  /\bmodule\.exports\s*=/.test(contents) ||
  /\bexport\s+\{[^}]*\bdefault\b[^}]*\}/.test(contents);

/**
 * Every single file component has a default export, so for them it's what
 * they render that tells an email apart from the components it is made of:
 * an email renders an `<Html>` element, or has `PreviewProps` to render with.
 */
const isVueEmail = (contents: string) =>
  /<(Html|html)[\s>/]/.test(contents) || /\bPreviewProps\b/.test(contents);

export async function isFileAnEmail(fullPath: string): Promise<boolean> {
  const { ext, name } = path.parse(fullPath);
  if (name.startsWith('_') || !emailExtensions.includes(ext)) return false;

  let contents: string;
  try {
    const stat = await fs.promises.stat(fullPath);
    if (!stat.isFile()) return false;
    if (ext === '.html') return true;
    contents = await fs.promises.readFile(fullPath, 'utf8');
  } catch {
    return false;
  }

  return ext === '.vue' ? isVueEmail(contents) : hasDefaultExport(contents);
}

/**
 * Directories with no emails and a single sub directory are shown merged
 * with it, as in `auth/magic-links`.
 */
const mergeDirectoriesWithSubDirectories = (
  directory: EmailsDirectory,
): EmailsDirectory => {
  let merged = directory;

  while (
    merged.emailFilenames.length === 0 &&
    merged.subDirectories.length === 1
  ) {
    const onlySubDirectory = merged.subDirectories[0]!;
    merged = {
      ...onlySubDirectory,
      directoryName: path.join(
        merged.directoryName,
        onlySubDirectory.directoryName,
      ),
    };
  }

  return merged;
};

/**
 * Walks the emails directory for emails, leaving out the `static` directory
 * and every directory or file whose name starts with `_`.
 */
export async function getEmailsDirectoryMetadata(
  absolutePathToEmailsDirectory: string,
  keepFileExtensions = false,
  isSubDirectory = false,
  baseDirectoryPath = absolutePathToEmailsDirectory,
): Promise<EmailsDirectory | undefined> {
  if (!fs.existsSync(absolutePathToEmailsDirectory)) return undefined;

  const dirents = await fs.promises.readdir(absolutePathToEmailsDirectory, {
    withFileTypes: true,
  });

  const isEmail = await Promise.all(
    dirents.map((dirent) =>
      dirent.isFile()
        ? isFileAnEmail(path.join(absolutePathToEmailsDirectory, dirent.name))
        : false,
    ),
  );
  const emailFilenames = dirents
    .filter((_, index) => isEmail[index])
    .map((dirent) =>
      keepFileExtensions
        ? dirent.name
        : dirent.name.slice(0, -path.extname(dirent.name).length),
    )
    .sort();

  const subDirectories = await Promise.all(
    dirents
      .filter(
        (dirent) =>
          dirent.isDirectory() &&
          !dirent.name.startsWith('_') &&
          !dirent.name.startsWith('.') &&
          dirent.name !== 'node_modules' &&
          dirent.name !== 'static',
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(
        (dirent) =>
          getEmailsDirectoryMetadata(
            path.join(absolutePathToEmailsDirectory, dirent.name),
            keepFileExtensions,
            true,
            baseDirectoryPath,
          ) as Promise<EmailsDirectory>,
      ),
  );

  const metadata: EmailsDirectory = {
    absolutePath: absolutePathToEmailsDirectory,
    relativePath: path.relative(
      baseDirectoryPath,
      absolutePathToEmailsDirectory,
    ),
    directoryName: path.basename(absolutePathToEmailsDirectory),
    emailFilenames,
    subDirectories: subDirectories.filter(
      (directory) =>
        directory.emailFilenames.length > 0 ||
        directory.subDirectories.length > 0,
    ),
  };

  return isSubDirectory
    ? mergeDirectoriesWithSubDirectories(metadata)
    : metadata;
}

/** The slugs of every email, as paths relative to the emails directory. */
export function getEmailSlugs(directory: EmailsDirectory): string[] {
  const slugs = directory.emailFilenames.map((filename) =>
    [directory.relativePath, filename]
      .filter(Boolean)
      .join('/')
      .replaceAll('\\', '/'),
  );
  for (const subDirectory of directory.subDirectories) {
    slugs.push(...getEmailSlugs(subDirectory));
  }
  return slugs;
}

export const isPathWithinDirectory = (directory: string, target: string) => {
  const relative = path.relative(directory, target);
  return (
    relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
  );
};

/**
 * Finds the file of an email from its slug, never one outside of the emails
 * directory.
 */
export async function getEmailPathFromSlug(
  emailsDirectory: string,
  slug: string,
): Promise<string | undefined> {
  const normalizedSlug = slug.replace(/^\/+/, '');
  const candidates = emailExtensions.some((extension) =>
    normalizedSlug.endsWith(extension),
  )
    ? [normalizedSlug]
    : emailExtensions.map((extension) => `${normalizedSlug}${extension}`);

  for (const candidate of candidates) {
    const fullPath = path.resolve(emailsDirectory, candidate);
    if (!isPathWithinDirectory(emailsDirectory, fullPath)) continue;
    if (await isFileAnEmail(fullPath)) return fullPath;
  }
  return undefined;
}
