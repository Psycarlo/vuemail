import { h } from 'vue';
import { Column } from '../column';
import { renderMarkup } from '../utils/render-markup';
import { Row } from './row';

describe('<Row> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Row, null, () => 'Test message'));
    expect(html).toContain('Test message');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Row,
        { 'data-testid': 'row-test', style: { backgroundColor: 'red' } },
        () => 'Test',
      ),
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="row-test"');
  });

  it('renders its columns into a single table row', async () => {
    expect(
      await renderMarkup(
        h(Row, null, () => [
          h(Column, null, () => 'Hello'),
          h(Column, null, () => 'World'),
        ]),
      ),
    ).toBe(
      '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody style="width:100%"><tr style="width:100%"><td data-id="__vuemail-column">Hello</td><td data-id="__vuemail-column">World</td></tr></tbody></table>',
    );
  });
});
