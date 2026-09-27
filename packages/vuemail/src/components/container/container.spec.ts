import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Container } from './container';

describe('<Container> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Container, null, () => 'Test message'));
    expect(html).toContain('Test message');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Container,
        {
          'data-testid': 'container-test',
          style: { maxWidth: 300, backgroundColor: 'red' },
        },
        () => 'Test',
      ),
    );
    expect(html).toContain('style="max-width:300px;background-color:red"');
    expect(html).toContain('data-testid="container-test"');
  });

  it('renders correctly', async () => {
    expect(
      await renderMarkup(
        h(Container, { style: { maxWidth: '300px' } }, () =>
          h('button', { type: 'button' }, 'Hi'),
        ),
      ),
    ).toBe(
      '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:300px"><tbody><tr style="width:100%"><td><button type="button">Hi</button></td></tr></tbody></table>',
    );
  });

  it('takes out its default max width when given an undefined one', async () => {
    const html = await renderMarkup(
      h(Container, { style: { maxWidth: undefined, color: 'red' } }, () =>
        h('p', 'Hi'),
      ),
    );
    expect(html).toBe(
      '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="color:red"><tbody><tr style="width:100%"><td><p>Hi</p></td></tr></tbody></table>',
    );
  });

  it('moves padding to the inner cell', async () => {
    const html = await renderMarkup(
      h(
        Container,
        {
          style: { padding: '20px 0', backgroundColor: '#fff' },
          tdClass: 'inner',
        },
        () => 'Hi',
      ),
    );
    expect(html).toContain('style="max-width:37.5em;background-color:#fff"');
    expect(html).toContain('<td class="inner" style="padding:20px 0">Hi</td>');
  });
});
