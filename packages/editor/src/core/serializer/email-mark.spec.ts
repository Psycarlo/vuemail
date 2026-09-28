import { Mark } from '@tiptap/core';
import { EmailMark } from './email-mark';

const Highlight = Mark.create({
  name: 'highlight',
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  parseHTML() {
    return [{ tag: 'mark' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },
});

describe('EmailMark', () => {
  it('maintains all user-defined properties from Mark', () => {
    const renderer = vi.fn(() => 'some important value');
    const CustomHighlight = EmailMark.from(Highlight, renderer);

    expect(CustomHighlight).toBeInstanceOf(EmailMark);
    expect(Highlight.config).not.toHaveProperty('renderToVueEmail');

    expect(CustomHighlight.options).toStrictEqual(Highlight.options);
    expect(CustomHighlight.storage).toStrictEqual(Highlight.storage);
    expect(CustomHighlight.type).toStrictEqual(Highlight.type);
    expect(CustomHighlight.name).toStrictEqual(Highlight.name);
    expect(CustomHighlight.parent).toStrictEqual(Highlight.parent);
    expect(CustomHighlight.config).toHaveProperty('renderToVueEmail');

    expect(
      CustomHighlight.config.renderToVueEmail(
        {} as unknown as Parameters<
          typeof CustomHighlight.config.renderToVueEmail
        >[0],
      ),
    ).toBe('some important value');

    const configWithoutRender = { ...CustomHighlight.config } as Record<
      string,
      unknown
    >;
    delete configWithoutRender.renderToVueEmail;
    expect(configWithoutRender).toStrictEqual(Highlight.config);
  });

  it('remains an EmailMark instance and preserves renderToVueEmail after configure()', () => {
    const renderer = vi.fn(() => 'rendered');
    const CustomHighlight = EmailMark.from(Highlight, renderer);

    const configured = CustomHighlight.configure({
      HTMLAttributes: { class: 'test-mark' },
    });

    expect(configured).toBeInstanceOf(EmailMark);
    expect(configured.config).toHaveProperty('renderToVueEmail');
    expect(configured.config.renderToVueEmail).toBe(renderer);
    expect(configured.name).toBe(CustomHighlight.name);
  });

  it('can replace renderToVueEmail with extend()', () => {
    const CustomHighlight = EmailMark.from(Highlight, () => 'original');

    const extended = CustomHighlight.extend({
      renderToVueEmail: () => 'extended',
    });

    expect(extended).toBeInstanceOf(EmailMark);
    expect(
      extended.config.renderToVueEmail(
        {} as Parameters<typeof extended.config.renderToVueEmail>[0],
      ),
    ).toBe('extended');
  });
});
