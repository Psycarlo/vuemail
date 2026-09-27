import { type Ref, shallowRef, watch } from 'vue';
import type { EmailRenderingResult } from '../../shared/types';
import { renderEmail } from '../api';
import { isChangeForEmail } from '../utils/is-change-for-email';
import { toErrorObject } from '../utils/to-error-object';
import { useHotReload } from './use-hot-reload';

const getRenderingKey = (
  emailSlug: string,
  previewPropsOverride: Record<string, unknown> | undefined,
) =>
  previewPropsOverride === undefined
    ? emailSlug
    : `${emailSlug}\0${JSON.stringify(previewPropsOverride)}`;

/** Renders an email, failing requests included in the result as errors. */
const renderEmailSafely = async (
  emailSlug: string,
  props: Record<string, unknown> | undefined,
): Promise<EmailRenderingResult> => {
  try {
    return await renderEmail(emailSlug, props);
  } catch (exception) {
    return { error: toErrorObject(exception) };
  }
};

export const useEmailRenderingResult = (
  emailSlug: string,
  serverEmailRenderedResult: EmailRenderingResult,
  previewPropsOverride: Ref<Record<string, unknown> | undefined>,
) => {
  const renderingResult = shallowRef(serverEmailRenderedResult);

  // Only the latest render lands, so that slow renders can't overwrite
  // the ones that came after them
  let latestRender = 0;
  const rerender = async (props: Record<string, unknown> | undefined) => {
    const render = ++latestRender;
    const result = await renderEmailSafely(emailSlug, props);
    if (render === latestRender) {
      renderingResult.value = result;
    }
  };

  // The first render already covers the email with its default props;
  // re-rendering is only needed when the props change.
  let lastRenderedKey = getRenderingKey(emailSlug, undefined);
  watch(previewPropsOverride, (override) => {
    const key = getRenderingKey(emailSlug, override);
    if (key === lastRenderedKey) return;
    lastRenderedKey = key;

    void rerender(override);
  });

  // Any change can affect the email, like one to a component it imports,
  // so it renders again with the active props override to keep the props
  // editor working across a hot reload.
  useHotReload((changes) => {
    const wasDeleted = changes.some(
      (change) =>
        change.event === 'unlink' && isChangeForEmail(change, emailSlug),
    );
    // The preview goes back home when its email gets deleted
    if (wasDeleted) return;

    void rerender(previewPropsOverride.value);
  });

  return renderingResult;
};
