import type { HeadingOptions as TipTapHeadingOptions } from '@tiptap/extension-heading';
import { Heading as TipTapHeading } from '@tiptap/extension-heading';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { h } from 'vue';
import { Heading as EmailHeading } from 'vuemail';
import { EmailNode } from '../core/serializer/email-node';
import { getTextAlignment } from '../utils/get-text-alignment';
import { inlineCssToJs } from '../utils/styles';
import HeadingNodeView from './heading-node-view.vue';

export type HeadingOptions = TipTapHeadingOptions;

export const Heading: EmailNode<TipTapHeadingOptions, any> = EmailNode.from(
  TipTapHeading.extend({
    addNodeView() {
      return VueNodeViewRenderer(HeadingNodeView, {
        // Vue node views only render again when the node changes, but the
        // placeholder comes from the decorations, so render again when they
        // change too, like React node views do.
        update: ({
          oldNode,
          newNode,
          oldDecorations,
          newDecorations,
          oldInnerDecorations,
          innerDecorations,
          updateProps,
        }) => {
          // A new level renders another element (`h1` -> `h2`), which Vue
          // does by replacing the element holding the content, so the
          // content element ProseMirror knows would be left detached (React
          // node views move a single content element around instead): let
          // ProseMirror render the node view again for it.
          if (
            newNode.type !== oldNode.type ||
            newNode.attrs.level !== oldNode.attrs.level
          ) {
            return false;
          }

          if (
            newNode !== oldNode ||
            newDecorations !== oldDecorations ||
            innerDecorations !== oldInnerDecorations
          ) {
            updateProps();
          }

          return true;
        },
      });
    },
  }),
  ({ children, node, style }) => {
    const level = node.attrs?.level ?? 1;
    return h(
      EmailHeading,
      {
        as: `h${level}` as 'h1' | 'h2' | 'h3',
        class: node.attrs?.class || undefined,
        style: {
          ...style,
          ...inlineCssToJs(node.attrs?.style),
          ...getTextAlignment(node.attrs?.align ?? node.attrs?.alignment),
        },
      },
      () => children,
    );
  },
);
