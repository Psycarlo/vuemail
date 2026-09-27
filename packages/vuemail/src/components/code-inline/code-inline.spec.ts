import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { CodeInline } from './code-inline';

describe('<CodeInline> component', () => {
  it('renders the code twice, one copy for Orange.fr and one for every other client', async () => {
    const html = await renderMarkup(
      h(CodeInline, { style: { color: 'red' } }, () => 'npm i vuemail'),
    );

    expect(html).toContain(
      '<code class="cino" style="color:red">npm i vuemail</code>',
    );
    expect(html).toContain(
      '<span class="cio" style="display:none;color:red">npm i vuemail</span>',
    );
    expect(html).toMatch(/^<style>[\s\S]*meta ~ \.cino[\s\S]*<\/style>/);
  });

  it('keeps the classes it is given', async () => {
    const html = await renderMarkup(
      h(CodeInline, { class: 'inline-code' }, () => 'code'),
    );

    expect(html).toContain('<code class="inline-code cino">code</code>');
    expect(html).toContain(
      '<span class="inline-code cio" style="display:none">code</span>',
    );
  });
});
