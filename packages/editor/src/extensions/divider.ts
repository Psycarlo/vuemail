import { InputRule } from '@tiptap/core';
import type { HorizontalRuleOptions } from '@tiptap/extension-horizontal-rule';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { NodeSelection, Plugin } from '@tiptap/pm/state';
import { ReplaceStep } from '@tiptap/pm/transform';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import { h } from 'vue';
import { Hr } from 'vuemail';
import { EmailNode } from '../core/serializer/email-node';
import { inlineCssToJs } from '../utils/styles';
import DividerNodeView from './divider-node-view.vue';

export type DividerOptions = HorizontalRuleOptions;

export const Divider: EmailNode<HorizontalRuleOptions, any> = EmailNode.from(
  HorizontalRule.extend({
    addAttributes() {
      return {
        class: {
          default: 'divider',
        },
      };
    },
    // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            const end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end),
            );
          },
        }),
      ];
    },
    addProseMirrorPlugins() {
      return [
        new Plugin({
          filterTransaction(tr, state) {
            const { selection } = state;
            const isDividerNodeSelection =
              selection instanceof NodeSelection &&
              selection.node.type.name === 'horizontalRule';

            if (!isDividerNodeSelection || !tr.docChanged) return true;

            const isTypingOverDivider = tr.steps.some(
              (step) =>
                step instanceof ReplaceStep && step.slice.content.size > 0,
            );

            return !isTypingOverDivider;
          },
        }),
      ];
    },
    addNodeView() {
      return VueNodeViewRenderer(DividerNodeView);
    },
  }),
  ({ node, style }) => {
    return h(Hr, {
      class: node.attrs?.class || undefined,
      style: { ...style, ...inlineCssToJs(node.attrs?.style) },
    });
  },
);
