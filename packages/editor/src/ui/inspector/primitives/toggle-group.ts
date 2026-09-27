import {
  type ButtonHTMLAttributes,
  type ComputedRef,
  computed,
  defineComponent,
  type HTMLAttributes,
  h,
  type InjectionKey,
  inject,
  type PropType,
  provide,
  type SlotsType,
  type VNode,
} from 'vue';

export interface RootProps extends Pick<HTMLAttributes, 'class'> {
  value: string;
  /** Called with the value of the item clicked, also as `@value-change`. */
  onValueChange: (value: string) => void;
}

export interface ItemProps extends ButtonHTMLAttributes {
  value: string;
}

const ToggleGroupContext: InjectionKey<{
  value: ComputedRef<string>;
  onValueChange: (value: string) => void;
}> = Symbol('vuemail.editor.inspector.toggleGroup');

function callHandlers(handlers: unknown, event: MouseEvent) {
  for (const handler of Array.isArray(handlers) ? handlers : [handlers]) {
    if (typeof handler === 'function') {
      handler(event);
    }
  }
}

export const Root = defineComponent({
  name: 'ToggleGroupRoot',
  props: {
    value: { type: String, required: true },
    onValueChange: {
      type: Function as PropType<(value: string) => void>,
      required: true,
    },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { slots }) {
    provide(ToggleGroupContext, {
      value: computed(() => props.value),
      onValueChange: (value) => props.onValueChange(value),
    });

    return () =>
      h(
        'div',
        { 'data-re-inspector-toggle-group': '', role: 'group' },
        slots.default?.(),
      );
  },
});

export const Item = defineComponent({
  name: 'ToggleGroupItem',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { attrs, slots }) {
    const context = inject(ToggleGroupContext, null);

    return () => {
      const isActive = context?.value.value === props.value;
      return h(
        'button',
        {
          type: 'button',
          'data-re-inspector-toggle-item': '',
          'data-active': isActive ? '' : undefined,
          'aria-pressed': isActive,
          ...attrs,
          onClick: (event: MouseEvent) => {
            context?.onValueChange(props.value);
            callHandlers(attrs.onClick, event);
          },
        },
        slots.default?.(),
      );
    };
  },
});
