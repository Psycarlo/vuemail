import { computed, type MaybeRefOrGetter, ref, toValue } from 'vue';
import {
  readWorkspaceValue,
  writeWorkspaceValue,
} from '../utils/workspace-storage';
import { useWorkspaceId } from './use-workspace';

/**
 * Reads and writes a value scoped to the current Vuemail workspace,
 * persisted under the shared `vuemail-data` localStorage entry.
 *
 * - The value is read from storage again whenever the `key` changes, so
 *   switching between contexts that change it picks up the right snapshot.
 * - Callers typically seed local state from this value when they are set
 *   up, and call `setValue` alongside updating that state.
 * - Pass `undefined` to delete the entry.
 */
export const useCachedWorkspaceState = <T>(key: MaybeRefOrGetter<string>) => {
  const workspaceId = useWorkspaceId();
  // Storage isn't reactive, so writes bump this to read the value again
  const writes = ref(0);

  const value = computed(() => {
    void writes.value;
    return readWorkspaceValue<T>(workspaceId, toValue(key));
  });

  return [
    value,
    function setValue(newValue: T | undefined) {
      writeWorkspaceValue(workspaceId, toValue(key), newValue);
      writes.value++;
    },
  ] as const;
};
