import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Body } from './body';
import { marginProperties, paddingProperties } from './margin-properties';

const hyphenate = (property: string) =>
  property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

describe('<Body> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Body, null, () => 'Test message'));
    expect(html).toContain('Test message');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Body,
        { 'data-testid': 'body-test', style: { backgroundColor: 'red' } },
        () => 'Test',
      ),
    );
    expect(html).toContain('style="background-color:red"');
    expect(html).toContain('data-testid="body-test"');
  });

  it('renders correctly', async () => {
    expect(await renderMarkup(h(Body, null, () => 'Lorem ipsum'))).toBe(
      '<body dir="ltr" lang="en"><table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center"><tbody><tr><td dir="ltr" lang="en">Lorem ipsum</td></tr></tbody></table></body>',
    );
  });

  it('accepts styles written as a string', async () => {
    const html = await renderMarkup(
      h(Body, { style: 'background-color: pink; margin: 8px' }, () => 'Text'),
    );
    expect(html).toContain(
      '<body dir="ltr" lang="en" style="background-color:pink;margin:0">',
    );
    expect(html).toContain(
      '<td dir="ltr" lang="en" style="background-color:pink;margin:8px">',
    );
  });

  describe('margin resetting behavior', () => {
    for (const property of marginProperties) {
      it(`resets the ${property} property on body when it comes from props`, async () => {
        const html = await renderMarkup(
          h(Body, { style: { [property]: 10 } }, () => 'Random text'),
        );
        const bodyStyle = html.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
        const tdStyle = html.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

        expect(bodyStyle).toBe(`${hyphenate(property)}:0`);
        expect(tdStyle).toBe(`${hyphenate(property)}:10px`);
      });
    }
  });

  it('resets body padding to override client default', async () => {
    const html = await renderMarkup(
      h(
        Body,
        { style: { padding: '20px', backgroundColor: 'pink' } },
        () => 'Random text',
      ),
    );
    const bodyStyle = html.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
    const tdStyle = html.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

    expect(bodyStyle).toContain('padding:0');
    expect(bodyStyle).toContain('background-color:pink');
    expect(bodyStyle).not.toContain('padding:20px');
    expect(tdStyle).toContain('padding:20px');
  });

  describe('padding resetting behavior', () => {
    for (const property of paddingProperties) {
      it(`resets the ${property} property on body when it comes from props`, async () => {
        const html = await renderMarkup(
          h(Body, { style: { [property]: '10px' } }, () => 'Random text'),
        );
        const bodyStyle = html.match(/<body[^>]*style="([^"]*)"/)?.[1] ?? '';
        const tdStyle = html.match(/<td[^>]*style="([^"]*)"/)?.[1] ?? '';

        expect(bodyStyle).toContain(`${hyphenate(property)}:0`);
        expect(tdStyle).toContain(`${hyphenate(property)}:10px`);
      });
    }
  });
});
