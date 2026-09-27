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
  getUsedHtmlFeatures,
  type HtmlFeatures,
} from './get-used-html-features';

export type {
  CompatibilityCheckingResult,
  SupportEntry,
} from '../../shared/types';

const normalizeCssValue = (value: string) =>
  value.trim().replace(/\s+/g, ' ').toLowerCase();

/** Where the markup first uses the feature of an entry, if it does. */
const findUsage = (
  entry: SupportEntry,
  { elements, attributes, styleProperties }: HtmlFeatures,
): SourceLocation | undefined => {
  if (entry.category === 'html') {
    // Entries like "loading attribute" come with keywords, like `img`, that
    // would otherwise be taken for the elements they're about
    const entryAttributes = getElementAttributes(entry.title);
    if (entryAttributes.length > 0) {
      return attributes.find((attribute) =>
        entryAttributes.includes(attribute.name),
      )?.location;
    }

    const entryElements = getElementNames(entry.title, entry.keywords);
    if (entryElements.length > 0) {
      return elements.find((element) => entryElements.includes(element.name))
        ?.location;
    }

    return undefined;
  }

  if (entry.category === 'css') {
    const entryFullProperty = getCssPropertyWithValue(entry.title);
    if (entryFullProperty?.name && entryFullProperty.value) {
      const value = normalizeCssValue(entryFullProperty.value);
      return styleProperties.find(
        (property) =>
          property.name === entryFullProperty.name &&
          normalizeCssValue(property.value) === value,
      )?.location;
    }

    const entryFunctions = getCssFunctions(entry.title);
    if (entryFunctions.length > 0) {
      return styleProperties.find((property) =>
        property.functions.some((name) => entryFunctions.includes(name)),
      )?.location;
    }

    const entryUnit = getCssUnit(entry.title);
    if (entryUnit) {
      return styleProperties.find((property) =>
        property.units.includes(entryUnit),
      )?.location;
    }

    const entryProperties = getCssPropertyNames(entry.title, entry.keywords);
    if (entryProperties.length > 0) {
      return styleProperties.find((property) =>
        entryProperties.includes(property.name),
      )?.location;
    }
  }

  return undefined;
};

/**
 * Checks what of an email's markup the given email clients don't support,
 * with Can I Email's data: the first use of every unsupported feature, in
 * the order of the data.
 *
 * Upstream analyses the source code of React emails. Vue emails are
 * analysed through the HTML they render instead: its elements, attributes,
 * inline styles and `<style>` elements, located by lines of the markup.
 */
export const checkCompatibility = (
  markup: string,
  emailClients: readonly EmailClient[],
): CompatibilityCheckingResult[] => {
  const features = getUsedHtmlFeatures(markup);
  const markupLines = markup.split(/\r\n|\n|\r/);
  const getSourceCodeAt = (location: SourceLocation) =>
    markupLines
      .slice(
        Math.max(location.start.line - 2, 0),
        Math.min(location.end.line + 2, markupLines.length),
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
