import { PopoverContent, PopoverRoot, PopoverTrigger } from 'reka-ui';
import {
  type Component,
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
  shallowRef,
  type VNode,
} from 'vue';
import { EditorFocusScope } from '../editor-focus-scope';
import {
  CheckIcon,
  ChevronDownIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  TextIcon,
  TextQuoteIcon,
} from '../icons';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';

export type NodeType =
  | 'Text'
  | 'Title'
  | 'Subtitle'
  | 'Heading'
  | 'Bullet List'
  | 'Numbered List'
  | 'Quote'
  | 'Code';

export interface NodeSelectorItem {
  name: NodeType;
  icon: Component;
  command: () => void;
  isActive: boolean;
}

interface NodeSelectorContextValue {
  items: ComputedRef<NodeSelectorItem[]>;
  activeItem: ComputedRef<NodeSelectorItem | { name: 'Multiple' }>;
  isOpen: ComputedRef<boolean>;
  setIsOpen: (value: boolean) => void;
}

const NodeSelectorContext: InjectionKey<NodeSelectorContextValue> = Symbol(
  'vuemail.editor.nodeSelector',
);

function useNodeSelectorContext(): NodeSelectorContextValue {
  const context = inject(NodeSelectorContext, null);
  if (!context) {
    throw new Error(
      'NodeSelector compound components must be used within <NodeSelector.Root>',
    );
  }
  return context;
}

export interface NodeSelectorRootProps extends Pick<HTMLAttributes, 'class'> {
  /** Block types to exclude */
  omit?: string[];
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes, also as `@open-change` */
  onOpenChange?: (open: boolean) => void;
}

