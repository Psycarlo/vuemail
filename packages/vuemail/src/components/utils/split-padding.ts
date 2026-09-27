import { resolvedClassMarker } from '../element';
import type { StyleObject } from './style';

/**
 * Splits padding away from everything else, so that tables can take their
 * padding on the inner cell. That improves compatibility with Klaviyo and
 * Outlook, while preserving the order the properties were given in.
 */
export function splitPaddingStyles(style: StyleObject) {
  const tdStyle: StyleObject = {};
  const tableStyle: StyleObject = {};

  for (const [key, value] of Object.entries(style)) {
    if (key.startsWith('padding')) {
      tdStyle[key] = value;
    } else {
      tableStyle[key] = value;
    }
  }

  return { tdStyle, tableStyle };
}

/**
 * Tailwind classes that stay on the element, like `sm:px-4`, follow the same
 * split: the ones that only set padding move to the inner cell.
 */
export function splitPaddingClasses(
  className: string | undefined,
  classProperties: Record<string, string[]>,
  tdClass: string | undefined,
) {
  const tableClasses: string[] = [];
  const tdClasses = tdClass ? [tdClass] : [];
  let isResolved = false;
  let movedToTd = false;

  for (const name of className?.split(' ') ?? []) {
    if (name === resolvedClassMarker) {
      isResolved = true;
      continue;
    }
    const properties = classProperties[name];
    if (
      properties &&
      properties.length > 0 &&
      properties.every((property) => property.startsWith('padding'))
    ) {
      tdClasses.push(name);
      movedToTd = true;
    } else {
      tableClasses.push(name);
    }
  }

  if (isResolved) {
    if (tableClasses.length > 0) tableClasses.push(resolvedClassMarker);
    if (movedToTd) tdClasses.push(resolvedClassMarker);
  }

  return {
    tableClass: tableClasses.length > 0 ? tableClasses.join(' ') : undefined,
    tdClass: tdClasses.length > 0 ? tdClasses.join(' ') : undefined,
  };
}
