import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Heading } from './heading';

describe('<Heading> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Heading, null, () => 'Test message'));
    expect(html).toBe('<h1>Test message</h1>');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Heading,
        { 'data-testid': 'heading-test', style: { backgroundColor: 'red' } },
        () => 'Test',
      ),
    );
    expect(html).toContain('background-color:red');
    expect(html).toContain('data-testid="heading-test"');
  });

  it('renders the level and margins it is given', async () => {
    expect(
      await renderMarkup(h(Heading, { as: 'h2', mx: 4 }, () => 'Lorem ipsum')),
    ).toBe('<h2 style="margin-left:4px;margin-right:4px">Lorem ipsum</h2>');
  });

  it('lets the style override the margin props', async () => {
    expect(
      await renderMarkup(
        h(Heading, { as: 'h3', m: 8, style: { marginTop: 0 } }, () => 'Title'),
      ),
    ).toBe('<h3 style="margin:8px;margin-top:0">Title</h3>');
  });
});
