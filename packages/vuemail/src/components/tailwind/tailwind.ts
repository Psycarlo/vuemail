import type { Config } from 'tailwindcss';
import {
  type ComponentInternalInstance,
  defineComponent,
  type PropType,
  provide,
  type SlotsType,
  type VNodeChild,
} from 'vue';
import { ssrRenderSlot } from 'vue/server-renderer';
import { tailwindContextKey } from '../element';
import { inlineTailwindIntoHtml } from './utils/inline-tailwind-into-html';
import {
  createTailwindContext,
  type TailwindRenderContext,
} from './utils/tailwind-context';
import {
  setupTailwind,
  type TailwindSetup,
} from './utils/tailwindcss/setup-tailwind';

export type TailwindConfig = Omit<Config, 'content'>;

export const pixelBasedPreset: TailwindConfig = {
  theme: {
    extend: {
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '36px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
        '7xl': ['72px', { lineHeight: '1' }],
        '8xl': ['96px', { lineHeight: '1' }],
        '9xl': ['144px', { lineHeight: '1' }],
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        36: '144px',
        40: '160px',
        44: '176px',
        48: '192px',
        52: '208px',
        56: '224px',
        60: '240px',
        64: '256px',
        72: '288px',
        80: '320px',
        96: '384px',
      },
    },
  },
};

export interface TailwindProps {
  config?: TailwindConfig;
  /** CSS for Tailwind's `@theme`, the same you would write in your stylesheet. */
  theme?: string;
  /** CSS for your own `@utility` definitions. */
  utility?: string;
}

const tailwindSetups = new Map<string, Promise<TailwindSetup>>();

/**
 * Compiling Tailwind is the expensive part, so a compiler is kept around
 * for each configuration and shared by every render that uses it.
 */
function getTailwindSetup({ config, theme, utility }: TailwindProps) {
  const twConfigData = { config, cssConfigs: { theme, utility } };
  const key = JSON.stringify(twConfigData, (_key, value) =>
    typeof value === 'function' ? value.toString() : value,
  );

  let setup = tailwindSetups.get(key);
  if (!setup) {
    setup = setupTailwind(twConfigData);
    setup.catch(() => tailwindSetups.delete(key));
    tailwindSetups.set(key, setup);
  }
  return setup;
}

type SSRBufferItem = string | SSRBuffer | Promise<string | SSRBuffer>;
type SSRBuffer = SSRBufferItem[];

async function unrollBuffer(buffer: SSRBuffer): Promise<string> {
  let html = '';
  for (const item of buffer) {
    const resolved = await item;
    html +=
      typeof resolved === 'string' ? resolved : await unrollBuffer(resolved);
  }
  return html;
}

export const Tailwind = defineComponent({
  name: 'Tailwind',
  props: {
    config: Object as PropType<TailwindConfig>,
    theme: String,
    utility: String,
  },
  slots: Object as SlotsType<{ default?: () => VNodeChild }>,
  async setup(props) {
    let context: TailwindRenderContext | undefined;
    // Provided before awaiting, since provide() needs the component instance
    // that is only current up until the first await. Children render once
    // setup resolves, so the context is always there when they resolve.
    provide(tailwindContextKey, {
      resolve: (className) => context!.resolve(className),
    });

    try {
      context = createTailwindContext(await getTailwindSetup(props));
      return { context, setupError: undefined };
    } catch (setupError) {
      // Vue's server renderer carries on rendering when an async setup
      // fails, so the error is kept to be thrown once rendering starts.
      return { context, setupError };
    }
  },
  // Renders the content into a separate buffer so that, once it is ready,
  // the Tailwind classes that are still left in the HTML get inlined too.
  ssrRender(
    ctx: {
      $slots: Record<string, unknown>;
      context: TailwindRenderContext;
      setupError: unknown;
    },
    push: (item: SSRBufferItem) => void,
    parent: ComponentInternalInstance,
  ) {
    if (ctx.setupError) throw ctx.setupError;

    const buffer: SSRBuffer = [];
    ssrRenderSlot(
      ctx.$slots as Parameters<typeof ssrRenderSlot>[0],
      'default',
      {},
      null,
      (item) => buffer.push(item as SSRBufferItem),
      parent,
    );
    push(
      unrollBuffer(buffer).then((html) =>
        inlineTailwindIntoHtml(html, ctx.context),
      ),
    );
  },
  render() {
    return this.$slots.default?.();
  },
});
