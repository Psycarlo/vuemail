import type { Editor } from '@tiptap/core';
import type { Attrs } from '@tiptap/pm/model';
import { NodeSelection, TextSelection } from '@tiptap/pm/state';
import { Primitive } from 'reka-ui';
import {
  type ComputedRef,
  computed,
  defineComponent,
  type HTMLAttributes,
  h,
  type InjectionKey,
  inject,
  provide,
  type SlotsType,
  type VNode,
} from 'vue';
import type { NodeClickedEvent } from '../../core';
import { useCurrentEditor } from '../../email-editor/use-current-editor';
import {
  EditorFocusScope,
  EditorFocusScopeProvider,
  FocusScopeContext,
} from '../editor-focus-scope';
import { useEditorState } from '../use-editor-state';

const IGNORED_NODES = ['doc', 'text'];

function isHiddenFromHierarchy(node: {
  type: { name: string; spec: { selectable?: boolean } };
}) {
  // Skip structural/auto-wrapped nodes: doc/text wrappers plus anything the
  // schema marks as non-selectable (container, globalContent, previewText).
  return (
    IGNORED_NODES.includes(node.type.name) ||
    node.type.spec.selectable === false
  );
}

const BODY_FOCUSED: FocusedNode = {
  nodeType: 'body',
  nodeAttrs: {},
  nodePos: { pos: 0, inside: 0 },
};

export function computePathFromRoot(
  editor: Editor | null | undefined,
  target: InspectorTarget,
): FocusedNode[] {
  if (!editor) {
    return [];
  }
  // Prepend the synthetic body root unless the hierarchy already starts
  // with a real body node (only possible when source HTML had an explicit
  // <body> tag).
  const withBody = (path: FocusedNode[]) =>
    path[0]?.nodeType === 'body' ? path : [BODY_FOCUSED, ...path];

  if (typeof target === 'object') {
    if (target.nodeType === 'body') {
      return [BODY_FOCUSED];
    }
    const atPos = getHierarchyAtPosition(editor, target.nodePos.pos);
    const path = [...atPos].reverse();
    return withBody(path.length > 0 ? path : [target]);
  }
  const hierarchy = getNodeHierarchy(editor);
  return withBody(hierarchy.reverse());
}

function getHierarchyAtPosition(
  editor: Editor | null,
  pos: number,
): NodeClickedEvent[] {
  if (!editor) {
    return [];
  }

  const { doc } = editor.state;
  const hierarchy: NodeClickedEvent[] = [];

  const nodeAtPos = doc.nodeAt(pos);
  if (nodeAtPos && !isHiddenFromHierarchy(nodeAtPos)) {
    hierarchy.push({
      nodeType: nodeAtPos.type.name,
      nodeAttrs: { ...nodeAtPos.attrs },
      nodePos: { pos, inside: pos },
    });
  }

  const resolvedPos = doc.resolve(pos);
  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const node = resolvedPos.node(depth);
    const nodePos = resolvedPos.before(depth);

    if (node && !isHiddenFromHierarchy(node)) {
      const isDuplicate = hierarchy.some((h) => h.nodePos.pos === nodePos);
      if (!isDuplicate) {
        hierarchy.push({
          nodeType: node.type.name,
          nodeAttrs: { ...node.attrs },
          nodePos: { pos: nodePos, inside: nodePos },
        });
      }
    }
  }

  return hierarchy;
}

function getNodeHierarchy(editor: Editor | null): NodeClickedEvent[] {
  if (!editor) {
    return [];
  }

  const { selection } = editor.state;
  const hierarchy: NodeClickedEvent[] = [];

  if (selection instanceof NodeSelection) {
    const node = selection.node;
    if (node && !isHiddenFromHierarchy(node)) {
      hierarchy.push({
        nodeType: node.type.name,
        nodeAttrs: { ...node.attrs },
        nodePos: { pos: selection.from, inside: selection.from },
      });
    }
  }

  const { from } = selection;
  const resolvedPos = editor.state.doc.resolve(from);

  for (let depth = resolvedPos.depth; depth > 0; depth--) {
    const node = resolvedPos.node(depth);
    const pos = resolvedPos.before(depth);

    if (node && !isHiddenFromHierarchy(node)) {
      const isDuplicate = hierarchy.some((h) => h.nodePos.pos === pos);
      if (!isDuplicate) {
        hierarchy.push({
          nodeType: node.type.name,
          nodeAttrs: { ...node.attrs },
          nodePos: { pos, inside: pos },
        });
      }
    }
  }

  return hierarchy;
}

