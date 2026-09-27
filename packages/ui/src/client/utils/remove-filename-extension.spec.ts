import { describe, expect, it } from 'vitest';
import { removeFilenameExtension } from './remove-filename-extension';

describe('removeFilenameExtension()', () => {
  it('works with a single .', () => {
    expect(removeFilenameExtension('email-template.vue')).toBe(
      'email-template',
    );
  });

  it('works with an example test file', () => {
    expect(removeFilenameExtension('email-template.spec.vue')).toBe(
      'email-template.spec',
    );
  });

  it('does nothing when there is no extension', () => {
    expect(removeFilenameExtension('email-template')).toBe('email-template');
  });

  it('keeps the directories of a path', () => {
    expect(removeFilenameExtension('auth/magic-links/verify.vue')).toBe(
      'auth/magic-links/verify',
    );
  });
});
