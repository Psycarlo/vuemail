import { describe, expect, it } from 'vitest';
import { communityItems, officialItems } from '../../../shared/templates';
import { templateSourceUrl, templatesMarkdown } from './templates';

const official = {
  name: 'Matte',
  href: 'https://demo.vuemail.dev/preview/02-Matte/welcome',
  github:
    'https://github.com/vuemail/vuemail/tree/main/apps/demo/emails/02-Matte',
  figma: 'https://figma.com/community/file/1',
};

const community = {
  name: 'Slack / Confirm Email',
  author: 'c0dr',
  href: 'https://demo.vuemail.dev/preview/Community/magic-links/slack-confirm',
};

describe('templateSourceUrl', () => {
  it('uses the GitHub link when the template has one', () => {
    expect(templateSourceUrl(official)).toBe(official.github);
  });

  it('derives the source file from the preview path otherwise', () => {
    expect(templateSourceUrl(community)).toBe(
      'https://github.com/vuemail/vuemail/blob/main/apps/demo/emails/Community/magic-links/slack-confirm.vue',
    );
  });
});

describe('templatesMarkdown', () => {
  it('lists official and community templates with preview and source links', () => {
    const markdown = templatesMarkdown([official], [community]);

    expect(markdown.indexOf('## Official')).toBeLessThan(
      markdown.indexOf('## Community'),
    );
    expect(markdown).toContain(`### Matte\n\nPreview: ${official.href}`);
    expect(markdown).toContain(`Source: ${official.github}`);
    expect(markdown).toContain(`Figma: ${official.figma}`);
    expect(markdown).toContain('### Slack / Confirm Email\n\nAuthor: c0dr');
    expect(markdown).toContain(
      'Source: https://github.com/vuemail/vuemail/blob/main/apps/demo/emails/Community/magic-links/slack-confirm.vue',
    );
    expect(markdown).not.toContain('Figma: undefined');
  });

  it('previews every template listed on the website with the demo', () => {
    const markdown = templatesMarkdown(officialItems, communityItems);

    for (const item of [...officialItems, ...communityItems]) {
      expect(item.href.startsWith('https://demo.vuemail.dev/preview/')).toBe(
        true,
      );
      expect(markdown).toContain(`### ${item.name}\n`);
    }
  });
});
