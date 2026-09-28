import type { EmailLoader } from '../email-loader';
import type {
  SetupTailwind,
  TailwindCssProp,
} from './get-used-source-features';

type Vuemail = typeof import('@vuemaildev/vuemail');

const cssPropCode = (prop: TailwindCssProp | undefined) =>
  prop && 'code' in prop ? prop.code : 'undefined';

/**
 * Sets Tailwind up with what an email gives `<Tailwind>`, running the code
 * of its props next to it, with the `@vuemaildev/vuemail` the email renders with. What
 * can't run on its own is left out, with a warning, as upstream does.
 */
export const createTailwindSetup =
  (loader: EmailLoader, emailPath: string): SetupTailwind =>
  async ({ imports, config, theme, utility }, candidates) => {
    const vuemail = await loader.load<Vuemail>('@vuemaildev/vuemail');
    const evaluate = (code: string) =>
      loader.evaluate(
        `${imports.join('\n')}\nexport default (${code});`,
        emailPath,
      );

    let tailwindConfig = {};
    if (config) {
      try {
        const value = await evaluate(config);
        if (typeof value === 'object' && value !== null) tailwindConfig = value;
      } catch (exception) {
        console.warn(exception);
        console.warn(
          `Tried reading the config defined directly in the Tailwind component but was unable to, probably because it can't run by itself.`,
        );
      }
    }

    const cssConfigs: { theme?: string; utility?: string } = {};
    if (theme && 'literal' in theme) cssConfigs.theme = theme.literal;
    if (utility && 'literal' in utility) cssConfigs.utility = utility.literal;
    if ((theme && 'code' in theme) || (utility && 'code' in utility)) {
      try {
        const [themeValue, utilityValue] = (await evaluate(
          `[${cssPropCode(theme)}, ${cssPropCode(utility)}]`,
        )) as unknown[];
        if (typeof themeValue === 'string') cssConfigs.theme = themeValue;
        if (typeof utilityValue === 'string') cssConfigs.utility = utilityValue;
      } catch (exception) {
        console.warn(exception);
        console.warn(
          'Could not resolve the theme/utility props on <Tailwind>. The caniemail compatibility check will not see styles produced by these props.',
        );
      }
    }

    const tailwind = await vuemail.setupTailwind({
      config: tailwindConfig,
      cssConfigs,
    });
    tailwind.addUtilities(candidates);
    const styleSheet = tailwind.getStyleSheet();
    vuemail.sanitizeStyleSheet(styleSheet);
    return (classes) => vuemail.inlineStyles(styleSheet, classes);
  };
