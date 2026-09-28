// React Email renders with React DOM, which leaves out an empty `src` (and an
// empty `href` anywhere but on `<a>`), and replaces `javascript:` URLs in the
// attributes that take URLs with one that throws. This does the same.

// React DOM's own pattern: browsers ignore control characters before the
// scheme and tabs or newlines within it
const isJavaScriptProtocol =
  // biome-ignore lint/suspicious/noControlCharactersInRegex: matching them is the point
  /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;

const blockedUrl =
  'javascript:throw new Error(&#39;Vuemail has blocked a javascript: URL as a security precaution.&#39;)';

const urlAttributes = new Set([
  'src',
  'href',
  'action',
  'formaction',
  'xlink:href',
]);

const entities: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const unescapeAttribute = (value: string) =>
  value.replace(/&(?:amp|lt|gt|quot|#39);/g, (entity) => entities[entity]!);

// Comments, like Outlook's conditional ones, are matched first to be left as
// they are. Vue escapes `<` and `>` in attribute values, so a tag ends at the
// first `>`.
const commentOrStartTag =
  /<!--[\s\S]*?-->|<([a-zA-Z][\w:-]*)(\s[^<>]*?)?(\/?)>/g;
// Vue renders an empty value as a bare attribute, like `src` alone
const attributePattern = /(\s)([^\s"'=<>/]+)(?:="([^"]*)")?/g;

export function sanitizeUrlAttributes(html: string): string {
  return html.replace(
    commentOrStartTag,
    (match, tag: string | undefined, attributes: string | undefined, end) => {
      if (!tag || !attributes) return match;
      const tagName = tag.toLowerCase();
      const sanitized = attributes.replace(
        attributePattern,
        (attribute, space: string, name: string, value = '') => {
          const key = name.toLowerCase();
          if (!urlAttributes.has(key)) return attribute;
          if (value === '') {
            return key === 'src' || (key === 'href' && tagName !== 'a')
              ? ''
              : attribute;
          }
          return isJavaScriptProtocol.test(unescapeAttribute(value))
            ? `${space}${name}="${blockedUrl}"`
            : attribute;
        },
      );
      return `<${tag}${sanitized}${end}>`;
    },
  );
}
