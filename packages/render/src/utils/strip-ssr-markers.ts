/**
 * Vue's server renderer leaves comments behind that only matter for
 * hydration: `<!--[-->` and `<!--]-->` delimit fragments, `<!---->` and
 * `<!--v-if-->` stand in for branches that did not render, and teleports
 * leave their own anchors. An email is never hydrated, so these are noise.
 *
 * Only those exact comments are removed. Every other comment, most notably
 * the `<!--[if mso]>...<![endif]-->` conditionals Outlook relies on, is kept.
 */
const SSR_MARKER =
  /<!--(?:\[|\]|v-if|v-show|teleport (?:start|end)(?: anchor)?|teleport anchor)?-->/g;

const OPENING_TAG = /<[a-zA-Z][^>]*>/g;

/**
 * Scoped styles never reach an email, since Vue extracts `<style scoped>`
 * blocks at build time, so the `data-v-*` attributes they rely on are dead weight.
 */
const SCOPE_ATTRIBUTE = /\sdata-v-[0-9a-f]{8}(?:="")?(?=[\s/>])/g;

export const stripSsrMarkers = (html: string): string => {
  return html
    .replace(SSR_MARKER, '')
    .replace(OPENING_TAG, (tag) => tag.replace(SCOPE_ATTRIBUTE, ''));
};
