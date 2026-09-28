import { type INode, type ITag, parse, SyntaxKind } from 'html5parser';

const isTag = (node: INode | undefined, name: string): node is ITag =>
  node?.type === SyntaxKind.Tag && node.name === name;

const isBlank = (node: INode) =>
  node.type === SyntaxKind.Text && node.value.trim() === '';

/**
 * Lays a document out the way React 19 renders React Email's, and the way
 * browsers parse it anyway: whatever an `<html>` holds besides its `<head>`
 * and `<body>`, like a `<Preview>` written between `<Head />` and `<Body>`,
 * goes inside of the `<body>`, in the order it was in, and an `<html>`
 * without a `<head>` gets an empty one.
 *
 * Email clients that only keep what's inside of the `<body>` would drop that
 * content otherwise, and so would the conversion into plain text.
 */
export function normalizeDocument(html: string): string {
  if (!/<(?:html|body)[\s>]/i.test(html)) return html;

  const nodes = parse(html);
  const htmlElement = nodes.find((node) => isTag(node, 'html'));
  const children = htmlElement ? (htmlElement.body ?? []) : nodes;
  const head = children.find((node) => isTag(node, 'head'));
  const body = children.find((node) => isTag(node, 'body'));

  // A fragment is only laid out when it has a <body> to move content into
  if (!htmlElement && !body) return html;

  const stray = children.filter(
    (node) => node !== head && node !== body && !isBlank(node),
  );
  if (stray.length === 0 && (head || !htmlElement)) return html;

  const slice = (node: INode) => html.slice(node.start, node.end);
  const headHtml = head ? slice(head) : htmlElement ? '<head></head>' : '';

  let content = stray.map(slice).join('');
  if (body) {
    const before = stray.filter((node) => node.start < body.start);
    const after = stray.filter((node) => node.start > body.start);
    const bodyEnd = body.close ? body.close.start : body.end;
    content =
      html.slice(body.open.start, body.open.end) +
      before.map(slice).join('') +
      html.slice(body.open.end, bodyEnd) +
      after.map(slice).join('') +
      (body.close ? slice(body.close) : '</body>');
  }

  if (htmlElement) {
    const htmlEnd = htmlElement.close
      ? htmlElement.close.start
      : htmlElement.end;
    return (
      html.slice(0, htmlElement.open.end) +
      headHtml +
      content +
      html.slice(htmlEnd)
    );
  }

  // A fragment with a <body> but no <html>
  const start = Math.min(...children.map((node) => node.start));
  const end = Math.max(...children.map((node) => node.end));
  return html.slice(0, start) + headHtml + content + html.slice(end);
}
