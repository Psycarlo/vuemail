import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Button } from './button';

describe('<Button> component', () => {
  it('renders children correctly', async () => {
    const html = await renderMarkup(h(Button, null, () => 'Test message'));
    expect(html).toContain('Test message');
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Button,
        { 'data-testid': 'button-test', style: { backgroundColor: 'red' } },
        () => 'Test',
      ),
    );
    expect(html).toContain('background-color:red');
    expect(html).toContain('data-testid="button-test"');
  });

  it('renders correctly with padding values from style prop', async () => {
    expect(
      await renderMarkup(
        h(Button, {
          href: 'https://example.com',
          style: { padding: '12px 20px' },
        }),
      ),
    ).toBe(
      '<a href="https://example.com" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 20px;padding-top:12px;padding-right:20px;padding-bottom:12px;padding-left:20px" target="_blank"><span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18px" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"></span><span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a>',
    );
  });

  it('renders the <Button> component with no padding value', async () => {
    expect(await renderMarkup(h(Button, { href: 'https://example.com' }))).toBe(
      '<a href="https://example.com" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:0%;mso-text-raise:0px" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px"></span><span><!--[if mso]><i style="mso-font-width:0%" hidden>&#8203;</i><![endif]--></span></a>',
    );
  });

  it('allows users to overwrite style props', async () => {
    expect(
      await renderMarkup(
        h(Button, {
          style: {
            lineHeight: '150%',
            display: 'block',
            textDecoration: 'underline red',
            maxWidth: '50%',
          },
        }),
      ),
    ).toBe(
      '<a style="line-height:150%;text-decoration:underline red;display:block;max-width:50%;mso-padding-alt:0px" target="_blank"><span><!--[if mso]><i style="mso-font-width:0%;mso-text-raise:0px" hidden></i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px"></span><span><!--[if mso]><i style="mso-font-width:0%" hidden>&#8203;</i><![endif]--></span></a>',
    );
  });

  it('keeps a target that is given', async () => {
    const html = await renderMarkup(h(Button, { target: '_self' }));
    expect(html).toContain('target="_self"');
    expect(html).not.toContain('target="_blank"');
  });
});
