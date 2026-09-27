import { marked, Renderer } from 'marked';
import { type CSSProperties, defineComponent, type HTMLAttributes } from 'vue';
import { useTailwind } from '../element';
import { h } from '../utils/h';
import { getSlotText } from '../utils/slot-text';
import { styleToString } from '../utils/style';
import { type StylesType, styles } from './styles';
import { parseCssInJsToInlineCss } from './utils/parse-css-in-js-to-inline-css';

export type MarkdownProps = HTMLAttributes & {
  /**
   * The markdown to render. When it is not given, the text of the default
   * slot is used instead, so prefer interpolating a string, as in
   * `<Markdown>{{ content }}</Markdown>`, over writing markdown straight into
   * the template, where Vue collapses its line breaks.
   */
  source?: string;
  markdownCustomStyles?: StylesType;
  markdownContainerStyles?: CSSProperties;
};

const styleAttribute = (style: CSSProperties | undefined) => {
  const inlineStyle = parseCssInJsToInlineCss(style);
  return inlineStyle !== '' ? ` style="${inlineStyle}"` : '';
};

function createRenderer(finalStyles: StylesType) {
  const renderer = new Renderer();

  renderer.blockquote = ({ tokens }) => {
    const text = renderer.parser.parse(tokens);

    return `<blockquote${styleAttribute(finalStyles.blockQuote)}>\n${text}</blockquote>\n`;
  };

  renderer.br = () => {
    return `<br${styleAttribute(finalStyles.br)} />`;
  };

  // TODO: Support all options
  renderer.code = ({ text }) => {
    text = `${text.replace(/\n$/, '')}\n`;

    return `<pre${styleAttribute(finalStyles.codeBlock)}><code>${text}</code></pre>\n`;
  };

  renderer.codespan = ({ text }) => {
    return `<code${styleAttribute(finalStyles.codeInline)}>${text}</code>`;
  };

  renderer.del = ({ tokens }) => {
    const text = renderer.parser.parseInline(tokens);

    return `<del${styleAttribute(finalStyles.strikethrough)}>${text}</del>`;
  };

  renderer.em = ({ tokens }) => {
    const text = renderer.parser.parseInline(tokens);

    return `<em${styleAttribute(finalStyles.italic)}>${text}</em>`;
  };

  renderer.heading = ({ tokens, depth }) => {
    const text = renderer.parser.parseInline(tokens);

    return `<h${depth}${styleAttribute(
      finalStyles[`h${depth}` as keyof StylesType],
    )}>${text}</h${depth}>`;
  };

  renderer.hr = () => {
    return `<hr${styleAttribute(finalStyles.hr)} />\n`;
  };

  renderer.image = ({ href, text, title }) => {
    return `<img src="${href.replaceAll('"', '&quot;')}" alt="${text.replaceAll('"', '&quot;')}"${
      title ? ` title="${title.replaceAll('"', '&quot;')}"` : ''
    }${styleAttribute(finalStyles.image)}>`;
  };

  renderer.link = ({ href, title, tokens }) => {
    const text = renderer.parser.parseInline(tokens);

    return `<a href="${href.replaceAll('"', '&quot;')}" target="_blank"${
      title ? ` title="${title.replaceAll('"', '&quot;')}"` : ''
    }${styleAttribute(finalStyles.link)}>${text}</a>`;
  };

  renderer.listitem = ({ tokens, loose }) => {
    const hasNestedList = tokens.some((token) => token.type === 'list');
    const text =
      loose || hasNestedList
        ? renderer.parser.parse(tokens)
        : renderer.parser.parseInline(tokens);

    return `<li${styleAttribute(finalStyles.li)}>${text}</li>\n`;
  };

  renderer.list = ({ items, ordered, start }) => {
    const type = ordered ? 'ol' : 'ul';
    const startAt = ordered && start !== 1 ? ` start="${start}"` : '';

    return `<${type}${startAt}${styleAttribute(
      finalStyles[ordered ? 'ol' : 'ul'],
    )}>\n${items.map((item) => renderer.listitem(item)).join('')}</${type}>\n`;
  };

  renderer.paragraph = ({ tokens }) => {
    const text = renderer.parser.parseInline(tokens);

    return `<p${styleAttribute(finalStyles.p)}>${text}</p>\n`;
  };

  renderer.strong = ({ tokens }) => {
    const text = renderer.parser.parseInline(tokens);

    return `<strong${styleAttribute(finalStyles.bold)}>${text}</strong>`;
  };

  renderer.table = ({ header, rows }) => {
    const theadRow = renderer.tablerow({
      text: header.map((cell) => renderer.tablecell(cell)).join(''),
    });

    const tbodyRows = rows
      .map((row) =>
        renderer.tablerow({
          text: row.map((cell) => renderer.tablecell(cell)).join(''),
        }),
      )
      .join('');

    const thead = `<thead${styleAttribute(finalStyles.thead)}>\n${theadRow}</thead>`;
    const tbody = `<tbody${styleAttribute(finalStyles.tbody)}>${tbodyRows}</tbody>`;

    return `<table role="presentation"${styleAttribute(finalStyles.table)}>\n${thead}\n${tbody}</table>\n`;
  };

  renderer.tablecell = ({ tokens, align, header }) => {
    const text = renderer.parser.parseInline(tokens);
    const type = header ? 'th' : 'td';
    const alignment = align ? ` align="${align}"` : '';

    return `<${type}${alignment}${styleAttribute(finalStyles.td)}>${text}</${type}>\n`;
  };

  renderer.tablerow = ({ text }) => {
    return `<tr${styleAttribute(finalStyles.tr)}>\n${text}</tr>\n`;
  };

  return renderer;
}

export const Markdown = defineComponent(
  (props: MarkdownProps, { attrs, slots }) => {
    const resolveTailwind = useTailwind();

    return () => {
      const { class: _class, style: _style, ...rest } = attrs;
      const { style, class: className } = resolveTailwind(attrs.class, [
        props.markdownContainerStyles,
        attrs.style,
      ]);
      const markdown = props.source ?? getSlotText(slots.default?.());
      const renderer = createRenderer({
        ...styles,
        ...props.markdownCustomStyles,
      });

      return h('div', {
        ...rest,
        class: className,
        innerHTML: marked.parse(markdown, { renderer, async: false }),
        'data-id': 'vuemail-markdown',
        style: styleToString(style),
      });
    };
  },
  {
    name: 'Markdown',
    inheritAttrs: false,
    props: ['source', 'markdownCustomStyles', 'markdownContainerStyles'],
  },
);
