import { pretty } from '@vuemail/render';
import plugin from 'tailwindcss/plugin';
import { defineComponent, h } from 'vue';
import { Body } from '../body';
import { Button } from '../button';
import { Column } from '../column';
import { Head } from '../head';
import { Heading } from '../heading';
import { Hr } from '../hr';
import { Html } from '../html';
import { Link } from '../link';
import { Row } from '../row';
import { Section } from '../section';
import { renderMarkup } from '../utils/render-markup';
import Brand from './fixtures/brand.vue';
import CallToAction from './fixtures/call-to-action.vue';
import Card from './fixtures/card.vue';
import WelcomeEmail from './fixtures/welcome-email.vue';
import { Tailwind, type TailwindConfig } from './tailwind';

const headMissingError =
  'Tailwind: <head> not found inside <Tailwind>.\nMove <Head /> inside <Tailwind>, or remove these classes that require a <head>:';

const tailwind = (
  children: () => unknown,
  props: Record<string, unknown> = {},
) => h(Tailwind, props, children as () => never);

describe('<Tailwind> component', () => {
  it('renders children with inline Tailwind styles', async () => {
    expect(
      await renderMarkup(tailwind(() => h('div', { class: 'bg-white' }))),
    ).toBe('<div style="background-color:rgb(255,255,255)"></div>');
  });

  it("doesn't generate styles from text", async () => {
    expect(
      await renderMarkup(tailwind(() => 'container bg-red-500 bg-blue-300')),
    ).toBe('container bg-red-500 bg-blue-300');
  });

  it('computes the Outlook fallbacks of <Button> from its Tailwind classes', async () => {
    expect(
      await renderMarkup(
        tailwind(() => [
          h(
            Button,
            {
              class:
                'mt-8 rounded-md bg-blue-600 px-3 py-2 text-gray-200 text-sm',
            },
            () => 'Testing button',
          ),
          'Testing',
        ]),
      ),
    ).toBe(
      '<a style="line-height:1.4285714285714286;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;margin-top:2rem;border-radius:0.375rem;background-color:rgb(21,93,252);padding-right:12px;padding-left:12px;padding-bottom:8px;padding-top:8px;color:rgb(229,231,235);font-size:0.875rem" target="_blank"><span><!--[if mso]><i style="mso-font-width:300%;mso-text-raise:12px" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:6px">Testing button</span><span><!--[if mso]><i style="mso-font-width:300%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a>Testing',
    );
  });

  it('computes the Outlook fallbacks of a <Button> rendered by a component of your own', async () => {
    const html = await renderMarkup(
      tailwind(() => h(CallToAction, null, () => 'Get started')),
    );

    expect(html).toContain(
      'padding-right:12px;padding-left:12px;padding-bottom:8px;padding-top:8px',
    );
    expect(html).toContain('mso-font-width:300%;mso-text-raise:12px');
    expect(html).not.toContain('class=');
  });

  it('inlines the classes of your own components, with the style they give winning', async () => {
    expect(await renderMarkup(tailwind(() => h(Card)))).toBe(
      '<div style="color:rgb(81,162,255);background-color:rgb(251,44,54);padding:4px"></div>',
    );
  });

  it('inlines the classes given to your own components, which Vue passes to their root element', async () => {
    expect(
      await renderMarkup(
        tailwind(() => h(Card, { class: 'mt-2' }, () => 'Hi')),
      ),
    ).toBe(
      '<div style="color:rgb(81,162,255);background-color:rgb(251,44,54);margin-top:0.5rem;padding:4px">Hi</div>',
    );
  });

  it('works with components that render multiple root nodes', async () => {
    expect(
      await renderMarkup(
        tailwind(() => [
          h('div', { class: 'mt-[100px] text-[50px] leading-[1]' }, 'Hello'),
          h(Brand),
        ]),
      ),
    ).toBe(
      '<div style="margin-top:100px;font-size:50px;line-height:1">Hello</div><div style="padding:20px"><p style="font-weight:700;font-size:50px">Vuemail</p></div><div style="padding:20px"><p style="font-weight:700;font-size:50px">Vuemail</p></div>',
    );
  });

  it("works properly with 'no-underline'", async () => {
    const html = await renderMarkup(
      h(Html, null, () =>
        h('body', null, [
          tailwind(() =>
            h('p', { class: 'text-[14px] text-black leading-[24px]' }, [
              'or copy and paste this URL into your browser: ',
              h(
                Link,
                {
                  class: 'other text-blue-600 no-underline',
                  href: 'https://vuemail.dev',
                },
                () => 'https://vuemail.dev',
              ),
            ]),
          ),
        ]),
      ),
    );

    expect(html).toBe(
      '<html dir="ltr" lang="en"><body><p style="font-size:14px;color:rgb(0,0,0);line-height:24px">or copy and paste this URL into your browser: <a href="https://vuemail.dev" class="other" style="color:rgb(21,93,252);text-decoration-line:none" target="_blank">https://vuemail.dev</a></p></body></html>',
    );
  });

  it('works with Heading component', async () => {
    expect(
      await renderMarkup(
        tailwind(() => [
          'Hello',
          h(Heading, null, () => 'My testing heading'),
          'friends',
        ]),
      ),
    ).toBe('Hello<h1>My testing heading</h1>friends');
  });

  it('routes Tailwind padding on <Section> to the inner <td>', async () => {
    const html = await renderMarkup(
      tailwind(() => h(Section, { class: 'bg-white p-4' }, () => 'x')),
    );

    expect(html).toContain('<td style="padding:1rem">');
    expect(html).not.toMatch(/<table[^>]*style="[^"]*padding:1rem/);
  });

  it('routes responsive padding classes on <Section> to the inner <td>', async () => {
    expect(
      await renderMarkup(
        tailwind(() => [
          h(Head),
          h(
            Section,
            { class: 'max-sm:px-5 max-sm:bg-red-500 px-9' },
            () => 'x',
          ),
        ]),
      ),
    ).toBe(
      '<head><style>@media (max-width:40rem){.max-sm_bg-red-500{background-color:rgb(251,44,54)!important}}@media (max-width:40rem){.max-sm_px-5{padding-right:1.25rem!important;padding-left:1.25rem!important}}</style><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"><meta name="x-apple-disable-message-reformatting"></head><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="max-sm_bg-red-500"><tbody><tr><td class="max-sm_px-5" style="padding-right:2.25rem;padding-left:2.25rem">x</td></tr></tbody></table>',
    );
  });

  it('inlines Tailwind classes on <Column> and <Row>', async () => {
    const html = await renderMarkup(
      tailwind(() =>
        h(Row, { class: 'bg-white p-2' }, () =>
          h(Column, { class: 'p-4' }, () => 'x'),
        ),
      ),
    );

    expect(html).toMatch(
      /<table[^>]*role="presentation"[^>]*style="[^"]*padding:0.5rem/,
    );
    expect(html).toMatch(
      /<td data-id="__vuemail-column" style="padding:1rem">/,
    );
  });

  it('uses background image', async () => {
    expect(
      await renderMarkup(
        tailwind(() =>
          h('div', { class: 'bg-[url(https://example.com/image.png)]' }),
        ),
      ),
    ).toBe(
      '<div style="background-image:url(https://example.com/image.png)"></div>',
    );
  });

  it('does not override inline styles with Tailwind styles', async () => {
    expect(
      await renderMarkup(
        tailwind(() =>
          h('div', {
            class: 'bg-black text-[16px]',
            style: { backgroundColor: 'red', fontSize: '12px' },
          }),
        ),
      ),
    ).toBe('<div style="background-color:red;font-size:12px"></div>');
  });

  it('overrides component styles with Tailwind styles', async () => {
    expect(await renderMarkup(tailwind(() => h(Hr, { class: 'w-12' })))).toBe(
      '<hr style="width:3rem;border:none;border-color:transparent;border-top:1px solid #eaeaea">',
    );
  });

  it('works with shadows', async () => {
    expect(
      await renderMarkup(
        tailwind(() =>
          h('div', { class: 'shadow-[#555] shadow' }, 'shadow around here'),
        ),
      ),
    ).toBe(
      '<div style="box-shadow:0 0 rgb(0,0,0,0),0 0 rgb(0,0,0,0),0 0 rgb(0,0,0,0),0 0 rgb(0,0,0,0),0 1px 3px 0 rgb(85,85,85,100%),0 1px 2px -1px rgb(85,85,85,100%)">shadow around here</div>',
    );
  });

  it('only uses the variables of the classes an element has', async () => {
    const html = await renderMarkup(
      tailwind(() => [
        h('div', { class: 'shadow-[#555] shadow' }),
        h('div', { class: 'shadow' }),
      ]),
    );

    expect(html).toContain('rgb(85,85,85,100%)');
    expect(html.split('rgb(85,85,85,100%)')).toHaveLength(3);
  });

  it('works with blocklist', async () => {
    expect(
      await renderMarkup(
        tailwind(
          () => [
            h(Head),
            h(
              'button',
              { type: 'button', class: 'bg-blue-600 md:p-4' },
              'Click me',
            ),
          ],
          { config: { blocklist: ['bg-blue-600'] } satisfies TailwindConfig },
        ),
      ),
    ).toBe(
      '<head><style>@media (min-width:48rem){.md_p-4{padding:1rem!important}}</style><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"><meta name="x-apple-disable-message-reformatting"></head><button type="button" class="bg-blue-600 md_p-4">Click me</button>',
    );
  });

  it('preserves mso styles', async () => {
    const html = await renderMarkup(
      h(Html, null, () =>
        tailwind(() => [
          h(Head),
          h('span', {
            innerHTML:
              '<!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]-->',
          }),
          h('div', {
            class: 'custom-class bg-white sm:bg-red-50 sm:text-sm md:text-lg',
          }),
        ]),
      ),
    );

    expect(html).toContain(
      '<span><!--[if mso]><i style="letter-spacing: 10px;mso-font-width:-100%;" hidden>&nbsp;</i><![endif]--></span>',
    );
    expect(html).toContain(
      '<div class="custom-class sm_bg-red-50 sm_text-sm md_text-lg" style="background-color:rgb(255,255,255)"></div>',
    );
    expect(html).toContain(
      '<style>@media (min-width:40rem){.sm_bg-red-50{background-color:rgb(254,242,242)!important}}@media (min-width:40rem){.sm_text-sm{font-size:0.875rem!important;line-height:1.4285714285714286!important}}@media (min-width:48rem){.md_text-lg{font-size:1.125rem!important;line-height:1.5555555555555556!important}}</style>',
    );
  });

  // See https://github.com/resend/react-email/issues/2388
  it('properly does not inline custom utilities', async () => {
    const html = await renderMarkup(
      tailwind(
        () =>
          h(Html, null, () => [
            h(Head),
            h(Body, { class: 'text-body' }, () => 'this is the body'),
          ]),
        {
          config: {
            plugins: [
              plugin(({ addUtilities }) => {
                addUtilities({
                  '.text-body': {
                    '@apply text-[green] dark:text-[orange]': {},
                  },
                });
              }),
            ],
          } satisfies TailwindConfig,
        },
      ),
    );

    expect(html).toContain(
      '<style>@media (prefers-color-scheme:dark){.text-body{color:orange!important}}</style>',
    );
    expect(html).toContain('<body class="text-body" dir="ltr" lang="en">');
    expect(html).toContain('<td dir="ltr" lang="en" style="color:green">');
  });

  it('does not key rules by the group marker class', async () => {
    const html = await renderMarkup(
      h(Html, null, () =>
        tailwind(() => [
          h(Head),
          h('div', { class: 'group' }, [
            h(
              'a',
              { class: 'group-hover:underline', href: 'https://vuemail.dev' },
              'link',
            ),
          ]),
        ]),
      ),
    );

    expect(html).toContain('<div class="group">');
    expect(html).toContain(
      '<a class="group-hover_underline" href="https://vuemail.dev">link</a>',
    );
    const style = html.match(/<style>(.*?)<\/style>/)?.[1];
    expect(style).toBe(
      '@media (hover:hover){.group-hover_underline:is(:where(.group):hover *){text-decoration-line:underline!important}}',
    );
  });

  it('recognizes custom responsive screens', async () => {
    const html = await renderMarkup(
      h(Html, null, () =>
        tailwind(
          () => [
            h(Head),
            h('div', { class: 'bg-red-100 xl:bg-green-500' }, 'Test'),
            h('div', { class: '2xl:bg-blue-500' }, 'Test'),
          ],
          {
            config: {
              theme: {
                screens: {
                  sm: { min: '640px' },
                  md: { min: '768px' },
                  lg: { min: '1024px' },
                  xl: { min: '1280px' },
                  '2xl': { min: '1536px' },
                },
              },
            } satisfies TailwindConfig,
          },
        ),
      ),
    );

    expect(html).toContain(
      '<style>@media (min-width:1280px){.xl_bg-green-500{background-color:rgb(0,201,80)!important}}@media (min-width:1536px){.twoxl_bg-blue-500{background-color:rgb(43,127,255)!important}}</style>',
    );
    expect(html).toContain(
      '<div class="xl_bg-green-500" style="background-color:rgb(255,226,226)">Test</div><div class="twoxl_bg-blue-500">Test</div>',
    );
  });

  it('works with calc() with + sign', async () => {
    const html = await renderMarkup(
      tailwind(() => [
        h('head'),
        h(
          'div',
          {
            class:
              'max-h-[calc(50px+3rem)] bg-red-100 lg:max-h-[calc(50px+5rem)]',
          },
          [h('div', { class: 'h-[200px]' }, 'something tall')],
        ),
      ]),
    );

    expect(html).toBe(
      '<head><style>@media (min-width:64rem){.lg_max-h-calc50pxplus5rem{max-height:calc(50px + 5rem)!important}}</style></head><div class="lg_max-h-calc50pxplus5rem" style="max-height:calc(50px + 3rem);background-color:rgb(255,226,226)"><div style="height:200px">something tall</div></div>',
    );
  });

  it("only adds the styles a render uses to its <head>, even with what's cached from other renders", async () => {
    const withResponsiveClass = await renderMarkup(
      tailwind(() => [h(Head), h('p', { class: 'text-sm sm:text-lg' }, 'A')]),
    );
    const withoutResponsiveClass = await renderMarkup(
      tailwind(() => [h(Head), h('p', { class: 'text-sm' }, 'B')]),
    );
    const withResponsiveClassAgain = await renderMarkup(
      tailwind(() => [h(Head), h('p', { class: 'text-sm sm:text-lg' }, 'A')]),
    );

    expect(withResponsiveClass).toContain('.sm_text-lg');
    expect(withoutResponsiveClass).not.toContain('<style>');
    expect(withResponsiveClassAgain).toBe(withResponsiveClass);
  });

  it('keeps the order Tailwind gives rules, whatever order the classes show up in', async () => {
    const html = await renderMarkup(
      tailwind(() => [
        h(Head),
        h(Section, { class: 'md:p-4' }, () => 'first'),
        h(Section, { class: 'sm:p-2 md:p-4' }, () => 'second'),
      ]),
    );

    const style = html.match(/<style>(.*?)<\/style>/)?.[1] ?? '';
    expect(style.indexOf('.sm_p-2')).toBeGreaterThan(-1);
    expect(style.indexOf('.sm_p-2')).toBeLessThan(style.indexOf('.md_p-4'));
  });

  describe('with non-inlinable styles', () => {
    it('works with <head> elements deep inside of it, including ones rendered by your own components', async () => {
      const MyHead = defineComponent({
        setup:
          (_, { attrs }) =>
          () =>
            h('head', attrs),
      });

      const html = await renderMarkup(
        tailwind(() =>
          h('html', { lang: 'en' }, [
            h(MyHead),
            h('body', null, [
              h('div', {
                class: 'bg-red-200 sm:bg-red-300 md:bg-red-400 lg:bg-red-500',
              }),
            ]),
          ]),
        ),
      );

      expect(html).toBe(
        '<html lang="en"><head><style>@media (min-width:40rem){.sm_bg-red-300{background-color:rgb(255,162,162)!important}}@media (min-width:48rem){.md_bg-red-400{background-color:rgb(255,100,103)!important}}@media (min-width:64rem){.lg_bg-red-500{background-color:rgb(251,44,54)!important}}</style></head><body><div class="sm_bg-red-300 md_bg-red-400 lg_bg-red-500" style="background-color:rgb(255,201,201)"></div></body></html>',
      );
    });

    it('handles non-inlinable styles in custom utilities', async () => {
      const html = await renderMarkup(
        h('html', { lang: 'en' }, [
          tailwind(
            () => [
              h('head'),
              h('body', null, [h('div', { class: 'text-body' })]),
            ],
            {
              config: {
                plugins: [
                  plugin(({ addUtilities }) => {
                    addUtilities({
                      '.text-body': {
                        '@apply text-[green] sm:text-[darkgreen]': {},
                      },
                    });
                  }),
                ],
              } satisfies TailwindConfig,
            },
          ),
        ]),
      );

      expect(html).toBe(
        '<html lang="en"><head><style>@media (min-width:40rem){.text-body{color:darkgreen!important}}</style></head><body><div class="text-body" style="color:green"></div></body></html>',
      );
    });

    it('adds css to <head/> and keep class names', async () => {
      const html = await renderMarkup(
        h('html', { lang: 'en' }, [
          tailwind(() => [
            h('head'),
            h('body', null, [
              h('div', {
                class:
                  'bg-red-200 hover:bg-red-600 focus:bg-red-700 sm:bg-red-300 sm:hover:bg-red-200 md:bg-red-400 lg:bg-red-500',
              }),
            ]),
          ]),
        ]),
      );

      expect(html).toContain(
        '<div class="hover_bg-red-600 focus_bg-red-700 sm_bg-red-300 sm_hover_bg-red-200 md_bg-red-400 lg_bg-red-500" style="background-color:rgb(255,201,201)"></div>',
      );
      const style = html.match(/<style>(.*?)<\/style>/)?.[1] ?? '';
      expect(style).toContain('.hover_bg-red-600:hover');
      expect(style).toContain('.focus_bg-red-700:focus');
      expect(style).toContain(
        '@media (min-width:64rem){.lg_bg-red-500{background-color:rgb(251,44,54)!important}}',
      );
      expect(style).not.toMatch(/@media \(width/);
    });

    it('throws when there is no <head> and classes deep inside of components need it', async () => {
      const Component1 = defineComponent({
        setup:
          (_, { slots }) =>
          () =>
            h('div', { class: 'h-30 w-40 sm:h-10 sm:w-10' }, slots.default?.()),
      });
      const Component2 = defineComponent({
        setup:
          (_, { slots }) =>
          () =>
            h(
              'div',
              null,
              h(Component1, null, () => slots.default?.()),
            ),
      });

      await expect(
        renderMarkup(
          tailwind(() =>
            h('div', { class: 'bg-red-300' }, [
              h(Component2, { class: 'random-classname w-full' }, () =>
                h('div', { class: 'w-50' }, 'Testing'),
              ),
            ]),
          ),
        ),
      ).rejects.toThrow(`${headMissingError} sm:h-10 sm:w-10.`);
    });

    it('throws a clear error when <Head> is outside <Tailwind> and dark: classes are used', async () => {
      await expect(
        renderMarkup(
          h(Html, null, () => [
            h(Head),
            tailwind(() =>
              h(
                Body,
                { class: 'dark:bg-white dark:text-gray-100' },
                () => 'this is the body',
              ),
            ),
          ]),
        ),
      ).rejects.toThrow(
        `${headMissingError} dark:bg-white dark:text-gray-100.`,
      );
    });

    it('persists existing <head/> elements', async () => {
      const html = await renderMarkup(
        h('html', { lang: 'en' }, [
          tailwind(() => [
            h('head', null, [h('style'), h('link')]),
            h('body', null, [h('div', { class: 'bg-red-200 sm:bg-red-500' })]),
          ]),
        ]),
      );

      expect(html).toBe(
        '<html lang="en"><head><style>@media (min-width:40rem){.sm_bg-red-500{background-color:rgb(251,44,54)!important}}</style><style></style><link></head><body><div class="sm_bg-red-500" style="background-color:rgb(255,201,201)"></div></body></html>',
      );
    });
  });

  describe('with an email written as a single file component', () => {
    it('inlines everything, including what its own components render', async () => {
      const html = await pretty(
        await renderMarkup(
          h(WelcomeEmail, { name: 'Ana', steps: ['Sign up', 'Say hi'] }),
        ),
      );

      expect(html).toMatchInlineSnapshot(`
        "<html dir="ltr" lang="en">
          <head>
            <style>
              @media (min-width:40rem){.sm_px-10{padding-right:2.5rem!important;padding-left:2.5rem!important}}
            </style>
            <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
            <meta name="x-apple-disable-message-reformatting" />
            <title>Welcome, Ana</title>
          </head>
          <div
            data-skip-in-text="true"
            style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
            Welcome, Ana
            <div>
               ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
            </div>
          </div>
          <body dir="ltr" lang="en" style="background-color:rgb(255,255,255)">
            <table
              border="0"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              align="center">
              <tbody>
                <tr>
                  <td
                    dir="ltr"
                    lang="en"
                    style='background-color:rgb(255,255,255);font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"'>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="max-width:37.5em;margin-right:auto;margin-left:auto">
                      <tbody>
                        <tr style="width:100%">
                          <td
                            class="sm_px-10"
                            style="padding-right:1.25rem;padding-left:1.25rem">
                            <p
                              style="font-size:1.125rem;line-height:1.5555555555555556;color:rgb(16,24,40);margin-top:16px;margin-bottom:16px">
                              Hi Ana,
                            </p>
                            <table
                              align="center"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation">
                              <tbody>
                                <tr>
                                  <td style="padding-bottom:1rem;padding-top:1rem">
                                    <p
                                      style="margin:0px;font-size:0.875rem;line-height:1.4285714285714286">
                                      Sign up
                                    </p>
                                    <p
                                      style="margin:0px;font-size:0.875rem;line-height:1.4285714285714286">
                                      Say hi
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <div
                              style="color:rgb(81,162,255);background-color:rgb(251,44,54);margin-top:0.5rem;padding:4px">
                              Nested component
                            </div>
                            <a
                              href="https://vuemail.dev"
                              style="line-height:1.4285714285714286;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;border-radius:0.375rem;background-color:rgb(21,93,252);padding-right:12px;padding-left:12px;padding-bottom:8px;padding-top:8px;font-size:0.875rem;color:rgb(229,231,235)"
                              target="_blank"
                              ><span
                                ><!--[if mso]><i style="mso-font-width:300%;mso-text-raise:12px" hidden>&#8202;&#8202;</i><![endif]--></span
                              ><span
                                style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:6px"
                                >Get started</span
                              ><span
                                ><!--[if mso]><i style="mso-font-width:300%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span
                              ></a
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
        "
      `);
    });
  });

  describe('with custom theme config', () => {
    it('supports custom colors', async () => {
      expect(
        await renderMarkup(
          tailwind(() => h('div', { class: 'bg-custom text-custom' }), {
            config: {
              theme: { extend: { colors: { custom: '#1fb6ff' } } },
            } satisfies TailwindConfig,
          }),
        ),
      ).toBe(
        '<div style="background-color:rgb(31,182,255);color:rgb(31,182,255)"></div>',
      );
    });

    it('merges declarations from a preset and a child override for the same class', async () => {
      const base: TailwindConfig = {
        plugins: [
          plugin(({ addComponents }) => {
            addComponents({ '.box': { '@apply rounded-lg bg-white p-4': {} } });
          }),
        ],
      };
      const config: TailwindConfig = {
        presets: [base],
        plugins: [
          plugin(({ addComponents }) => {
            addComponents({ '.box': { '@apply bg-red-500': {} } });
          }),
        ],
      };

      expect(
        await renderMarkup(
          tailwind(() => h('div', { class: 'box' }, 'hi'), { config }),
        ),
      ).toBe(
        '<div style="border-radius:0.5rem;background-color:rgb(251,44,54);padding:1rem">hi</div>',
      );
    });
  });

  it('rejects with the error from Tailwind when its configuration is invalid', async () => {
    await expect(
      renderMarkup(
        tailwind(() => h('div', { class: 'bg-white' }), {
          utility: '@utility content-auto { content-visibility: auto; }',
        }),
      ),
    ).rejects.toThrow('`@utility` cannot be nested.');
  });

  describe('with css configuration', () => {
    it('supports a custom theme', async () => {
      expect(
        await renderMarkup(
          tailwind(() => h('div', { class: 'bg-brand font-display' }), {
            theme:
              '@theme { --color-brand: #00dc82; --font-display: "Satoshi", sans-serif; }',
          }),
        ),
      ).toBe(
        '<div style="background-color:rgb(0,220,130);font-family:&quot;Satoshi&quot;,sans-serif"></div>',
      );
    });

    it('supports custom utilities', async () => {
      expect(
        await renderMarkup(
          tailwind(() => h('div', { class: 'custom-shadow' }), {
            utility:
              '.custom-shadow { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; }',
          }),
        ),
      ).toBe(
        '<div style="box-shadow:0 4px 6px rgb(0,0,0,0.1);border-radius:8px"></div>',
      );
    });
  });
});
