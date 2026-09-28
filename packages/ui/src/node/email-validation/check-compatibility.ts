import type {
  CompatibilityCheckingResult,
  EmailClient,
  SourceLocation,
  SupportEntry,
} from '../../shared/types';
import { getCompatibilityStatsForEntry } from './caniemail/get-compatibility-stats-for-entry';
import { getCssFunctions } from './caniemail/get-css-functions';
import { getCssPropertyNames } from './caniemail/get-css-property-names';
import { getCssPropertyWithValue } from './caniemail/get-css-property-with-value';
import { getCssUnit } from './caniemail/get-css-unit';
import { getElementAttributes } from './caniemail/get-element-attributes';
import { getElementNames } from './caniemail/get-element-names';
import { supportEntries } from './caniemail-data';
import { reactEmailSupportEntries } from './custom-support-entries';
import {
  getUsedSourceFeatures,
  type SetupTailwind,
  type SourceFeatures,
  type StylePropertyUsage,
} from './get-used-source-features';
import { snakeToCamel } from './snake-to-camel';

export type {
  CompatibilityCheckingResult,
  SupportEntry,
} from '../../shared/types';

/** Where the source first uses the feature of an entry, if it does. */
const findUsage = (
  entry: SupportEntry,
  { elements, attributes, styleProperties }: SourceFeatures,
): SourceLocation | undefined => {
  if (entry.category === 'html') {
    const entryElements = getElementNames(entry.title, entry.keywords);
    if (entryElements.length > 0) {
      return elements.find((element) => entryElements.includes(element.name))
        ?.location;
    }

    const entryAttributes = getElementAttributes(entry.title);
    if (entryAttributes.length > 0) {
      return attributes.find((attribute) =>
        entryAttributes.includes(attribute.name),
      )?.location;
    }

    return undefined;
  }

  if (entry.category !== 'css') return undefined;

  const entryFullProperty = getCssPropertyWithValue(entry.title);
  const entryProperties = getCssPropertyNames(entry.title, entry.keywords);
  const entryUnit = getCssUnit(entry.title);
  const entryFunctions = getCssFunctions(entry.title);

  let matches: ((property: StylePropertyUsage) => boolean) | undefined;
  if (entryFullProperty?.name && entryFullProperty.value) {
    matches = (property) =>
      property.name === snakeToCamel(entryFullProperty.name) &&
      property.value === entryFullProperty.value;
  } else if (entryFunctions.length > 0) {
    matches = (property) => {
      const functionName =
        /(?<functionName>[a-zA-Z_][a-zA-Z0-9_-]*)\s*\(/g.exec(property.value)
          ?.groups?.functionName;
      return (
        functionName !== undefined && entryFunctions.includes(functionName)
      );
    };
  } else if (entryUnit) {
    matches = (property) => {
      // Upstream matches with the global flag, which leaves out the groups,
      // so no unit ever matches
      const match = property.value.match(/[0-9](?<unit>[a-zA-Z%]+)$/g) as
        | (RegExpMatchArray & { groups?: { unit?: string } })
        | null;
      const unit = match?.groups?.unit;
      return unit !== undefined && entryUnit === unit;
    };
  } else if (entryProperties.length > 0) {
    matches = (property) =>
      entryProperties.some(
        (propertyName) => snakeToCamel(propertyName) === property.name,
      );
  }

  return matches ? styleProperties.find(matches)?.location : undefined;
};

/**
 * Checks what of an email the given email clients don't support, with Can I
 * Email's data: the first use of every unsupported feature in the source of
 * the email, in the order of the data.
 *
 * As upstream does for the source of React emails, it looks at the
 * elements and attributes of the email's template, and at the style
 * properties of its `style` attributes and of its Tailwind classes.
 */
export const checkCompatibility = async (
  source: string,
  emailPath: string,
  emailClients: readonly EmailClient[],
  setupTailwind: SetupTailwind,
): Promise<CompatibilityCheckingResult[]> => {
  const features = await getUsedSourceFeatures(
    source,
    emailPath,
    setupTailwind,
  );
  const sourceLines = source.split(/\n|\r|\r\n/);
  const getSourceCodeAt = (location: SourceLocation) =>
    sourceLines
      .slice(
        Math.max(location.start.line - 2, 0),
        Math.min(location.end.line + 2, sourceLines.length),
      )
      .join('\n');

  const results: CompatibilityCheckingResult[] = [];
  for (const entry of [...supportEntries, ...reactEmailSupportEntries]) {
    const compatibilityStats = getCompatibilityStatsForEntry(
      entry,
      emailClients,
    );
    if (Object.keys(compatibilityStats.perEmailClient).length === 0) continue;
    if (
      compatibilityStats.status === 'success' ||
      compatibilityStats.status === 'warning'
    )
      continue;

    const location = findUsage(entry, features);
    if (!location) continue;

    results.push({
      entry,
      location,
      source: getSourceCodeAt(location),
      statsPerEmailClient: compatibilityStats.perEmailClient,
      status: compatibilityStats.status,
    });
  }
  return results;
};
