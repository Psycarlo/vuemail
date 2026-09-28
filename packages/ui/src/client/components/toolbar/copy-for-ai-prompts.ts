import { nicenames } from '../../../node/email-validation/caniemail-data';
import type {
  CompatibilityCheckingResult,
  EmailClient,
  LintingRow,
  SpamCheckingResult,
} from '../../../shared/types';
import type { ToolbarTabValue } from '../../composables/use-toolbar-state';
import { sanitize } from './format';

export type ActiveTab = ToolbarTabValue | undefined;

function buildLinterPrompt(rows: LintingRow[]): string {
  const issues = rows
    .filter((row) => row.result.status !== 'success')
    .map((row) => {
      if (row.source === 'link') {
        const failingCheck = row.result.checks.find((c) => !c.passed);
        if (!failingCheck) return null;

        let description = '';
        if (failingCheck.type === 'security')
          description = 'Insecure URL (HTTP instead of HTTPS)';
        else if (
          failingCheck.type === 'fetch_attempt' &&
          failingCheck.metadata.fetchStatusCode &&
          failingCheck.metadata.fetchStatusCode >= 400
        )
          description = `Broken link (HTTP ${failingCheck.metadata.fetchStatusCode})`;
        else if (
          failingCheck.type === 'fetch_attempt' &&
          failingCheck.metadata.fetchStatusCode &&
          failingCheck.metadata.fetchStatusCode >= 300
        )
          description = `Redirect detected (HTTP ${failingCheck.metadata.fetchStatusCode})`;
        else if (failingCheck.type === 'fetch_attempt')
          description = 'Link could not be reached';
        else if (failingCheck.type === 'syntax')
          description = 'Invalid link syntax';

        return `- [${sanitize(failingCheck.type).toUpperCase()}] ${description} → ${row.result.link} (line ${row.result.codeLocation.line})`;
      }

      const failingCheck = row.result.checks.find((c) => !c.passed);
      if (!failingCheck) return null;

      let description = '';
      if (failingCheck.type === 'accessibility')
        description = 'Missing alt text';
      else if (failingCheck.type === 'security')
        description = 'Insecure image URL (HTTP instead of HTTPS)';
      else if (
        failingCheck.type === 'image_size' &&
        failingCheck.metadata.byteCount
      )
        description = `Image too large (${Math.round(failingCheck.metadata.byteCount / 1024)}KB, keep under 1MB)`;
      else if (
        failingCheck.type === 'fetch_attempt' &&
        failingCheck.metadata.fetchStatusCode &&
        failingCheck.metadata.fetchStatusCode >= 400
      )
        description = `Broken image (HTTP ${failingCheck.metadata.fetchStatusCode})`;
      else if (failingCheck.type === 'fetch_attempt')
        description = 'Image could not be reached';
      else if (failingCheck.type === 'syntax')
        description = 'Invalid image source';

      return `- [${sanitize(failingCheck.type).toUpperCase()}] ${description} → ${row.result.source} (line ${row.result.codeLocation.line})`;
    })
    .filter(Boolean);

  if (issues.length === 0) return '';

  return `I have a Vuemail template with the following linting issues found by the email preview tool. Please help me fix each one:

${issues.join('\n')}

For each issue:
1. Explain what the problem is and why it matters for email deliverability
2. Provide the corrected code
3. If an image is missing alt text, suggest descriptive alt text based on the image URL/context
4. If a link or image is broken, suggest how to verify and fix the URL
5. If using HTTP instead of HTTPS, update to the secure version`;
}

