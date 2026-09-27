// Port of the browser (playwright) spec, run in happy-dom: it mounts into the
// document and interacts through real DOM events.
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import BubbleMenuItem from './item.vue';

const icon = () => h('span', 'B');

function mountInDocument(props: { isActive: boolean; onCommand: () => void }) {
  return mount(BubbleMenuItem, {
    props: { name: 'bold', ...props },
    slots: { default: icon },
    attachTo: document.body,
  });
}

function getButton() {
  const button = document.querySelector<HTMLButtonElement>(
    'button[aria-label="bold"]',
  );
  if (!button) throw new Error('button not rendered');
  return button;
}

describe('BubbleMenuItem (browser)', () => {
  it('renders with correct aria attributes when inactive', () => {
    const wrapper = mountInDocument({ isActive: false, onCommand: () => {} });

    const button = getButton();
    expect(button.isConnected).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('false');

    wrapper.unmount();
  });

  it('sets aria-pressed when active', () => {
    const wrapper = mountInDocument({ isActive: true, onCommand: () => {} });

    expect(getButton().getAttribute('aria-pressed')).toBe('true');

    wrapper.unmount();
  });

  it('calls onCommand on click', () => {
    const onCommand = vi.fn();
    const wrapper = mountInDocument({ isActive: false, onCommand });

    const button = getButton();
    button.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true, cancelable: true }),
    );
    button.click();
    expect(onCommand).toHaveBeenCalledOnce();

    wrapper.unmount();
  });
});
