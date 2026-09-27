import { onMounted, onUnmounted } from 'vue';
import type { HotReloadChange } from '../../shared/types';
import { subscribeToHotReload } from '../api';

/** Calls back with the files that changed, while the component is mounted. */
export function useHotReload(onReload: (changes: HotReloadChange[]) => void) {
  let unsubscribe: (() => void) | undefined;
  onMounted(() => {
    unsubscribe = subscribeToHotReload(onReload);
  });
  onUnmounted(() => unsubscribe?.());
}
