import { computed } from 'vue';
import { useRoute } from 'vue-router';

/** The hash of the current location, as in `#L12`. */
export const useFragmentIdentifier = () => {
  const route = useRoute();
  return computed(() => route.hash);
};
