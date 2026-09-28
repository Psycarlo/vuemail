/**
 * What the CLI uses from `@vuemaildev/ui`. It's written out here instead of
 * imported so that the two packages don't depend on each other.
 */
export interface Ui {
  version: string;
  /** Whether an error was reported to the user already, before being thrown. */
  isReportedError(error: unknown): boolean;
  startDevServer(options: {
    emailsDir: string;
    port: number;
    version: string;
    resendApiKey?: string;
    compatibilityClients?: string[];
    vitePlugins?: string;
  }): Promise<{ url: string; close(): Promise<void> }>;
  buildPreview(options: {
    emailsDir: string;
    outDir?: string;
    version: string;
    compatibilityClients?: string[];
    vitePlugins?: string;
  }): Promise<void>;
  startPreview(options: {
    dir?: string;
    port: number;
  }): Promise<{ close(): Promise<void> }>;
  exportTemplates(options: {
    outDir: string;
    emailsDir: string;
    pretty?: boolean;
    plainText?: boolean;
    extension?: string;
    silent?: boolean;
    vitePlugins?: string;
  }): Promise<void>;
}
