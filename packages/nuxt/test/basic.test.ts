import { fileURLToPath } from 'node:url';
import { $fetch, setup } from '@nuxt/test-utils/e2e';

describe('@vuemail/nuxt', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  });

  it('renders an email written as a single file component in a server route', async () => {
    const html = await $fetch<string>('/api/welcome?name=Ana');

    expect(html).toMatch(/^<!DOCTYPE html PUBLIC/);
    expect(html).toContain('<title>Welcome, Ana</title>');
    expect(html).toContain('Welcome, Ana!');
  });

  it('inlines the Tailwind CSS 4 classes of the email', async () => {
    const html = await $fetch<string>('/api/welcome');

    expect(html).toContain(
      '<p style="font-size:1.125rem;line-height:1.5555555555555556;color:rgb(0,130,54);margin-top:16px;margin-bottom:16px">',
    );
    expect(html).toContain('background-color:rgb(0,166,62)');
    expect(html).toContain(
      '<style>@media (min-width:40rem){.sm_p-8{padding:2rem!important}}</style>',
    );
    expect(html).not.toMatch(/class="[^"]*\b(bg-white|text-lg|rounded)\b/);
  });

  it('renders the plain text version of the email', async () => {
    const text = await $fetch<string>('/api/welcome?name=Bo&format=text');

    expect(text).toContain('Welcome, Bo!');
    expect(text).not.toContain('<');
  });

  it('keeps the app, which uses Tailwind CSS 4 too, working', async () => {
    const page = await $fetch<string>('/');

    expect(page).toContain('Vuemail with Nuxt');
  });
});
