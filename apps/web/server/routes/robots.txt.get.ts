const agents = [
  'GPTBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
];

const content = [
  'User-Agent: *',
  'Allow: /',
  'Content-Signal: ai-train=yes, search=yes, ai-input=yes',
  '',
  ...agents.flatMap((agent) => [`User-Agent: ${agent}`, 'Allow: /', '']),
  'Host: https://vuemail.dev',
  'Sitemap: https://vuemail.dev/sitemap.xml',
  '',
].join('\n');

export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return content;
});
