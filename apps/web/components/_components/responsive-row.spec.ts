import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { render } from 'vuemail';
import ResponsiveColumn from './responsive-column.vue';
import ResponsiveRow from './responsive-row.vue';

const table =
  'align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"';

describe('ResponsiveRow', () => {
  it('renders like the ResponsiveRow of @responsive-email/react-email', async () => {
    const html = await render(
      h(ResponsiveRow, { class: 'mt-4', style: { color: 'red' } }, () => [
        h(ResponsiveColumn, null, () => 'a'),
        h(
          ResponsiveColumn,
          {
            span: 2,
            style: { paddingRight: '4px' },
            tdProps: { align: 'left' },
          },
          () => 'b',
        ),
      ]),
    );

    // What the React version renders, but for the `span` and `tdProps`
    // attributes it leaves on the column's table (Vue ends each declaration of
    // a style with a semicolon)
    expect(html.replace(/^<!DOCTYPE[^>]*>/, '').replaceAll(';"', '"')).toBe(
      `<table ${table} class="mt-4" style="text-align:center;font-size:0;color:red"><tbody><tr><td style="padding:0px 0px 0px 0px">` +
        `<table ${table} style="max-width:200px;display:inline-block;vertical-align:top;font-size:16px;box-sizing:border-box"><tbody><tr><td>a</td></tr></tbody></table>` +
        `<table ${table} style="max-width:400px;display:inline-block;vertical-align:top;font-size:16px;box-sizing:border-box;padding-right:4px"><tbody><tr><td align="left">b</td></tr></tbody></table>` +
        '</td></tr></tbody></table>',
    );
  });

  it('shares the maximum width between the columns', async () => {
    const html = await render(
      h(ResponsiveRow, { maxWidth: 300 }, () => [
        h(ResponsiveColumn, null, () => 'a'),
        h(ResponsiveColumn, null, () => 'b'),
        h(ResponsiveColumn, null, () => 'c'),
      ]),
    );

    expect(html.match(/max-width:100px/g)).toHaveLength(3);
  });
});
