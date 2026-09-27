import { mount } from '@vue/test-utils';
import { h } from 'vue';
import BubbleMenuItem from './item.vue';

const icon = () => h('span', 'B');

describe('BubbleMenuItem', () => {
  it('renders a button with correct aria attributes when inactive', () => {
    const onCommand = vi.fn();
    const wrapper = mount(BubbleMenuItem, {
      props: { name: 'bold', isActive: false, onCommand },
      slots: { default: icon },
    });

    const button = wrapper.get('button[aria-label="bold"]')
      .element as HTMLButtonElement;
    expect(button).toBeDefined();
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.dataset.reBubbleMenuItem).toBeDefined();
    expect(button.dataset.item).toBe('bold');
    expect(button.dataset.active).toBeUndefined();
  });

  it('sets data-active and aria-pressed when active', () => {
    const wrapper = mount(BubbleMenuItem, {
      props: { name: 'bold', isActive: true, onCommand: () => {} },
      slots: { default: icon },
    });

    const button = wrapper.get('button[aria-label="bold"]')
      .element as HTMLButtonElement;
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.dataset.active).toBeDefined();
  });

  it('calls onCommand on click', async () => {
    const onCommand = vi.fn();
    const wrapper = mount(BubbleMenuItem, {
      props: { name: 'bold', isActive: false, onCommand },
      slots: { default: icon },
    });

    await wrapper.get('button[aria-label="bold"]').trigger('click');
    expect(onCommand).toHaveBeenCalledOnce();
  });

  it('accepts the command handler as a listener', async () => {
    const onCommand = vi.fn();
    const wrapper = mount({
      render: () =>
        h(BubbleMenuItem, { name: 'bold', isActive: false, onCommand }, icon),
    });

    await wrapper.get('button').trigger('click');
    expect(onCommand).toHaveBeenCalledOnce();
  });

  it('prevents the default of mousedown to keep the editor selection', async () => {
    const wrapper = mount(BubbleMenuItem, {
      props: { name: 'bold', isActive: false, onCommand: () => {} },
      slots: { default: icon },
    });

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });
    wrapper.get('button').element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('applies className', () => {
    const wrapper = mount(BubbleMenuItem, {
      props: { name: 'bold', isActive: false, onCommand: () => {} },
      attrs: { class: 'custom' },
      slots: { default: icon },
    });

    expect(wrapper.get('button[aria-label="bold"]').element.className).toBe(
      'custom',
    );
  });

  it('spreads additional button props', () => {
    const wrapper = mount(BubbleMenuItem, {
      props: { name: 'bold', isActive: false, onCommand: () => {} },
      attrs: { 'data-testid': 'custom-button', disabled: true },
      slots: { default: icon },
    });

    const button = wrapper.get('[data-testid="custom-button"]').element;
    expect(button).toBeDefined();
    expect(button.getAttribute('disabled')).toBe('');
  });
});