export const NodeSelectorRoot = defineComponent({
  name: 'NodeSelectorRoot',
  inheritAttrs: false,
  props: {
    /** Block types to exclude */
    omit: { type: Array as PropType<string[]>, default: () => [] },
    /** Controlled open state */
    open: { type: Boolean, default: undefined },
    /** Called when open state changes, also as `@open-change` */
    onOpenChange: {
      type: Function as PropType<(open: boolean) => void>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { attrs, slots }) {
    const bubbleMenu = useBubbleMenuContext();
    const uncontrolledOpen = shallowRef(false);

    const isControlled = computed(() => props.open !== undefined);
    const isOpen = computed(() =>
      isControlled.value ? Boolean(props.open) : uncontrolledOpen.value,
    );
    const setIsOpen = (value: boolean) => {
      if (!isControlled.value) {
        uncontrolledOpen.value = value;
      }
      props.onOpenChange?.(value);
    };

    const editorState = useEditorState({
      editor: () => bubbleMenu.editor,
      selector: ({ editor }) => ({
        isParagraphActive:
          (editor?.isActive('paragraph') ?? false) &&
          !editor?.isActive('bulletList') &&
          !editor?.isActive('orderedList'),
        isHeading1Active: editor?.isActive('heading', { level: 1 }) ?? false,
        isHeading2Active: editor?.isActive('heading', { level: 2 }) ?? false,
        isHeading3Active: editor?.isActive('heading', { level: 3 }) ?? false,
        isBulletListActive: editor?.isActive('bulletList') ?? false,
        isOrderedListActive: editor?.isActive('orderedList') ?? false,
        isBlockquoteActive: editor?.isActive('blockquote') ?? false,
        isCodeBlockActive: editor?.isActive('codeBlock') ?? false,
      }),
    });

    const allItems = computed<NodeSelectorItem[]>(() => {
      const editor = bubbleMenu.editor;
      const state = editorState.value;
      return [
        {
          name: 'Text' as const,
          icon: TextIcon,
          command: () =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .toggleNode('paragraph', 'paragraph')
              .run(),
          isActive: state?.isParagraphActive ?? false,
        },
        {
          name: 'Title' as const,
          icon: Heading1Icon,
          command: () =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .toggleHeading({ level: 1 })
              .run(),
          isActive: state?.isHeading1Active ?? false,
        },
        {
          name: 'Subtitle' as const,
          icon: Heading2Icon,
          command: () =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .toggleHeading({ level: 2 })
              .run(),
          isActive: state?.isHeading2Active ?? false,
        },
        {
          name: 'Heading' as const,
          icon: Heading3Icon,
          command: () =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .toggleHeading({ level: 3 })
              .run(),
          isActive: state?.isHeading3Active ?? false,
        },
        {
          name: 'Bullet List' as const,
          icon: ListIcon,
          command: () =>
            editor.chain().focus().clearNodes().toggleBulletList().run(),
          isActive: state?.isBulletListActive ?? false,
        },
        {
          name: 'Numbered List' as const,
          icon: ListOrderedIcon,
          command: () =>
            editor.chain().focus().clearNodes().toggleOrderedList().run(),
          isActive: state?.isOrderedListActive ?? false,
        },
        {
          name: 'Quote' as const,
          icon: TextQuoteIcon,
          command: () =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .toggleNode('paragraph', 'paragraph')
              .toggleBlockquote()
              .run(),
          isActive: state?.isBlockquoteActive ?? false,
        },
        {
          name: 'Code' as const,
          icon: CodeIcon,
          command: () =>
            editor.chain().focus().clearNodes().toggleCodeBlock().run(),
          isActive: state?.isCodeBlockActive ?? false,
        },
      ];
    });

    const items = computed(() =>
      allItems.value.filter((item) => !props.omit.includes(item.name)),
    );

    const activeItem = computed(
      () =>
        items.value.find((item) => item.isActive) ?? {
          name: 'Multiple' as const,
        },
    );

    provide(NodeSelectorContext, { items, activeItem, isOpen, setIsOpen });

    return () => {
      if (!editorState.value || items.value.length === 0) {
        return null;
      }

      return h(
        PopoverRoot,
        { open: isOpen.value, 'onUpdate:open': setIsOpen },
        () =>
          h(EditorFocusScope, null, () =>
            h(
              'div',
              {
                ...attrs,
                'data-re-node-selector': '',
                'data-open': isOpen.value ? '' : undefined,
              },
              slots.default?.(),
            ),
          ),
      );
    };
  },
});

export interface NodeSelectorTriggerProps
  extends Pick<HTMLAttributes, 'class'> {}

export const NodeSelectorTrigger = defineComponent(
  (_props: NodeSelectorTriggerProps, { slots }) => {
    const { activeItem, isOpen, setIsOpen } = useNodeSelectorContext();

    return () =>
      h(
        PopoverTrigger,
        {
          'data-re-node-selector-trigger': '',
          onClick: () => setIsOpen(!isOpen.value),
        },
        () =>
          slots.default?.() ?? [
            h('span', null, activeItem.value.name),
            h(ChevronDownIcon),
          ],
      );
  },
  {
    name: 'NodeSelectorTrigger',
    slots: Object as SlotsType<{ default?: () => VNode[] }>,
  },
);

export interface NodeSelectorContentProps
  extends Pick<HTMLAttributes, 'class'> {
  /** Popover alignment (default: "start") */
  align?: 'start' | 'center' | 'end';
}

export interface NodeSelectorContentSlots {
  /**
   * Full control over item rendering. Receives the filtered items and a
   * `close` function to dismiss the popover.
   */
  default?: (props: {
    items: NodeSelectorItem[];
    close: () => void;
  }) => VNode[];
}

export const NodeSelectorContent = defineComponent({
  name: 'NodeSelectorContent',
  props: {
    /** Popover alignment (default: "start") */
    align: {
      type: String as PropType<'start' | 'center' | 'end'>,
      default: 'start',
    },
  },
  slots: Object as SlotsType<NodeSelectorContentSlots>,
  setup(props, { slots }) {
    const { items, setIsOpen } = useNodeSelectorContext();

    const renderItems = () =>
      items.value.map((item) =>
        h(
          'button',
          {
            key: item.name,
            type: 'button',
            'data-re-node-selector-item': '',
            'data-active': item.isActive ? '' : undefined,
            onClick: () => {
              item.command();
              setIsOpen(false);
            },
          },
          [
            h(item.icon),
            h('span', null, item.name),
            item.isActive ? h(CheckIcon) : null,
          ],
        ),
      );

    return () =>
      h(
        PopoverContent,
        { align: props.align, 'data-re-node-selector-content': '' },
        () =>
          h(EditorFocusScope, null, () =>
            h(
              'div',
              null,
              slots.default
                ? slots.default({
                    items: items.value,
                    close: () => setIsOpen(false),
                  })
                : renderItems(),
            ),
          ),
      );
  },
});

export interface BubbleMenuNodeSelectorProps
  extends Pick<HTMLAttributes, 'class'> {
  /** Block types to exclude */
  omit?: string[];
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes, also as `@open-change` */
  onOpenChange?: (open: boolean) => void;
}

export interface BubbleMenuNodeSelectorSlots {
  /** Overrides the trigger content (default: active item name + chevron icon) */
  triggerContent?: () => VNode[];
}

export const BubbleMenuNodeSelector = defineComponent({
  name: 'BubbleMenuNodeSelector',
  props: {
    /** Block types to exclude */
    omit: { type: Array as PropType<string[]>, default: () => [] },
    /** Controlled open state */
    open: { type: Boolean, default: undefined },
    /** Called when open state changes, also as `@open-change` */
    onOpenChange: {
      type: Function as PropType<(open: boolean) => void>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<BubbleMenuNodeSelectorSlots>,
  setup(props, { slots }) {
    return () =>
      h(
        NodeSelectorRoot,
        {
          omit: props.omit,
          open: props.open,
          onOpenChange: props.onOpenChange,
        },
        () => [
          h(
            NodeSelectorTrigger,
            null,
            slots.triggerContent ? () => slots.triggerContent?.() : undefined,
          ),
          h(NodeSelectorContent),
        ],
      );
  },
});
