import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Link } from './link';

describe('<Link> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(
      h(Link, { href: 'https://example.com' }, () => 'Test message'),
    );
    expect(html).toContain('Test message');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Link,
        {
          'data-testid': 'link-test',
          href: 'https://example.com',
          style: { color: 'red' },
        },
        () => 'Test',
      ),
    );
    expect(html).toContain('color:red');
    expect(html).toContain('data-testid="link-test"');
  });

  it('opens in a new tab unless told otherwise', async () => {
    expect(
      await renderMarkup(
        h(Link, { href: 'https://example.com' }, () => 'Example'),
      ),
    ).toBe(
      '<a href="https://example.com" style="color:#067df7;text-decoration-line:none" target="_blank">Example</a>',
    );
    expect(
      await renderMarkup(
        h(
          Link,
          { href: 'https://example.com', target: '_self' },
          () => 'Example',
        ),
      ),
    ).toContain('target="_self"');
  });

  it('blocks javascript: URLs, like React Email', async () => {
    expect(
      await renderMarkup(h(Link, { href: 'javascript:alert(1)' }, () => 'x')),
    ).toContain(
      'href="javascript:throw new Error(&#39;Vuemail has blocked a javascript: URL as a security precaution.&#39;)"',
    );
  });
});
