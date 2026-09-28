import fs from 'node:fs';
import type http from 'node:http';
import path from 'node:path';

const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.apng': 'image/apng',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.jfif': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.ics': 'text/calendar; charset=utf-8',
  '.vcf': 'text/vcard; charset=utf-8',
};

export const contentTypeFor = (filePath: string) =>
  contentTypes[path.extname(filePath).toLowerCase()] ??
  'application/octet-stream';

export function sendJson(
  response: http.ServerResponse,
  status: number,
  body: unknown,
) {
  response.writeHead(status, { 'Content-Type': contentTypes['.json']! });
  response.end(JSON.stringify(body));
}

export async function readJsonBody<Body>(
  request: http.IncomingMessage,
): Promise<Body> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  return (text === '' ? {} : JSON.parse(text)) as Body;
}

const sendStatus = (response: http.ServerResponse, status: number) => {
  response.writeHead(status);
  response.end();
};

/** Streams a file, keeping the caching headers the response already has. */
const sendFile = async (
  response: http.ServerResponse,
  filePath: string,
  size: number,
) => {
  response.setHeader('Content-Type', contentTypeFor(filePath));
  response.setHeader('Content-Length', size);
  if (!response.hasHeader('Cache-Control')) {
    response.setHeader('Cache-Control', 'no-cache');
  }
  response.writeHead(200);
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .on('error', reject)
      .on('end', resolve)
      .pipe(response);
  });
};

/**
 * Serves a file from a directory, refusing any path that would escape it.
 * Resolves to false when there is no such file.
 */
export async function serveFileFrom(
  directory: string,
  requestPath: string,
  response: http.ServerResponse,
): Promise<boolean> {
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(requestPath);
  } catch {
    return false;
  }
  // Resolving drops a trailing separator, which the check below relies on
  const root = path.resolve(directory);
  const filePath = path.resolve(
    root,
    `.${path.posix.normalize(`/${decodedPath}`)}`,
  );
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return false;
  }

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) return false;
  } catch {
    return false;
  }

  await sendFile(response, filePath, stat.size);
  return true;
}

/**
 * Serves a request for `/static/...` from the `static` directory of the
 * emails: 400 for paths that can't be decoded, 403 for paths that would
 * escape the directory and 404 for files that aren't there.
 */
export async function serveStaticFile(
  response: http.ServerResponse,
  pathname: string,
  staticDirectory: string,
) {
  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    sendStatus(response, 400);
    return;
  }

  const root = path.resolve(staticDirectory);
  const filePath = path.resolve(
    root,
    decodedPathname.replace(/^\/static\/?/, ''),
  );
  const relativeFilePath = path.relative(root, filePath);
  if (
    relativeFilePath === '..' ||
    relativeFilePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeFilePath)
  ) {
    sendStatus(response, 403);
    return;
  }

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    sendStatus(response, 404);
    return;
  }
  if (!stat.isFile()) {
    sendStatus(response, 404);
    return;
  }

  await sendFile(response, filePath, stat.size);
}
