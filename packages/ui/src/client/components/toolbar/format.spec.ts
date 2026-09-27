import { prettyBytes, sanitize } from './format';

test('prettyBytes()', () => {
  expect(prettyBytes(0)).toBe('0 B');
  expect(prettyBytes(512)).toBe('512 B');
  expect(prettyBytes(24534)).toBe('24.5 kB');
  expect(prettyBytes(111922)).toBe('112 kB');
  expect(prettyBytes(1_500_000)).toBe('1.5 MB');
});

test('sanitize()', () => {
  expect(sanitize('fetch_attempt')).toBe('fetch attempt');
  expect(sanitize('HTML_IMAGE_RATIO-02')).toBe('HTML IMAGE RATIO 02');
});
