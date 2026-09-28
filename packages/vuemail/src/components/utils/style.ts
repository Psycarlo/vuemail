import { camelize } from 'vue';

declare module 'vue' {
  interface CSSProperties {
    msoPaddingAlt?: string | number | undefined;
    msoTextRaise?: string | number | undefined;
    msoFontAlt?: string | undefined;
  }
}

/** A style normalized into camelCased properties and their values. */
export type StyleObject = Record<string, string | number | undefined>;

/**
 * Properties that take plain numbers, so that, like React does, every other
 * property can be given a number that stands for pixels. The same list as
 * React 19's, vendor-prefixed ones included (and `WebKitBoxFlexGroup` as is).
 */
const unitlessProperties = new Set([
  'animationIterationCount',
  'aspectRatio',
  'borderImageOutset',
  'borderImageSlice',
  'borderImageWidth',
  'boxFlex',
  'boxFlexGroup',
  'boxOrdinalGroup',
  'columnCount',
  'columns',
  'flex',
  'flexGrow',
  'flexPositive',
  'flexShrink',
  'flexNegative',
  'flexOrder',
  'gridArea',
  'gridRow',
  'gridRowEnd',
  'gridRowSpan',
  'gridRowStart',
  'gridColumn',
  'gridColumnEnd',
  'gridColumnSpan',
  'gridColumnStart',
  'fontWeight',
  'lineClamp',
  'lineHeight',
  'opacity',
  'order',
  'orphans',
  'scale',
  'tabSize',
  'widows',
  'zIndex',
  'zoom',
  'fillOpacity',
  'floodOpacity',
  'stopOpacity',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'MozAnimationIterationCount',
  'MozBoxFlex',
  'MozBoxFlexGroup',
  'MozLineClamp',
  'msAnimationIterationCount',
  'msFlex',
  'msZoom',
  'msFlexGrow',
  'msFlexNegative',
  'msFlexOrder',
  'msFlexPositive',
  'msFlexShrink',
  'msGridColumn',
  'msGridColumnSpan',
  'msGridRow',
  'msGridRowSpan',
  'WebkitAnimationIterationCount',
  'WebkitBoxFlex',
  'WebKitBoxFlexGroup',
  'WebkitBoxOrdinalGroup',
  'WebkitColumnCount',
  'WebkitColumns',
  'WebkitFlex',
  'WebkitFlexGrow',
  'WebkitFlexPositive',
  'WebkitFlexShrink',
  'WebkitLineClamp',
]);

const isUnitless = (property: string) => unitlessProperties.has(property);

function toPropertyKey(property: string) {
  const trimmed = property.trim();
  return trimmed.startsWith('--') ? trimmed : camelize(trimmed);
}

function parseStyleString(style: string): StyleObject {
  const result: StyleObject = {};
  // Splits on semicolons that are not inside parentheses, so that values
  // such as `url(data:image/png;base64,...)` stay whole.
  for (const declaration of style.split(/;(?![^(]*\))/)) {
    const colon = declaration.indexOf(':');
    if (colon === -1) continue;
    const property = declaration.slice(0, colon);
    const value = declaration.slice(colon + 1).trim();
    if (property.trim() && value) {
      result[toPropertyKey(property)] = value;
    }
  }
  return result;
}

/**
 * Normalizes any value Vue accepts for `style` (a string, an object or an
 * array of both) into a single object keyed by camelCased properties.
 */
export function toStyleObject(style: unknown): StyleObject {
  if (!style) return {};
  if (typeof style === 'string') return parseStyleString(style);
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map((item) => toStyleObject(item)));
  }
  if (typeof style === 'object') {
    const result: StyleObject = {};
    for (const [property, value] of Object.entries(style)) {
      if (typeof value === 'string' || typeof value === 'number') {
        result[toPropertyKey(property)] = value;
      } else if (value === undefined || value === null) {
        // Kept, so that like with React, merging it over a component's
        // default style takes that property out
        result[toPropertyKey(property)] = undefined;
      }
    }
    return result;
  }
  return {};
}

function hyphenate(property: string) {
  if (property.startsWith('--')) return property;
  return property
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^ms-/, '-ms-');
}

/**
 * Serializes a style object into the value of a `style` attribute, the same
 * way React does: numbers get a `px` unit unless the property is unitless,
 * and vendor-prefixed properties such as `WebkitHyphens` get their leading dash.
 */
export function styleToString(style: StyleObject): string | undefined {
  const declarations: string[] = [];
  for (const [property, value] of Object.entries(style)) {
    if (value === undefined || value === null || typeof value === 'boolean') {
      continue;
    }
    if (typeof value !== 'number' && typeof value !== 'string') continue;
    if (typeof value === 'string' && value.trim() === '') continue;

    const serialized =
      typeof value === 'number' &&
      value !== 0 &&
      !property.startsWith('--') &&
      !isUnitless(property)
        ? `${value}px`
        : String(value).trim();
    declarations.push(`${hyphenate(property)}:${serialized}`);
  }
  return declarations.length > 0 ? declarations.join(';') : undefined;
}
