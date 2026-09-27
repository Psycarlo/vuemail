import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * Whether the page is being scrolled, until 150ms after it stopped. The body
 * also gets a `scrolling` class meanwhile.
 */
export const useIsScrolling = () => {
  const isScrolling = ref(false);
  let scrollTimeout: ReturnType<typeof setTimeout> | undefined;

  const handleScroll = () => {
    document.body.classList.add('scrolling');
    isScrolling.value = true;

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('scrolling');
      isScrolling.value = false;
    }, 150);
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
    document.body.classList.remove('scrolling');
  });

  return { isScrolling };
};
