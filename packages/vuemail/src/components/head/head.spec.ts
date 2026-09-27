import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Head } from './head';

describe('<Head> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(
      h(Head, null, () => h('title', 'Test message')),
    );
    expect(html).toContain('<title>Test message</title>');
  });

  it('renders correctly', async () => {
    expect(await renderMarkup(h(Head))).toBe(
      '<head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"><meta name="x-apple-disable-message-reformatting"></head>',
    );
  });

  it('renders style tags', async () => {
    const html = await renderMarkup(
      h(Head, null, () => h('style', { innerHTML: 'body{color:red;}' })),
    );
    expect(html).toBe(
      '<head><meta content="text/html; charset=UTF-8" http-equiv="Content-Type"><meta name="x-apple-disable-message-reformatting"><style>body{color:red;}</style></head>',
    );
  });
});
