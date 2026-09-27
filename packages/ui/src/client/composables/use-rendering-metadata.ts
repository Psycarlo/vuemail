import { computed, type Ref } from 'vue';
import type {
  EmailRenderingResult,
  RenderedEmailMetadata,
} from '../../shared/types';

const lastRenderingMetadataPerEmailSlug = {} as Record<
  string,
  RenderedEmailMetadata
>;

/**
 * Returns the rendering metadata if the given `renderingResult` does not
 * error. If it does error it returns the last value it had for the email.
 */
export const useRenderingMetadata = (
  emailSlug: string,
  renderingResult: Ref<EmailRenderingResult>,
  serverRenderingMetadata: EmailRenderingResult,
) =>
  computed((): RenderedEmailMetadata | undefined => {
    const result = renderingResult.value;
    if ('markup' in result) {
      lastRenderingMetadataPerEmailSlug[emailSlug] = result;
      return result;
    }

    if (
      'markup' in serverRenderingMetadata &&
      typeof lastRenderingMetadataPerEmailSlug[emailSlug] === 'undefined'
    ) {
      lastRenderingMetadataPerEmailSlug[emailSlug] = serverRenderingMetadata;
    }
    return lastRenderingMetadataPerEmailSlug[emailSlug];
  });
