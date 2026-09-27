import { mount } from '@vue/test-utils';
import { h } from 'vue';
import BubbleMenuItemGroup from './group.vue';
import BubbleMenuSeparator from './separator.vue';

describe('BubbleMenuItemGroup', () => {
  it('renders children with correct data attribute and role', () => {
    const wrapper = mount(BubbleMenuItemGroup, {
      slots: { default: () => h('button', { type: 'button' }, 'Bold') },
    });
    // A fieldset has the implicit `group` role.
    const group = wrapper.get('fieldset').element as HTMLFieldSetElement;
    expect(group).toBeDefined();
    expect(group.dataset.reBubbleMenuGroup).toBeDefined();
    expect(group.textContent).toBe('Bold');
  });

  it('applies className', () => {
    const wrapper = mount(BubbleMenuItemGroup, {
      attrs: { class: 'custom-class' },
      slots: { default: () => h('button', { type: 'button' }, 'Bold') },
    });
    const group = wrapper.get('fieldset').element;
    expect(group.className).toBe('custom-class');
  });
});

describe('BubbleMenuSeparator', () => {
  it('renders a separator with correct data attribute', () => {
    const wrapper = mount(BubbleMenuSeparator);
    // An hr has the implicit `separator` role.
    const separator = wrapper.get('hr').element as HTMLHRElement;
    expect(separator).toBeDefined();
    expect(separator.dataset.reBubbleMenuSeparator).toBeDefined();
  });

  it('applies className', () => {
    const wrapper = mount(BubbleMenuSeparator, {
      attrs: { class: 'divider' },
    });
    const separator = wrapper.get('hr').element;
    expect(separator.className).toBe('divider');
  });
});
