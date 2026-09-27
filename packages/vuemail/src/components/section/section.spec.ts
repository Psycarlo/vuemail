import { h } from 'vue';
import { Column } from '../column';
import { renderMarkup } from '../utils/render-markup';
import { Section } from './section';

describe('<Section> component', () => {
  it('renders correctly', async () => {
    expect(await renderMarkup(h(Section, null, () => 'Lorem ipsum'))).toBe(
      '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>Lorem ipsum</td></tr></tbody></table>',
    );
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Section,
        { 'data-testid': 'section-test', style: { backgroundColor: 'red' } },
        () => 'Test',
      ),
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="section-test"');
  });

  it('wraps its children in a single <td>, columns included', async () => {
    const html = await renderMarkup(
      h(Section, null, () => [
        h(Column, null, () => 'Hello'),
        h(Column, null, () => 'World'),
      ]),
    );
    expect(html).toBe(
      '<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td><td data-id="__vuemail-column">Hello</td><td data-id="__vuemail-column">World</td></td></tr></tbody></table>',
    );
  });

  it('moves padding to the inner cell while keeping the rest on the table', async () => {
    const html = await renderMarkup(
      h(
        Section,
        { style: { paddingTop: '8px', color: 'red', paddingLeft: 4 } },
        () => 'Hi',
      ),
    );
    expect(html).toContain('role="presentation" style="color:red"');
    expect(html).toContain(
      '<td style="padding-top:8px;padding-left:4px">Hi</td>',
    );
  });
});
