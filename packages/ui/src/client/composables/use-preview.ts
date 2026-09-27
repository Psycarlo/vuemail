import {
  type ComputedRef,
  type InjectionKey,
  inject,
  provide,
  type Ref,
  shallowRef,
} from 'vue';
import { useRouter } from 'vue-router';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../../shared/types';
import { isChangeForEmail } from '../utils/is-change-for-email';
import { useEmailRenderingResult } from './use-email-rendering-result';
import { useHotReload } from './use-hot-reload';
import { useRenderingMetadata } from './use-rendering-metadata';

interface PreviewContext {
  renderedEmailMetadata: ComputedRef<RenderedEmailMetadata | undefined>;
  renderingResult: Ref<EmailRenderingResult>;

  /**
   * Props the preview renders with instead of the template's own
   * `PreviewProps`. `undefined` means the template defaults are used.
   */
  previewPropsOverride: Ref<Record<string, unknown> | undefined>;
  setPreviewPropsOverride: (props: Record<string, unknown> | undefined) => void;

  emailSlug: string;
}

const previewKey: InjectionKey<PreviewContext> = Symbol('preview');

/**
 * Provides the rendering of an email to the preview of it. The preview is
 * mounted again for every email, so none of this carries over to another.
 */
export function providePreview({
  emailSlug,
  serverRenderingResult,
}: {
  emailSlug: string;
  serverRenderingResult: EmailRenderingResult;
}): PreviewContext {
  const router = useRouter();

  const previewPropsOverride = shallowRef<Record<string, unknown>>();

  const renderingResult = useEmailRenderingResult(
    emailSlug,
    serverRenderingResult,
    previewPropsOverride,
  );

  const renderedEmailMetadata = useRenderingMetadata(
    emailSlug,
    renderingResult,
    serverRenderingResult,
  );

  useHotReload((changes) => {
    const changeForThisEmail = changes.find((change) =>
      isChangeForEmail(change, emailSlug),
    );

    if (changeForThisEmail?.event === 'unlink') {
      void router.push('/');
    }
  });

  const context: PreviewContext = {
    emailSlug,
    renderedEmailMetadata,
    renderingResult,
    previewPropsOverride,
    setPreviewPropsOverride: (props) => {
      previewPropsOverride.value = props;
    },
  };
  provide(previewKey, context);
  return context;
}

export const usePreviewContext = () => {
  const previewContext = inject(previewKey, undefined);

  if (typeof previewContext === 'undefined') {
    throw new Error(
      'Cannot call `usePreviewContext` outside of a `providePreview`.',
    );
  }

  return previewContext;
};
