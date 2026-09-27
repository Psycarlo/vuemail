/**
 * What the CLI uses from `@vuemail/ui`. It's written out here instead of
 * imported so that the two packages don't depend on each other.
 */
export interface Ui {
  version: string;
  startDevServer(options: {
    emailsDir: string;
    port: number;
    version: string;
    resendApiKey?: string;
    compatibilityClients?: string[];
  }): Promise<{ url: string; close(): Promise<void> }>;
  buildPreview(options: {
    emailsDir: string;
    outDir?: string;
    version: string;
    compatibilityClients?: string[];
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
  }): Promise<void>;
}
