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
     *
     * Typed loosely so that `render(Email, Email.PreviewProps)` also works for
     * emails with required props.
     */
    PreviewProps?: any;
  }
}
