import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Column } from './column';

describe('<Column> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Column, null, () => 'Test message'));
    expect(html).toContain('Test message');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Column,
        { 'data-testid': 'column-test', style: { backgroundColor: 'red' } },
        () => 'Test',
      ),
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="column-test"');
  });

  it('renders correctly', async () => {
    expect(await renderMarkup(h(Column, null, () => 'Lorem ipsum'))).toBe(
      '<td data-id="__vuemail-column">Lorem ipsum</td>',
    );
  });
});
