export * from '@vuemail/render';
export * from './components';

declare module 'vue' {
  interface ComponentCustomOptions {
    /**
     * The props the preview server renders this email with.
     *
     * @example
     * ```ts
     * defineOptions({
     *   PreviewProps: { username: 'alanturing' },
     * });
     * ```
     */
    PreviewProps?: Record<string, unknown>;
  }
}
