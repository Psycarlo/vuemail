const HOISTED_TITLE = /<title data-vuemail-hoist(?:="")?>([\s\S]*?)<\/title>/g;

/**
 * Moves the titles components mark to be hoisted, like the one `<Preview>`
 * renders wherever it is used, into the `<head>`. Rendered inside of the
 * body, email clients and plain text conversion would show them as text.
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

  const headEnd = withoutTitles.indexOf('</head>');
  if (headEnd === -1) {
    return html.replace(HOISTED_TITLE, '<title>$1</title>');
  }

  return (
    withoutTitles.slice(0, headEnd) +
    titles.join('') +
    withoutTitles.slice(headEnd)
  );
};
