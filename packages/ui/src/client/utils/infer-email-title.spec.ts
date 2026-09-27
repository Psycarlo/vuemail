import { describe, expect, it } from 'vitest';
import { inferEmailTitle } from './infer-email-title';

describe('inferEmailTitle()', () => {
  it('handles kebab-case filenames', () => {
    expect(inferEmailTitle('verify-password.vue')).toBe('Verify Password');
    expect(inferEmailTitle('notion-magic-link.vue')).toBe('Notion Magic Link');
    expect(inferEmailTitle('getting-started-with-vue.vue')).toBe(
      'Getting Started With Vue',
    );
  });

  it('handles snake_case filenames', () => {
    expect(inferEmailTitle('verify_password.vue')).toBe('Verify Password');
    expect(inferEmailTitle('reset_password_request.vue')).toBe(
      'Reset Password Request',
    );
  });

  it('handles camelCase filenames', () => {
    expect(inferEmailTitle('verifyPassword.vue')).toBe('Verify Password');
    expect(inferEmailTitle('welcomeEmail.vue')).toBe('Welcome Email');
    expect(inferEmailTitle('orderConfirmation.vue')).toBe('Order Confirmation');
  });

  it('handles PascalCase filenames', () => {
    expect(inferEmailTitle('VerifyPassword.vue')).toBe('Verify Password');
    expect(inferEmailTitle('WelcomeEmail.vue')).toBe('Welcome Email');
  });

  it('preserves acronyms', () => {
    expect(inferEmailTitle('APIKey.vue')).toBe('API Key');
    expect(inferEmailTitle('MFAEmail.vue')).toBe('MFA Email');
    expect(inferEmailTitle('NewAPIToken.vue')).toBe('New API Token');
    expect(inferEmailTitle('IOError.vue')).toBe('IO Error');
  });

  it('does not mis-split PascalCase tokens that start with a single capital', () => {
    // `OAuth` is a single PascalCase token, not an acronym `O` followed by
    // a word `Auth`, so the leading `O` must stay attached.
    expect(inferEmailTitle('OAuthEmail.vue')).toBe('OAuth Email');
    expect(inferEmailTitle('IPhoneOrder.vue')).toBe('IPhone Order');
  });

  it('handles single-word filenames', () => {
    expect(inferEmailTitle('welcome.vue')).toBe('Welcome');
    expect(inferEmailTitle('Welcome.vue')).toBe('Welcome');
  });

  it('handles mixed conventions', () => {
    expect(inferEmailTitle('verify-passwordEmail.vue')).toBe(
      'Verify Password Email',
    );
    expect(inferEmailTitle('reset_PasswordRequest.vue')).toBe(
      'Reset Password Request',
    );
  });

  it('keeps digits attached to adjacent letters', () => {
    expect(inferEmailTitle('email2FA.vue')).toBe('Email2 FA');
    expect(inferEmailTitle('welcome2023.vue')).toBe('Welcome2023');
  });

  it('handles filenames without an extension', () => {
    expect(inferEmailTitle('verify-password')).toBe('Verify Password');
    expect(inferEmailTitle('verifyPassword')).toBe('Verify Password');
  });

  it('handles filenames with multiple dots', () => {
    expect(inferEmailTitle('verify-password.spec.vue')).toBe(
      'Verify Password Spec',
    );
  });

  it('handles other extensions, like raw HTML emails', () => {
    expect(inferEmailTitle('order-shipped.html')).toBe('Order Shipped');
    expect(inferEmailTitle('orderShipped.tsx')).toBe('Order Shipped');
  });

  it('returns an empty string for empty input', () => {
    expect(inferEmailTitle('')).toBe('');
    expect(inferEmailTitle('.vue')).toBe('');
  });
});
