import { h } from 'vue';
import { renderMarkup } from '../utils/render-markup';
import { Text } from './text';

describe('<Text> component', () => {
  it('renders children correctly', async () => {
    expect(await renderMarkup(h(Text, null, () => 'Test message'))).toBe(
      '<p style="font-size:14px;line-height:24px;margin-top:16px;margin-bottom:16px">Test message</p>',
    );
  });

  it("gives priority to the user's style", async () => {
    const html = await renderMarkup(
      h(Text, { style: { margin: '12px', marginTop: '0px' } }),
    );
    expect(html).toBe(
      '<p style="font-size:14px;line-height:24px;margin:12px;margin-top:0px;margin-bottom:12px;margin-left:12px;margin-right:12px"></p>',
    );
  });

  it('passes style and other props correctly', async () => {
    const html = await renderMarkup(
      h(
        Text,
        { 'data-testid': 'text-test', style: { fontSize: '16px' } },
        () => 'Test',
      ),
    );
    expect(html).toBe(
      '<p data-testid="text-test" style="font-size:16px;line-height:24px;margin-top:16px;margin-bottom:16px">Test</p>',
    );
  });
});
