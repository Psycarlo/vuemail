import { Heading } from '@tiptap/extension-heading';
import { EmailNode } from './email-node';

describe('EmailNode', () => {
  it('maintains all user-defined properties from Heading', () => {
    const renderer = vi.fn(() => 'some important value');
    const CustomHeader = EmailNode.from(Heading, renderer);
    expect(CustomHeader).toBeInstanceOf(EmailNode);
    expect(Heading.config).not.toHaveProperty('renderToVueEmail');

    expect(CustomHeader.options).toStrictEqual(Heading.options);
    expect(CustomHeader.storage).toStrictEqual(Heading.storage);
    expect(CustomHeader.child).toStrictEqual(Heading.child);
    expect(CustomHeader.type).toStrictEqual(Heading.type);
    expect(CustomHeader.name).toStrictEqual(Heading.name);
    expect(CustomHeader.parent).toStrictEqual(Heading.parent);
    expect(CustomHeader.config).toHaveProperty('renderToVueEmail');

    expect(
      CustomHeader.config.renderToVueEmail(
        {} as unknown as Parameters<
          typeof CustomHeader.config.renderToVueEmail
        >[0],
      ),
    ).toBe('some important value');
    const configWithoutRender = { ...CustomHeader.config } as Record<
      string,
      unknown
    >;
    delete configWithoutRender.renderToVueEmail;
    expect(configWithoutRender).toStrictEqual(Heading.config);
  });

  it('remains an EmailNode instance and preserves renderToVueEmail after configure()', () => {
    const renderer = vi.fn(() => 'rendered');
    const CustomHeader = EmailNode.from(Heading, renderer);

    const configured = CustomHeader.configure({ levels: [1, 2] });

    expect(configured).toBeInstanceOf(EmailNode);
    expect(configured.config).toHaveProperty('renderToVueEmail');
    expect(configured.config.renderToVueEmail).toBe(renderer);
    expect(configured.name).toBe(CustomHeader.name);
  });
});
