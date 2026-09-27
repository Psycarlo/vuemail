import type { SVGAttributes } from 'vue';

/**
 * Props of the icon components. Any other SVG attribute falls through to the
 * `<svg>` element, overriding its defaults.
 */
export interface IconProps extends /* @vue-ignore */ SVGAttributes {
  size?: number | string;
  width?: number | string;
  height?: number | string;
}
