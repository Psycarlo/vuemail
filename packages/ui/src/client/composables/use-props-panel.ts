import {
  type ComputedRef,
  computed,
  type InjectionKey,
  inject,
  provide,
  type Ref,
  ref,
} from 'vue';
import { useCachedWorkspaceState } from './use-cached-workspace-state';

interface PropsPanelContext {
  open: ComputedRef<boolean>;
  setOpen: (open: boolean) => void;
  /**
   * False until the user toggles the panel, so restoring the remembered
   * state on load applies instantly instead of animating.
   */
  animated: Ref<boolean>;
}

const propsPanelKey: InjectionKey<PropsPanelContext> = Symbol('props-panel');

/**
 * Must be provided by the preview route, which survives navigating between
 * templates — otherwise the panel closes or replays its opening animation on
 * every navigation.
 */
export function providePropsPanel(): PropsPanelContext {
  const [cachedOpen, setCachedOpen] =
    useCachedWorkspaceState<boolean>('props-panel-open');
  // Toggles land in this state, the cached value only matters on load
  const override = ref<boolean>();
  const animated = ref(false);

  const open = computed(() => override.value ?? cachedOpen.value === true);

  const setOpen = (newOpen: boolean) => {
    animated.value = true;
    override.value = newOpen;
    setCachedOpen(newOpen);
  };

  const context = { open, setOpen, animated };
  provide(propsPanelKey, context);
  return context;
}

export function usePropsPanel(): PropsPanelContext {
  const context = inject(propsPanelKey, undefined);

  if (context === undefined) {
    throw new Error(
      'Cannot call `usePropsPanel` outside of a `providePropsPanel`.',
    );
  }

  return context;
}
