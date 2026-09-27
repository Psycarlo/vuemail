import type { PreviewConfig } from '../shared/types';

declare global {
  interface Window {
    __VUEMAIL_CONFIG__?: PreviewConfig;
  }
}

/**
 * The configuration the preview server gives the preview app. It's missing
 * while working on the preview app itself with `pnpm dev`.
 */
export const config: PreviewConfig = window.__VUEMAIL_CONFIG__ ?? {
  mode: 'development',
  version: '0.0.0',
  emailsDirectoryName: 'emails',
  workspaceId: 'development',
  hasResendApiKey: false,
  compatibilityClients: [],
};

export const isStatic = config.mode === 'static';
