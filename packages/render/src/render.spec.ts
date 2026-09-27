import { defineComponent, h, inject } from 'vue';
import { render } from './render';
import Conditional from './testing/conditional.vue';
import Preview from './testing/preview.vue';
import Scoped from './testing/scoped.vue';
import Template from './testing/template.vue';

const doctype =
  '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';

describe('render', () => {
  it('converts a Vue component into HTML', async () => {
    const actualOutput = await render(Template, { firstName: 'Jim' });

    expect(actualOutput).toBe(
      `${doctype}<h1>Welcome, Jim!</h1><img alt="test" src="img/test.png"><p>Thanks for trying our product. We&#39;re thrilled to have you on board!</p>`,
    );
  });

  it('converts a VNode into HTML', async () => {
    const actualOutput = await render(h(Template, { firstName: 'Jim' }));

    expect(actualOutput).toBe(await render(Template, { firstName: 'Jim' }));
  });

  it('removes hydration markers while keeping Outlook conditional comments', async () => {
    const actualOutput = await render(Conditional, {
      items: ['one', 'two'],
      showFooter: false,
    });

    expect(actualOutput).toBe(
      `${doctype}<ul><li>one</li><li>two</li></ul><span><!--[if mso]><i>outlook only</i><![endif]--></span>`,
    );
  });

  it('removes the attributes of scoped styles', async () => {
    const actualOutput = await render(Scoped);

    expect(actualOutput).toBe(
      `${doctype}<p class="greeting">Styled with scoped CSS</p>`,
    );
  });

  it('waits for components with an async setup', async () => {
    const AsyncGreeting = defineComponent({
      async setup() {
        const name = await new Promise<string>((resolve) =>
          setTimeout(() => resolve('情報Ⅰ'), 50),
        );
        return () => h('p', `Hello, ${name}`);
      },
    });

    expect(await render(AsyncGreeting)).toBe(`${doctype}<p>Hello, 情報Ⅰ</p>`);
  });

  it('rejects when a component throws', async () => {
    const Throwing = defineComponent({
      setup() {
        throw new Error('This should be thrown by render');
      },
    });

    await expect(render(Throwing)).rejects.toThrow(
      'This should be thrown by render',
    );
  });

  it('rejects when a component with an async setup throws', async () => {
    const Failing = defineComponent({
      async setup() {
        await Promise.resolve();
        throw new Error('Could not load the data for the email');
      },
      render: () => h('p', 'never rendered'),
    });

    await expect(render(Failing)).rejects.toThrow(
      'Could not load the data for the email',
    );
  });

  it('rejects with the first error when others follow from it', async () => {
    const Failing = defineComponent({
      async setup() {
        await Promise.resolve();
        throw new Error('The first error');
      },
      render(this: { data: { name: string } }) {
        return h('p', this.data.name);
      },
    });

    await expect(render(Failing)).rejects.toThrow('The first error');
  });

  it('lets plugins be installed before rendering', async () => {
    const Greeting = defineComponent({
      setup() {
        const greeting = inject<string>('greeting');
        return () => h('p', greeting);
      },
    });

    const actualOutput = await render(
      Greeting,
      {},
      { setupApp: (app) => app.provide('greeting', 'Olá') },
    );

    expect(actualOutput).toBe(`${doctype}<p>Olá</p>`);
  });

  it('converts a Vue component into plain text', async () => {
    const actualOutput = await render(
      Template,
      { firstName: 'Jim' },
      { plainText: true },
    );

    expect(actualOutput).toBe(
      "WELCOME, JIM!\n\nThanks for trying our product. We're thrilled to have you on board!",
    );
  });

  it('skips elements marked with data-skip-in-text in plain text', async () => {
    expect(await render(Preview, {}, { plainText: true })).toBe(
      'THIS SHOULD BE RENDERED IN PLAIN TEXT',
    );
    expect(
      await render(
        Preview,
        {},
        { plainText: true, unstableTextConversion: true },
      ),
    ).toBe('This should be rendered in plain text');
  });

  it('moves the titles components mark to be hoisted into the head', async () => {
    const Email = defineComponent({
      render: () =>
        h('html', [
          h('head'),
          h('body', [
            h('title', { 'data-vuemail-hoist': '' }, 'Preview'),
            h('p', 'Hello'),
          ]),
        ]),
    });

    expect(await render(Email)).toBe(
      `${doctype}<html><head><title>Preview</title></head><body><p>Hello</p></body></html>`,
    );
    expect(await render(Email, {}, { plainText: true })).toBe('Hello');
  });

  it('prettifies the output', async () => {
    const actualOutput = await render(
      Template,
      { firstName: 'Jim' },
      { pretty: true },
    );

    expect(actualOutput).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <h1>Welcome, Jim!</h1>
      <img alt="test" src="img/test.png" />
      <p>Thanks for trying our product. We&#39;re thrilled to have you on board!</p>
      "
    `);
  });
});
