const HOISTED_TITLE = /<title data-vuemail-hoist(?:="")?>([\s\S]*?)<\/title>/g;

const HEAD_OPEN = /<head(?:\s[^>]*)?>/i;

/** The `<meta>` and `<title>` elements a `<head>` starts with. */
const LEADING_METADATA =
  /^(?:\s*(?:<meta\b[^>]*>|<title\b[^>]*>[\s\S]*?<\/title>))*/i;

/**
 * Moves the titles components mark to be hoisted, like the one `<Preview>`
 * renders wherever it is used, into the `<head>`. Rendered inside of the
 * body, email clients and plain text conversion would show them as text.
 *
 * They go after the `<meta>` and `<title>` elements the `<head>` starts
 * with, which is where React hoists them to in React Email, so they come
 * before the styles.
 *
 * Without a `<head>` to move them into, they stay where they are.
 */
export const hoistTitles = (html: string): string => {
  const titles: string[] = [];
  const withoutTitles = html.replace(HOISTED_TITLE, (_match, content) => {
    titles.push(`<title>${content}</title>`);
    return '';
  });
  if (titles.length === 0) return html;

  const headOpen = HEAD_OPEN.exec(withoutTitles);
  if (!headOpen) {
    return html.replace(HOISTED_TITLE, '<title>$1</title>');
  }

  const contentStart = headOpen.index + headOpen[0].length;
  const leading =
    LEADING_METADATA.exec(withoutTitles.slice(contentStart))?.[0].length ?? 0;
  const insertAt = contentStart + leading;

  return (
    withoutTitles.slice(0, insertAt) +
    titles.join('') +
    withoutTitles.slice(insertAt)
  );
};
