import { describe, expect, it } from 'vitest';
import { convertUrisIntoUrls } from './convert-uris-into-urls';

describe('convertUrisIntoUrls()', () => {
  it('works with src attributes', () => {
    expect(
      convertUrisIntoUrls(`
<template>
  <Img src="/static/my-image.png" />
</template>

<html>
  <head>...</head>
  <body>
    <img src="/static/my-image.png">
  </body>
</html>
`),
    ).toBe(`
<template>
  <Img src="https://vuemail.dev/static/my-image.png" />
</template>

<html>
  <head>...</head>
  <body>
    <img src="https://vuemail.dev/static/my-image.png">
  </body>
</html>
`);
  });

  it('works with url() function calls for fonts in styles', () => {
    expect(
      convertUrisIntoUrls(`
<template>
  <Head>
    <Font font-family="My font" :web-font="{ url: '/fonts/my-font', format: 'woff2' }" />
  </Head>
</template>

<html>
  <head>
    <style>
      .my-class {
        font-family: url(/fonts/my-font);
      }
    </style>
  </head>
</html>
`),
    ).toBe(`
<template>
  <Head>
    <Font font-family="My font" :web-font="{ url: 'https://vuemail.dev/fonts/my-font', format: 'woff2' }" />
  </Head>
</template>

<html>
  <head>
    <style>
      .my-class {
        font-family: url(https://vuemail.dev/fonts/my-font);
      }
    </style>
  </head>
</html>
`);
  });

  it('leaves absolute URLs and other paths as they are', () => {
    const code = `<Img src="https://example.com/static/a.png" />
<Link href="/static/terms">Terms</Link>`;

    expect(convertUrisIntoUrls(code)).toBe(code);
  });
});
