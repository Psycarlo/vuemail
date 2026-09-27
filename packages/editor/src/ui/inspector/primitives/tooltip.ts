import {
  defineComponent,
  type HTMLAttributes,
  h,
  type SlotsType,
  type VNode,
} from 'vue';

const TooltipRoot = defineComponent(
  (_props: HTMLAttributes, { slots }) => {
    return () =>
      h('span', { 'data-re-inspector-tooltip': '' }, slots.default?.());
  },
  {
    name: 'TooltipRoot',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

const TooltipTrigger = defineComponent(
  (_props: HTMLAttributes, { slots }) => {
    return () =>
      h('span', { 'data-re-inspector-tooltip-trigger': '' }, slots.default?.());
  },
  {
    name: 'TooltipTrigger',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

const TooltipContent = defineComponent(
  (_props: HTMLAttributes, { slots }) => {
    return () =>
      h('span', { 'data-re-inspector-tooltip-content': '' }, slots.default?.());
  },
  {
    name: 'TooltipContent',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export const Root = TooltipRoot;
export const Trigger = TooltipTrigger;
export const Content = TooltipContent;
