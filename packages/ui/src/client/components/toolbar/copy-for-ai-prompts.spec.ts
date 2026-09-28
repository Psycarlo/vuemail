import type {
  CompatibilityCheckingResult,
  LintingRow,
  SpamCheckingResult,
} from '../../../shared/types';
import { getPromptForTab } from './copy-for-ai-prompts';

const lintingRows: LintingRow[] = [
  {
    source: 'image',
    result: {
      status: 'warning',
      source: '/static/logo.png',
      codeLocation: { line: 12, column: 5 },
      checks: [
        { type: 'accessibility', passed: false, metadata: { alt: undefined } },
      ],
    },
  },
  {
    source: 'link',
    result: {
      status: 'error',
      link: 'https://vuemail.dev/missing',
      codeLocation: { line: 20, column: 5 },
      checks: [
        { type: 'syntax', passed: true },
        { type: 'security', passed: true },
        {
          type: 'fetch_attempt',
          passed: false,
          metadata: { fetchStatusCode: 404 },
        },
      ],
    },
  },
];

const compatibilityResults = [
  {
    entry: { title: 'border-radius' },
    location: {
      start: { line: 7, column: 4, index: 100 },
      end: { line: 7, column: 22, index: 118 },
    },
    source: '',
    status: 'error',
    statsPerEmailClient: {
      gmail: { status: 'success', perPlatform: {} },
      outlook: { status: 'error', perPlatform: {} },
    },
  },
] as unknown as CompatibilityCheckingResult[];

const spamResult: SpamCheckingResult = {
  isSpam: false,
  points: 1.2,
  checks: [
    { name: 'HTML_IMAGE_RATIO_02', description: 'Few images', points: 0.2 },
    { name: 'MIME_HTML_ONLY', description: 'Only HTML', points: 1 },
  ],
};

const source = '<template><Html /></template>';

test('getPromptForTab() asks to fix the issues of the linter', () => {
  expect(
    getPromptForTab(
      'linter',
      lintingRows,
      compatibilityResults,
      spamResult,
      source,
      'vue',
    ),
  ).toMatchInlineSnapshot(`
    "I have a Vuemail template with the following linting issues found by the email preview tool. Please help me fix each one:

    - [ACCESSIBILITY] Missing alt text → /static/logo.png (line 12)
    - [FETCH ATTEMPT] Broken link (HTTP 404) → https://vuemail.dev/missing (line 20)

    For each issue:
    1. Explain what the problem is and why it matters for email deliverability
    2. Provide the corrected code
    3. If an image is missing alt text, suggest descriptive alt text based on the image URL/context
    4. If a link or image is broken, suggest how to verify and fix the URL
    5. If using HTTP instead of HTTPS, update to the secure version

    Here is the source code of my email template:

    \`\`\`vue
    <template><Html /></template>
    \`\`\`"
  `);
});

test('getPromptForTab() asks to fix the compatibility issues', () => {
  const prompt = getPromptForTab(
    'compatibility',
    lintingRows,
    compatibilityResults,
    spamResult,
    source,
    'vue',
  );
  expect(prompt).toContain(
    '- "border radius" is not supported in: Outlook (line 7 of the .vue file)',
  );
  expect(prompt).not.toContain('linting issues');
});

test('getPromptForTab() asks to fix the spam indicators, worst first', () => {
  const prompt = getPromptForTab(
    'spam-assassin',
    undefined,
    undefined,
    spamResult,
    source,
    'vue',
  );
  expect(prompt).toContain('scored 8.8/10');
  expect(prompt.indexOf('MIME HTML ONLY')).toBeLessThan(
    prompt.indexOf('HTML IMAGE RATIO 02'),
  );
});

test('getPromptForTab() combines every issue when no panel is open', () => {
  const prompt = getPromptForTab(
    undefined,
    lintingRows,
    compatibilityResults,
    spamResult,
    source,
    'vue',
  );
  expect(prompt.split('\n\n---\n\n')).toHaveLength(3);
});

test('getPromptForTab() asks for a review when there are no issues', () => {
  expect(
    getPromptForTab('linter', [], undefined, undefined, '<p></p>', 'html'),
  ).toBe(
    'Here is the source code of my HTML email template:\n\n```html\n<p></p>\n```\n\nHelp me review and improve this email template.',
  );
});
