<script lang="ts">
import { defineComponent, type PropType, type TdHTMLAttributes } from 'vue';

/**
 * A column of a `ResponsiveRow`, which renders it as an inline block that
 * wraps below the others on narrow screens. Port of the `ResponsiveColumn`
 * of `@responsive-email/react-email`, which the components of React Email's
 * website use.
 */
export default defineComponent({
  name: 'ResponsiveColumn',
  props: {
    /** How many of the row's shares of width the column takes */
    span: { type: Number, default: undefined },
    /** Attributes for the cell of the column */
    tdProps: {
      type: Object as PropType<TdHTMLAttributes>,
      default: undefined,
    },
  },
  // Rendered by its row only
  render: () => null,
});
</script>
