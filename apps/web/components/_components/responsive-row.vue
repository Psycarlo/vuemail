<script lang="ts">
import {
  Comment,
  defineComponent,
  Fragment,
  h,
  type StyleValue,
  type VNode,
} from 'vue';
import ResponsiveColumn from './responsive-column.vue';

const flatten = (nodes: VNode[]): VNode[] =>
  nodes.flatMap((node) => {
    if (node.type === Fragment) return flatten(node.children as VNode[]);
    if (node.type === Comment) return [];
    return [node];
  });

const table = {
  align: 'center',
  width: '100%',
  border: 0,
  cellpadding: '0',
  cellspacing: '0',
  role: 'presentation',
};

/**
 * A row of `ResponsiveColumn`s, which sit side by side and wrap below each
 * other on narrow screens. Port of the `ResponsiveRow` of
 * `@responsive-email/react-email`, which the components of React Email's
 * website use.
 */
export default defineComponent({
  name: 'ResponsiveRow',
  inheritAttrs: false,
  props: {
    maxWidth: { type: Number, default: undefined },
    paddingTop: { type: Number, default: undefined },
    paddingRight: { type: Number, default: undefined },
    paddingBottom: { type: Number, default: undefined },
    paddingLeft: { type: Number, default: undefined },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const children = flatten(slots.default?.() ?? []);
      const spans = children
        .filter((child) => child.type === ResponsiveColumn)
        .map((column) => Number(column.props?.span ?? 1));
      if (spans.length > 3) {
        console.warn(
          "You've exceeded the recommended 3-column limit in your email template. Consider sticking to a maximum of 3 columns for best practice.",
        );
      }
      const totalSpan = spans.reduce((total, span) => total + span, 0);
      const paddingLeft = props.paddingLeft ?? 0;
      // Like the original, which takes the left padding for both sides
      const paddingRight = props.paddingLeft ?? 0;
      const spanWidth =
        (props.maxWidth ?? 600 - paddingLeft - paddingRight) / totalSpan;

      const { style, ...rowAttrs } = attrs;
      return h(
        'table',
        {
          ...table,
          ...rowAttrs,
          style: [{ textAlign: 'center', fontSize: '0' }, style as StyleValue],
        },
        h(
          'tbody',
          h(
            'tr',
            h(
              'td',
              {
                style: {
                  padding: `${props.paddingTop ?? 0}px ${props.paddingRight ?? 0}px ${props.paddingBottom ?? 0}px ${props.paddingLeft ?? 0}px`,
                },
              },
              children.map((child) => {
                if (child.type !== ResponsiveColumn) return child;
                const {
                  span,
                  style: columnStyle,
                  tdProps,
                  'td-props': tdPropsKebab,
                  ...columnAttrs
                } = child.props ?? {};
                const slot = (child.children as { default?: () => VNode[] })
                  ?.default;
                return h(
                  'table',
                  {
                    ...table,
                    ...columnAttrs,
                    style: [
                      {
                        maxWidth: `${spanWidth * Number(span ?? 1)}px`,
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: '16px',
                        boxSizing: 'border-box',
                      },
                      columnStyle as StyleValue,
                    ],
                  },
                  h(
                    'tbody',
                    h('tr', h('td', tdProps ?? tdPropsKebab, slot?.())),
                  ),
                );
              }),
            ),
          ),
        ),
      );
    };
  },
});
</script>
