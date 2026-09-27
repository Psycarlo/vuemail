import vue from '@vitejs/plugin-vue';
import { createServer, type ViteDevServer } from 'vite';

export interface EmailLoader {
  /** Imports a module the way the emails import theirs, compiling what needs compiling. */
  load<Module = Record<string, unknown>>(id: string): Promise<Module>;
  /** Rewrites the stack of an error thrown by a loaded module to point to its sources. */
  fixStacktrace(error: Error): void;
  /** Whether a file is imported by any of the modules loaded so far. */
  isImported(filePath: string): boolean;
  /** Vite's watcher over the project, which also sees the files emails import. */
  watcher: ViteDevServer['watcher'];
  close(): Promise<void>;
}

/**
 * Creates the Vite server that compiles the emails, which can be single file
 * components written in TypeScript, and keeps its module graph up to date as
 * files change so that every render picks up the latest code.
 */
export async function createEmailLoader(root: string): Promise<EmailLoader> {
  const server = await createServer({
    root,
    configFile: false,
    envFile: false,
    logLevel: 'error',
    clearScreen: false,
    appType: 'custom',
    plugins: [
      vue({
        // Emails reference their images by URL, so these must not become
        // module imports.
        template: { transformAssetUrls: false },
      }),
    ],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      middlewareMode: true,
      hmr: false,
      ws: false,
      watch: {
        ignored: ['**/node_modules/**', '**/.vuemail/**', '**/.git/**'],
      },
    },
    optimizeDeps: {
      noDiscovery: true,
      include: [],
    },
  });

  return {
    load: (id) => server.ssrLoadModule(id, { fixStacktrace: true }) as never,
    fixStacktrace: (error) => server.ssrFixStacktrace(error),
    isImported: (filePath) =>
      (server.environments.ssr.moduleGraph.getModulesByFile(filePath)?.size ??
        0) > 0,
    watcher: server.watcher,
    close: () => server.close(),
  };
}
