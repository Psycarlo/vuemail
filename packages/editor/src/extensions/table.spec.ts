import { render } from '@vuemaildev/vuemail';
import { h, type VNodeChild } from 'vue';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Table, TableCell, TableHeader, TableRow } from './table';

const tableStyle = { ...DEFAULT_STYLES.reset };
const tableRowStyle = { ...DEFAULT_STYLES.reset };
const tableCellStyle = { ...DEFAULT_STYLES.reset };

function renderToHtml(content: () => VNodeChild) {
  return render(h({ render: content }), { pretty: true });
}

describe('Table Nodes', () => {
  it('renders Table Vuemail properly', async () => {
    const renderToVueEmail = Table.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'table',
            attrs: {
              alignment: 'center',
              width: '600',
            },
          },
          style: tableStyle,
          extension: Table,
          children: 'Table content',
        }),
      ),
    ).toMatchSnapshot();
  });

  it('renders TableRow Vuemail properly', async () => {
    const renderToVueEmail = TableRow.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'tableRow',
            attrs: {},
          },
          style: tableRowStyle,
          extension: TableRow,
          children: 'Row content',
        }),
      ),
    ).toMatchSnapshot();
  });

  it('renders TableCell Vuemail properly', async () => {
    const renderToVueEmail = TableCell.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    expect(
      await renderToHtml(() =>
        renderToVueEmail({
          node: {
            type: 'tableCell',
            attrs: {
              alignment: 'left',
            },
          },
          style: tableCellStyle,
          extension: TableCell,
          children: 'Cell content',
        }),
      ),
    ).toMatchSnapshot();
  });

  it('renders TableHeader Vuemail properly as a real th, not a dropped node', async () => {
    const renderToVueEmail = TableHeader.config.renderToVueEmail;
    expect(renderToVueEmail).toBeDefined();
    const html = await renderToHtml(() =>
      renderToVueEmail({
        node: {
          type: 'tableHeader',
          attrs: {
            alignment: 'left',
          },
        },
        style: tableCellStyle,
        extension: TableHeader,
        children: 'Header content',
      }),
    );

    expect(html).toContain('<th');
    expect(html).toContain('Header content');
    expect(html).toMatchSnapshot();
  });

  it('renders nested table structure without invalid tr-inside-td nesting', async () => {
    const renderTable = Table.config.renderToVueEmail;
    const renderRow = TableRow.config.renderToVueEmail;
    const renderCell = TableCell.config.renderToVueEmail;

    const html = await renderToHtml(() =>
      renderTable({
        node: {
          type: 'table',
          attrs: {
            alignment: 'center',
            width: '600',
          },
        },
        style: tableStyle,
        extension: Table,
        children: [
          renderRow({
            node: { type: 'tableRow', attrs: {} },
            style: tableRowStyle,
            extension: TableRow,
            children: [
              renderCell({
                node: { type: 'tableCell', attrs: { alignment: 'left' } },
                style: tableCellStyle,
                extension: TableCell,
                children: 'Cell 1',
              }),
              renderCell({
                node: { type: 'tableCell', attrs: { alignment: 'left' } },
                style: tableCellStyle,
                extension: TableCell,
                children: 'Cell 2',
              }),
            ],
          }),
        ],
      }),
    );

    expect(html).not.toMatch(/<td[^>]*>\s*<tr/);
    expect(html).toMatch(/<table[^>]*>\s*<tbody>\s*<tr/);
    expect(html).toMatchSnapshot();
  });
});
