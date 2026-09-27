import { mount } from '@vue/test-utils';
import BubbleMenuLinkSelector from './link-selector.vue';

const mockEditor = {
  isActive: vi.fn().mockReturnValue(false),
  getAttributes: vi.fn().mockReturnValue({}),
  chain: vi.fn().mockReturnValue({
    focus: vi.fn().mockReturnThis(),
    unsetLink: vi.fn().mockReturnThis(),
    setLink: vi.fn().mockReturnThis(),
    extendMarkRange: vi.fn().mockReturnThis(),
    setTextSelection: vi.fn().mockReturnThis(),
    run: vi.fn(),
  }),
  state: { selection: { from: 0, to: 5 } },
  commands: { focus: vi.fn() },
  on: vi.fn(),
  off: vi.fn(),
};

vi.mock('./context', () => ({
  useBubbleMenuContext: () => ({ editor: mockEditor }),
}));

vi.mock('../../core/event-bus', () => ({
  editorEventBus: {
    on: () => ({ unsubscribe: vi.fn() }),
  },
}));

function findInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input[placeholder="Paste a link"]');
}

describe('BubbleMenuLinkSelector', () => {
  describe('uncontrolled mode (default)', () => {
    it('toggles open state on trigger click', async () => {
      const wrapper = mount(BubbleMenuLinkSelector);

      expect(findInput(wrapper).exists()).toBe(false);

      await wrapper.get('[aria-label="Add link"]').trigger('click');
      expect(findInput(wrapper).exists()).toBe(true);

      await wrapper.get('[aria-label="Add link"]').trigger('click');
      expect(findInput(wrapper).exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('controlled mode', () => {
    it('renders open when open=true', () => {
      const wrapper = mount(BubbleMenuLinkSelector, {
        props: { open: true, onOpenChange: () => {} },
      });

      expect(findInput(wrapper).exists()).toBe(true);

      wrapper.unmount();
    });

    it('renders closed when open=false', () => {
      const wrapper = mount(BubbleMenuLinkSelector, {
        props: { open: false, onOpenChange: () => {} },
      });

      expect(findInput(wrapper).exists()).toBe(false);

      wrapper.unmount();
    });

    it('calls onOpenChange when trigger is clicked', async () => {
      const onOpenChange = vi.fn();
      const wrapper = mount(BubbleMenuLinkSelector, {
        props: { open: false, onOpenChange },
      });

      await wrapper.get('[aria-label="Add link"]').trigger('click');
      expect(onOpenChange).toHaveBeenCalledWith(true);

      wrapper.unmount();
    });

    it('calls onOpenChange with false when toggling off', async () => {
      const onOpenChange = vi.fn();
      const wrapper = mount(BubbleMenuLinkSelector, {
        props: { open: true, onOpenChange },
      });

      await wrapper.get('[aria-label="Add link"]').trigger('click');
      expect(onOpenChange).toHaveBeenCalledWith(false);

      wrapper.unmount();
    });

    it('does not update internal state in controlled mode', async () => {
      const wrapper = mount(BubbleMenuLinkSelector, {
        props: { open: false, onOpenChange: () => {} },
      });

      // Click trigger — in controlled mode, open stays false unless parent updates
      await wrapper.get('[aria-label="Add link"]').trigger('click');
      expect(findInput(wrapper).exists()).toBe(false);

      // Parent updates to open
      await wrapper.setProps({ open: true });
      expect(findInput(wrapper).exists()).toBe(true);

      wrapper.unmount();
    });
  });
});
