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
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
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

  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) return false;
  } catch {
    return false;
  }

  response.writeHead(200, {
    'Content-Type': contentTypeFor(filePath),
    'Cache-Control': 'no-cache',
  });
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .on('error', reject)
      .on('end', resolve)
      .pipe(response);
  });
  return true;
}
