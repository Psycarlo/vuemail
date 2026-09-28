import { mount } from '@vue/test-utils';
import Label from './label.vue';

describe('Inspector Label', () => {
  it('renders a single label that the attributes fall through to', () => {
    const wrapper = mount(Label, {
      attrs: { for: 'padding-input', class: 'custom-label' },
      slots: { default: 'Padding' },
    });

    // A fragment root (e.g. from a comment in the template) would drop the
    // attributes in production builds
    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.element.getAttribute('for')).toBe('padding-input');
    expect(wrapper.element.getAttribute('class')).toBe('custom-label');
    expect(wrapper.element.hasAttribute('data-re-inspector-label')).toBe(true);
    expect(wrapper.text()).toBe('Padding');
  });
});
