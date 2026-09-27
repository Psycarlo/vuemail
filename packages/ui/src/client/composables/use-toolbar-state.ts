import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const toolbarTabValues = [
  'linter',
  'compatibility',
  'spam-assassin',
  'resend',
] as const;

export type ToolbarTabValue = (typeof toolbarTabValues)[number];

/**
 * The toolbar's open panel lives in the `toolbar-panel` query parameter, so
 * that it survives reloads and can be linked to.
 */
export function useToolbarState() {
  const route = useRoute();
  const router = useRouter();

  const activeTab = computed(() =>
    toolbarTabValues.find((value) => value === route.query['toolbar-panel']),
  );

  /** Opens a panel of the toolbar, or collapses it with `undefined`. */
  const setActiveTab = (newValue: ToolbarTabValue | undefined) => {
    const query = { ...route.query };
    if (newValue === undefined) {
      delete query['toolbar-panel'];
    } else {
      query['toolbar-panel'] = newValue;
    }
    // The path is kept as it is, rebuilt from the params it would have the
    // slashes of the slug encoded
    void router.push({ path: route.path, query, hash: route.hash });
  };

  return {
    activeTab,
    toggled: computed(() => activeTab.value !== undefined),
    setActiveTab,
  };
}