export interface FocusedNode {
  nodeType: string;
  nodeAttrs: Attrs;
  nodePos: { pos: number; inside: number };
}

export type InspectorTarget = FocusedNode | 'text';

export interface RootProps extends HTMLAttributes {
  /** Renders the only child with the inspector's attributes instead of an `<aside>`. */
  asChild?: boolean;
}

export interface InspectorContextValue {
  target: ComputedRef<InspectorTarget>;
  pathFromRoot: ComputedRef<FocusedNode[]>;
}

export const InspectorContext: InjectionKey<InspectorContextValue> = Symbol(
  'vuemail.editor.inspector',
);

export function useInspector(): InspectorContextValue {
  const context = inject(InspectorContext, null);
  if (!context) {
    throw new Error(
      'useInspector can only be called from inside the InspectorContext. This probably means you forgot the <Inspector.Provider>',
    );
  }
  return context;
}

function selectTarget(editor: Editor | null): InspectorTarget {
  if (!editor) {
    return BODY_FOCUSED;
  }

  if (!editor.isFocused) {
    return BODY_FOCUSED;
  }

  const { selection } = editor.state;

  if (selection.content().size > 0 && selection instanceof TextSelection) {
    const { $from } = selection;
    for (let depth = $from.depth; depth > 0; depth--) {
      if ($from.node(depth).type.name === 'button') {
        const pos = $from.before(depth);
        const node = editor.state.doc.nodeAt(pos);
        if (node) {
          return {
            nodeType: 'button',
            nodeAttrs: { ...node.attrs },
            nodePos: { pos, inside: pos },
          };
        }
        break;
      }
    }

    return 'text';
  }

  const hierarchy = getNodeHierarchy(editor);

  if (hierarchy.length > 0) {
    const innermost = hierarchy[0];
    const columnEntry = hierarchy.find((h) => h.nodeType === 'columnsColumn');
    const preferColumn = columnEntry && innermost.nodeType === 'paragraph';
    return preferColumn ? columnEntry : innermost;
  }

  return BODY_FOCUSED;
}

export const InspectorRoot = defineComponent({
  name: 'InspectorRoot',
  inheritAttrs: false,
  props: {
    asChild: { type: Boolean, default: false },
  },
  slots: Object as SlotsType<{ default?: () => VNode[] }>,
  setup(props, { attrs, slots }) {
    const { editor } = useCurrentEditor();
    const existingFocusScope = inject(FocusScopeContext, null);

    const target = useEditorState({
      editor,
      selector: ({ editor: currentEditor }) => selectTarget(currentEditor),
    });

    const pathFromRoot = computed(() =>
      computePathFromRoot(editor.value, target.value),
    );

    provide(InspectorContext, { target, pathFromRoot });

    return () => {
      if (editor.value) {
        const hasEmailTheming = editor.value.extensionManager.extensions.some(
          (extension) => extension.name === 'theming',
        );
        if (!hasEmailTheming) {
          throw new Error(
            'Inspector.Provider requires the EmailTheming extension. ' +
              'Add EmailTheming (or EmailTheming.configure({ ... })) to your editor extensions.',
          );
        }
      }

      const inspectorContent = h(EditorFocusScope, null, () =>
        h(
          Primitive,
          { as: 'aside', asChild: props.asChild, ...attrs, tabindex: -1 },
          slots,
        ),
      );

      return existingFocusScope
        ? inspectorContent
        : h(EditorFocusScopeProvider, null, () => inspectorContent);
    };
  },
});