function buildCompatibilityPrompt(
  results: CompatibilityCheckingResult[],
  extname: string,
): string {
  const issues = results
    .filter((r) => r.status === 'error')
    .map((result) => {
      const unsupported = Object.entries(result.statsPerEmailClient)
        .filter(([, stats]) => stats?.status === 'error')
        .map(([client]) => nicenames.family[client as EmailClient] || client);

      return `- "${sanitize(result.entry.title)}" is not supported in: ${unsupported.join(', ')} (line ${result.location.start.line} of the .${extname} file)`;
    });

  if (issues.length === 0) return '';

  return `I have a Vuemail template with CSS/HTML compatibility issues detected by Can I Email. These features don't work in certain email clients:

${issues.join('\n')}

For each compatibility issue:
1. Explain which email clients are affected and how they'll render it
2. Provide a fallback or alternative approach that works across all email clients
3. Use only email-safe CSS properties and HTML elements
4. If a CSS property has no good fallback, suggest a different visual approach that achieves the same result
5. Prefer table-based layouts and inline styles for maximum compatibility`;
}

function buildSpamPrompt(result: SpamCheckingResult): string {
  const failingChecks = result.checks
    .filter((c) => c.points > 0)
    .sort((a, b) => b.points - a.points);

  if (failingChecks.length === 0) return '';

  const checksList = failingChecks
    .map(
      (check) =>
        `- [${sanitize(check.name)}] (penalty: -${check.points.toFixed(1)}) ${check.description}`,
    )
    .join('\n');

  return `I have a Vuemail template that scored ${(10 - result.points).toFixed(1)}/10 on SpamAssassin's spam check. Here are the spam indicators found:

${checksList}

Current total penalty: ${result.points.toFixed(1)} points (lower is better, 5+ is flagged as spam)

For each spam indicator:
1. Explain why this pattern triggers spam filters
2. Suggest specific changes to the email content or structure to fix it
3. Provide rewritten sections if the issue is with copy/wording
4. If the issue is structural (e.g., HTML-to-text ratio, missing headers), explain the fix
5. Prioritize fixes by impact — tackle highest-penalty items first`;
}

/**
 * The prompt to fix the issues of the active panel, or of all of them, with
 * the source code of the email.
 *
 * @param extname The extension of the email's file, like `vue` or `html`.
 */
export function getPromptForTab(
  activeTab: ActiveTab,
  lintingRows: LintingRow[] | undefined,
  compatibilityResults: CompatibilityCheckingResult[] | undefined,
  spamResult: SpamCheckingResult | undefined,
  source: string,
  extname: string,
): string {
  let issuePrompt = '';

  if (activeTab === 'linter' && lintingRows) {
    issuePrompt = buildLinterPrompt(lintingRows);
  } else if (activeTab === 'compatibility' && compatibilityResults) {
    issuePrompt = buildCompatibilityPrompt(compatibilityResults, extname);
  } else if (activeTab === 'spam-assassin' && spamResult) {
    issuePrompt = buildSpamPrompt(spamResult);
  } else {
    const parts: string[] = [];
    if (lintingRows) {
      const p = buildLinterPrompt(lintingRows);
      if (p) parts.push(p);
    }
    if (compatibilityResults) {
      const p = buildCompatibilityPrompt(compatibilityResults, extname);
      if (p) parts.push(p);
    }
    if (spamResult) {
      const p = buildSpamPrompt(spamResult);
      if (p) parts.push(p);
    }
    issuePrompt = parts.join('\n\n---\n\n');
  }

  const templateLabel = extname === 'html' ? 'HTML email' : 'Vuemail';

  if (!issuePrompt) {
    return `Here is the source code of my ${templateLabel} template:\n\n\`\`\`${extname}\n${source}\n\`\`\`\n\nHelp me review and improve this email template.`;
  }

  return `${issuePrompt}\n\nHere is the source code of my email template:\n\n\`\`\`${extname}\n${source}\n\`\`\``;
}

export function getLinkDescription(activeTab: ActiveTab): string {
  switch (activeTab) {
    case 'linter':
      return 'Fix linting issues';
    case 'compatibility':
      return 'Fix compatibility issues';
    case 'spam-assassin':
      return 'Fix spam issues';
    default:
      return 'Ask about this email';
  }
}

export function buildClaudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}

export function buildChatGPTUrl(prompt: string): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

export const MAX_SAFE_CHATGPT_URL_LENGTH = 7500;

export function buildCursorUrl(prompt: string): string {
  return `cursor://prompt?text=${encodeURIComponent(prompt)}`;
}
