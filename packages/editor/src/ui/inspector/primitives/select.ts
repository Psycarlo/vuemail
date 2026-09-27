import {
  defineComponent,
  h,
  type OptionHTMLAttributes,
  type SelectHTMLAttributes,
  type SlotsType,
  type VNode,
} from 'vue';

const SelectRoot = defineComponent(
  (_props: SelectHTMLAttributes, { slots }) => {
    return () =>
      h('select', { 'data-re-inspector-select': '' }, slots.default?.());
  },
  {
    name: 'SelectRoot',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

const SelectItem = defineComponent(
  (_props: OptionHTMLAttributes, { slots }) => {
    return () => h('option', null, slots.default?.());
  },
  {
    name: 'SelectItem',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export const Root = SelectRoot;
export const Item = SelectItem;
