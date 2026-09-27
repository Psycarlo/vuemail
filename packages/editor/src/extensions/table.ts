import type { ParentConfig } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import { h } from 'vue';
import { Column } from 'vuemail';
import { EmailNode } from '../core/serializer/email-node';
import {
  COMMON_HTML_ATTRIBUTES,
  createStandardAttributes,
  LAYOUT_ATTRIBUTES,
  TABLE_ATTRIBUTES,
  TABLE_CELL_ATTRIBUTES,
  TABLE_HEADER_ATTRIBUTES,
} from '../utils/attribute-helpers';
import { element } from '../utils/element';
import { inlineCssToJs, resolveConflictingStyles } from '../utils/styles';

declare module '@tiptap/core' {
  interface NodeConfig<Options, Storage> {
    /**
     * A string or function to determine the role of the table.
     * @default 'table'
     * @example () => 'table'
     */
    tableRole?:
      | string
      | ((this: {
          name: string;
          options: Options;
          storage: Storage;
          parent: ParentConfig<NodeConfig<Options>>['tableRole'];
        }) => string);
  }
}

export interface TableOptions {
  HTMLAttributes: Record<string, unknown>;
}

export const Table = EmailNode.create<TableOptions>({
  name: 'table',

  group: 'block',

  content: 'tableRow+',

  isolating: true,

  tableRole: 'table',

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'table',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

    return ['table', attrs, ['tbody', {}, 0]];
  },

  renderToVueEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    const alignment = node.attrs?.align || node.attrs?.alignment;
    const width = node.attrs?.width;

    const centeringStyles: Record<string, string> =
      alignment === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {};

    return element(
      'table',
      {
        align: alignment,
        width,
        border: 0,
        cellpadding: '0',
        cellspacing: '0',
        role: 'presentation',
        class: node.attrs?.class || undefined,
        style: resolveConflictingStyles(style, {
          ...inlineStyles,
          ...centeringStyles,
        }),
      },
      element('tbody', null, children),
    );
  },
});

export interface TableRowOptions extends Record<string, unknown> {
  HTMLAttributes?: Record<string, unknown>;
}

export const TableRow = EmailNode.create<TableRowOptions>({
  name: 'tableRow',

  group: 'tableRow',

  content: '(tableCell | tableHeader)+',

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_CELL_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'tr',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['tr', HTMLAttributes, 0];
  },

  renderToVueEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    return element(
      'tr',
      {
        class: node.attrs?.class || undefined,
        style: {
          ...style,
          ...inlineStyles,
        },
      },
      children,
    );
  },
});

export interface TableCellOptions extends Record<string, unknown> {
  HTMLAttributes?: Record<string, unknown>;
}

export const TableCell = EmailNode.create<TableCellOptions>({
  name: 'tableCell',

  group: 'tableCell',

  content: 'block+',

  isolating: true,

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_CELL_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'td',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['td', HTMLAttributes, 0];
  },

  renderToVueEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    return h(
      Column,
      {
        class: node.attrs?.class || undefined,
        align: node.attrs?.align || node.attrs?.alignment,
        style: {
          ...style,
          ...inlineStyles,
        },
      },
      () => children,
    );
  },
});

export interface TableHeaderOptions extends Record<string, unknown> {
  HTMLAttributes?: Record<string, unknown>;
}

export const TableHeader = EmailNode.create<TableHeaderOptions>({
  name: 'tableHeader',

  group: 'tableCell',

  content: 'block+',

  isolating: true,

  addAttributes() {
    return {
      ...createStandardAttributes([
        ...TABLE_HEADER_ATTRIBUTES,
        ...TABLE_CELL_ATTRIBUTES,
        ...LAYOUT_ATTRIBUTES,
        ...COMMON_HTML_ATTRIBUTES,
      ]),
    };
  },

  parseHTML() {
    return [
      {
        tag: 'th',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string> = {};

          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });

          return attrs;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['th', HTMLAttributes, 0];
  },

  renderToVueEmail({ children, node, style }) {
    const inlineStyles = inlineCssToJs(node.attrs?.style);
    return element(
      'th',
      {
        class: node.attrs?.class || undefined,
        align: node.attrs?.align || node.attrs?.alignment,
        style: {
          ...style,
          ...inlineStyles,
        },
      },
      children,
    );
  },
});
