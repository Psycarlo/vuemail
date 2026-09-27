const vuemailImportRegex = /import\s*\{([^}]*)\}\s*from\s*(['"])vuemail\2;?/;
const scriptSetupRegex = /<script\b[^>]*\bsetup\b[^>]*>\n?/;
// Up to the last `</template>`, the one closing the template of the component
const templateRegex = /^<template>([\s\S]*)<\/template>/m;

const LINE_WIDTH = 80;

/** Adds a component to the named imports from `vuemail`, keeping them sorted. */
const importFromVuemail = (code: string, name: string): string => {
  const match = vuemailImportRegex.exec(code);
  if (!match) {
    const statement = `import { ${name} } from 'vuemail';\n`;
    const scriptSetup = scriptSetupRegex.exec(code);
    if (!scriptSetup) {
      return `<script setup lang="ts">\n${statement}</script>\n\n${code}`;
    }
    const end = scriptSetup.index + scriptSetup[0].length;
    return `${code.slice(0, end)}${statement}${code.slice(end)}`;
  }

  const names = match[1]!
    .split(',')
    .map((specifier) => specifier.trim())
    .filter(Boolean);
  if (names.some((specifier) => specifier.split(/\s+as\s+/).pop() === name)) {
    return code;
  }
  const index = names.findIndex(
    (specifier) => specifier.replace(/^type\s+/, '').localeCompare(name) > 0,
  );
  names.splice(index === -1 ? names.length : index, 0, name);

  const quote = match[2]!;
  const semicolon = match[0].endsWith(';') ? ';' : '';
  const singleLine = `import { ${names.join(', ')} } from ${quote}vuemail${quote}${semicolon}`;
  const statement =
    singleLine.length <= LINE_WIDTH
      ? singleLine
      : `import {\n${names.map((specifier) => `  ${specifier},`).join('\n')}\n} from ${quote}vuemail${quote}${semicolon}`;
  return `${code.slice(0, match.index)}${statement}${code.slice(match.index + match[0].length)}`;
};

/**
 * Wraps the template of a single file component with `<Tailwind>`, which the
 * Tailwind variants of the components need, importing it from `vuemail`.
 */
export function wrapWithTailwind(code: string): string {
  const withImport = importFromVuemail(code, 'Tailwind');

  const template = templateRegex.exec(withImport);
  if (!template) return withImport;

  const lines = template[1]!
    .replace(/^[^\S\n]*\n/, '')
    .replace(/\n[^\S\n]*$/, '')
    .split('\n');
  const wrapped = [
    '<template>',
    '  <Tailwind>',
    ...lines.map((line) => (line.trim().length > 0 ? `  ${line}` : '')),
    '  </Tailwind>',
    '</template>',
  ].join('\n');

  return `${withImport.slice(0, template.index)}${wrapped}${withImport.slice(template.index + template[0].length)}`;
}
