import {
  type Component,
  defineComponent,
  type HTMLAttributes,
  h,
  type SlotsType,
  type VNode,
} from 'vue';
import { useEditorState } from '../use-editor-state';
import { useBubbleMenuContext } from './context';
import BubbleMenuItem from './item.vue';

/**
 * Props of the pre-wired bubble menu items. The default slot overrides the
 * default icon.
 */
export interface PreWiredItemProps extends Pick<HTMLAttributes, 'class'> {}

interface MarkBubbleItemConfig {
  name: string;
  activeName: string;
  activeParams?: Record<string, unknown>;
  command: string;
  icon: Component;
}

export function createMarkBubbleItem(config: MarkBubbleItemConfig) {
  return defineComponent(
    (_props: PreWiredItemProps, { slots }) => {
      const context = useBubbleMenuContext();

      const isActive = useEditorState({
        editor: () => context.editor,
        selector: ({ editor }) => {
          if (config.activeParams) {
            return (
              editor?.isActive(config.activeName, config.activeParams) ?? false
            );
          }
          return editor?.isActive(config.activeName) ?? false;
        },
      });

      const handleCommand = () => {
        const chain = context.editor.chain().focus();
        const method = (chain as unknown as Record<string, () => typeof chain>)[
          config.command
        ];
        if (method) {
          method.call(chain).run();
        }
      };

      return () =>
        h(
          BubbleMenuItem,
          {
            name: config.name,
            isActive: isActive.value,
            onCommand: handleCommand,
          },
          () => slots.default?.() ?? h(config.icon),
        );
    },
    {
      name: `BubbleMenu${config.name.charAt(0).toUpperCase() + config.name.slice(1)}`,
      slots: Object as SlotsType<{ default?: () => VNode[] }>,
    },
  );
}
