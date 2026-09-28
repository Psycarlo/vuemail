import { createApp, h, nextTick, ref } from 'vue';
import ResizableWrapper from './resizable-wrapper.vue';

test('tells that resizing ended when it goes away, as when leaving for the code view', async () => {
  const onResizeEnd = vi.fn();
  const shown = ref(true);
  const container = document.createElement('div');
  const app = createApp({
    render: () =>
      shown.value
        ? h(
            ResizableWrapper,
            {
              width: 600,
              height: 400,
              maxWidth: 1000,
              maxHeight: 1000,
              minWidth: 220,
              minHeight: 352,
              onResizeEnd,
            },
            () => h('iframe'),
          )
        : null,
  });
  app.mount(container);

  shown.value = false;
  await nextTick();

  expect(onResizeEnd).toHaveBeenCalledOnce();
  app.unmount();
});
