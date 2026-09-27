import { type CssNode, generate, List, type StyleSheet } from 'css-tree';
import { sanitizeStyleSheet } from '../../sanitize-stylesheet';
import { setupTailwind } from '../tailwindcss/setup-tailwind';
import { extractRulesPerClass } from './extract-rules-per-class';
import { sanitizeNonInlinableRules } from './sanitize-non-inlinable-rules';

/**
 * Builds the stylesheet of non-inlinable rules the same way `<Tailwind>`
 * does before sanitizing it.
 */
async function nonInlinableStyleSheetFor(classes: string[]) {
  const tailwind = await setupTailwind({});
  tailwind.addUtilities(classes);
  const stylesheet = tailwind.getStyleSheet();
  sanitizeStyleSheet(stylesheet);

  const { nonInlinable } = extractRulesPerClass(stylesheet, classes);

  return {
    type: 'StyleSheet',
    children: new List<CssNode>().fromArray(
      Array.from(nonInlinable.values()).flat(),
    ),
  } satisfies StyleSheet;
}

describe('sanitizeNonInlinableRules()', () => {
  it('leaves rules that can be inlined untouched', async () => {
    const tailwind = await setupTailwind({});
    tailwind.addUtilities(['bg-gray-900', 'text-red-300', 'text-lg']);
    const stylesheet = tailwind.getStyleSheet();

    sanitizeNonInlinableRules(stylesheet);
    const result = generate(stylesheet);

    expect(result).toContain(
      '.bg-gray-900{background-color:var(--color-gray-900)}',
    );
    expect(result).toContain('.text-red-300{color:var(--color-red-300)}');
    expect(result).not.toMatch(/\.(bg-gray-900|text-red-300)\{[^}]*!important/);
  });

  it('sanitizes class names and makes declarations important for pseudo-class variants', async () => {
    const stylesheet = await nonInlinableStyleSheetFor([
      'hover:text-sky-600',
      'sm:focus:outline-none',
      'md:hover:bg-gray-100',
      'lg:focus:underline',
    ]);

    sanitizeNonInlinableRules(stylesheet);

    expect(generate(stylesheet)).toMatchInlineSnapshot(
      `".hover_text-sky-600:hover{@media (hover:hover){color:rgb(0,132,209)!important}}.sm_focus_outline-none:focus{@media (width>=40rem){outline-style:none!important}}.md_hover_bg-gray-100:hover{@media (width>=48rem){@media (hover:hover){background-color:rgb(243,244,246)!important}}}.lg_focus_underline:focus{@media (width>=64rem){text-decoration-line:underline!important}}"`,
    );
  });

  it('strips Tailwind v4 variant-stacking var() refs with empty fallbacks inside print: media queries', async () => {
    // `print:invert` compiles to a filter value that is a chain of var(--tw-...,)
    // with empty fallbacks. After resolveAllCssVariables the filter is concrete;
    // sanitizeNonInlinableRules then drops the leftover --tw-* declarations and
    // any remaining empty-fallback var() refs.
    const stylesheet = await nonInlinableStyleSheetFor([
      'md:block',
      'print:invert',
    ]);

    sanitizeNonInlinableRules(stylesheet);
    const result = generate(stylesheet);

    expect(result).not.toMatch(/var\(--tw-[^,()]+,\s*\)/);
    expect(result).not.toMatch(/--tw-[^:]+:/);
    expect(result).toMatchInlineSnapshot(
      `".md_block{@media (width>=48rem){display:block!important}}.print_invert{@media print{filter:invert(100%)!important}}"`,
    );
  });

  it('supports basic media query rules', async () => {
    const stylesheet = await nonInlinableStyleSheetFor([
      'sm:mx-auto',
      'sm:max-w-lg',
      'sm:rounded-lg',
      'md:px-10',
      'md:py-12',
    ]);

    sanitizeNonInlinableRules(stylesheet);

    expect(generate(stylesheet)).toMatchInlineSnapshot(
      `".sm_mx-auto{@media (width>=40rem){margin-right:auto!important;margin-left:auto!important}}.sm_max-w-lg{@media (width>=40rem){max-width:32rem!important}}.sm_rounded-lg{@media (width>=40rem){border-radius:0.5rem!important}}.md_px-10{@media (width>=48rem){padding-right:2.5rem!important;padding-left:2.5rem!important}}.md_py-12{@media (width>=48rem){padding-bottom:3rem!important;padding-top:3rem!important}}"`,
    );
  });
});
