import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import {
  createServer,
  normalizePath,
  type Plugin,
  type PluginOption,
  type ViteDevServer,
} from 'vite';

export interface EmailLoader {
  /** Imports a module the way the emails import theirs, compiling what needs compiling. */
  load<Module = Record<string, unknown>>(id: string): Promise<Module>;
  /**
   * Runs some TypeScript as a module next to an email, so that it can import
   * what the email imports, and resolves to its default export.
   */
  evaluate(code: string, emailPath: string): Promise<unknown>;
  /** Rewrites the stack of an error thrown by a loaded module to point to its sources. */
  fixStacktrace(error: Error): void;
  /** Whether a file is imported by any of the modules loaded so far. */
  isImported(filePath: string): boolean;
  /**
   * The files of the loaded modules that import a file, directly or through
   * others, the file itself included. Paths use forward slashes.
   */
  getDependents(filePath: string): Set<string>;
  /** Vite's watcher over the project, which also sees the files emails import. */
  watcher: ViteDevServer['watcher'];
  close(): Promise<void>;
}

export interface EmailLoaderOptions {
  /** More plugins to compile emails with, as from `--vite-plugins`. */
  plugins?: PluginOption[];
}

/**
 * Creates the Vite server that compiles the emails, which can be single file
 * components written in TypeScript, and keeps its module graph up to date as
 * files change so that every render picks up the latest code.
 */
export async function createEmailLoader(
  root: string,
  { plugins = [] }: EmailLoaderOptions = {},
): Promise<EmailLoader> {
  // The code `evaluate()` runs, by the ids of the modules it runs as
  const evaluatedCode = new Map<string, string>();
  const evaluatedCodePlugin: Plugin = {
    name: 'vuemail:evaluated-code',
    enforce: 'pre',
    resolveId: (id) => (evaluatedCode.has(id) ? id : undefined),
    load: (id) => evaluatedCode.get(id),
  };

  const server = await createServer({
    root,
    configFile: false,
    envFile: false,
    // Failures reach the preview, or the output of the command, on their own
    logLevel: 'silent',
    clearScreen: false,
    appType: 'custom',
    plugins: [
      evaluatedCodePlugin,
      vue({
        template: {
          // Emails reference their images by URL, so these must not become
          // module imports.
          transformAssetUrls: false,
          // Comments in templates are for whoever reads them, as they would
          // be in production builds, not for the emails sent
          compilerOptions: { comments: false },
        },
      }),
      ...plugins,
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

  const { moduleGraph } = server.environments.ssr;
  // Vite keeps the paths of modules with forward slashes, even on Windows
  const getModules = (filePath: string) =>
    moduleGraph.getModulesByFile(normalizePath(filePath));

  return {
    load: (id) => server.ssrLoadModule(id, { fixStacktrace: true }) as never,
    async evaluate(code, emailPath) {
      // A module for each email, as if it were a file next to it
      const id = normalizePath(
        path.join(
          path.dirname(emailPath),
          `${path.basename(emailPath)}.vuemail-evaluate.ts`,
        ),
      );
      evaluatedCode.set(id, code);
      const previous = moduleGraph.getModuleById(id);
      if (previous) moduleGraph.invalidateModule(previous);
      const module = await server.ssrLoadModule(id, { fixStacktrace: true });
      return module.default;
    },
    fixStacktrace: (error) => server.ssrFixStacktrace(error),
    isImported: (filePath) => (getModules(filePath)?.size ?? 0) > 0,
    getDependents(filePath) {
      const dependents = new Set([normalizePath(filePath)]);
      const pending = [...(getModules(filePath) ?? [])];
      const seen = new Set(pending);
      for (let module = pending.pop(); module; module = pending.pop()) {
        if (module.file) dependents.add(module.file);
        for (const importer of module.importers) {
          if (seen.has(importer)) continue;
          seen.add(importer);
          pending.push(importer);
        }
      }
      return dependents;
    },
    watcher: server.watcher,
    close: () => server.close(),
  };
}
