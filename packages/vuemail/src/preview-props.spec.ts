import WelcomeEmail from './components/tailwind/fixtures/welcome-email.vue';
import { render } from './index';

describe('PreviewProps', () => {
  it('renders an email with its PreviewProps, which render() accepts as its props', async () => {
    // Type-checks although the email has required props
    const html = await render(WelcomeEmail, WelcomeEmail.PreviewProps);

    expect(html).toContain('Hi Ana,');
    expect(html).toContain('Create an account');
  });
});
