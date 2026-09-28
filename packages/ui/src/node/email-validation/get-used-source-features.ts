import path from 'node:path';
import { generate, parse as parseCss, walk as walkCss } from 'css-tree';
import { babelParse, parse as parseSfc, walk } from 'vue/compiler-sfc';
import type { SourceLocation } from '../../shared/types';
import { snakeToCamel } from './snake-to-camel';
import {
  createPositionResolver,
  type PositionResolver,
  toLocation,
} from './source-positions';

export interface SourceUsage {
  /** As written, like `table` or `Img`. */
  name: string;
  location: SourceLocation;
}

export interface StylePropertyUsage {
  /** In camelCase, like `borderRadius`. */
  name: string;
  value: string;
  location: SourceLocation;
}

export interface SourceFeatures {
  elements: SourceUsage[];
  attributes: SourceUsage[];
  styleProperties: StylePropertyUsage[];
}

/**
 * What an email gives `<Tailwind>`: the code of its `config`, `theme` and
 * `utility` props, or the strings they are, along with the imports that
 * code needs to run on its own.
 */
export interface TailwindProps {
  imports: string[];
  config?: string;
  theme?: TailwindCssProp;
  utility?: TailwindCssProp;
}

export type TailwindCssProp = { code: string } | { literal: string };

/** The inline styles Tailwind gives a list of classes, in camelCase. */
export type TailwindInliner = (classes: string[]) => Record<string, string>;

/** Sets Tailwind up the way an email does, for all of the classes it uses. */
export type SetupTailwind = (
  props: TailwindProps,
  candidates: string[],
) => Promise<TailwindInliner>;

// The parts of Babel's AST read here
interface BabelNode {
  type: string;
  start?: number | null;
  end?: number | null;
  [key: string]: unknown;
}

// The parts of Vue's template AST read here
interface VueLocation {
  start: { offset: number };
  end: { offset: number };
  source: string;
}
interface VueExpression {
  content: string;
  isStatic: boolean;
  loc: VueLocation;
}
interface VueAttribute {
  type: 6;
  name: string;
  nameLoc: VueLocation;
  value?: { content: string; loc: VueLocation };
}
interface VueDirective {
  type: 7;
  name: string;
  arg?: VueExpression;
  exp?: VueExpression;
}
interface VueElement {
  type: 1;
  tag: string;
  tagType: number;
  loc: VueLocation;
  props: (VueAttribute | VueDirective)[];
  children: VueNode[];
}
type VueNode = VueElement | { type: number; children?: VueNode[] };

const ELEMENT = 1;
const ATTRIBUTE = 6;
const TEMPLATE_TAG_TYPE = 3;
const TAILWIND_PROPS = ['config', 'theme', 'utility'] as const;
type TailwindPropName = (typeof TAILWIND_PROPS)[number];

const isTailwindProp = (name: string): name is TailwindPropName =>
  (TAILWIND_PROPS as readonly string[]).includes(name);

const parseExpression = (code: string): BabelNode | undefined => {
  try {
    const ast = babelParse(`(${code})`, {
      sourceType: 'module',
      plugins: ['typescript'],
    }) as unknown as BabelNode;
    const [statement] = (ast.program as BabelNode).body as BabelNode[];
    return statement?.expression as BabelNode | undefined;
  } catch {
    return undefined;
  }
};

const getIdentifiers = (code: string) => {
  const identifiers = new Set<string>();
  const expression = parseExpression(code);
  if (expression) {
    walk(expression, {
      enter(node: BabelNode) {
        if (node.type === 'Identifier') identifiers.add(node.name as string);
      },
    });
  }
  return identifiers;
};

/**
 * Where an object literal is written to, like `styles.button` for
 * `const styles = { button: {} }`. The ancestors end with the object.
 */
const writtenMemberExpressionTo = (ancestors: BabelNode[]): string => {
  let accumulated = '';
  for (let index = ancestors.length - 1; index > 0; index -= 2) {
    const parent = ancestors[index - 1]!;
    if (parent.type === 'VariableDeclarator') {
      const id = parent.id as BabelNode;
      if (id.type !== 'Identifier') return accumulated;
      const name = id.name as string;
      return accumulated.length === 0 ? name : `${name}.${accumulated}`;
    }
    if (parent.type !== 'ObjectProperty') return accumulated;
    const key = parent.key as BabelNode;
    if (key.type !== 'Identifier') return accumulated;
    const name = key.name as string;
    accumulated = accumulated.length === 0 ? name : `${name}.${accumulated}`;
  }
  return accumulated;
};

/**
 * What the scripts of an email define: its object literals, by what they're
 * written to, the code its variables start with, and its imports.
 */
class ScriptScope {
  readonly objects = new Map<
    string,
    { properties: BabelNode[]; offset: number }
  >();
  readonly variables = new Map<string, string>();
  readonly imports: { code: string; names: string[] }[] = [];

  /** Adds a script, which starts at the given offset of the source. */
  add(code: string, offset: number, plugins: ('typescript' | 'jsx')[]) {
    let ast: BabelNode;
    try {
      ast = babelParse(code, {
        sourceType: 'module',
        errorRecovery: true,
        plugins,
      }) as unknown as BabelNode;
    } catch {
      return;
    }

    const slice = (node: BabelNode) => code.slice(node.start!, node.end!);
    for (const statement of (ast.program as BabelNode).body as BabelNode[]) {
      if (statement.type === 'ImportDeclaration') {
        this.imports.push({
          code: slice(statement),
          names: (statement.specifiers as BabelNode[]).map(
            (specifier) => (specifier.local as BabelNode).name as string,
          ),
        });
        continue;
      }
      const declaration =
        statement.type === 'ExportNamedDeclaration'
          ? (statement.declaration as BabelNode | null)
          : statement;
      if (declaration?.type !== 'VariableDeclaration') continue;
      for (const declarator of declaration.declarations as BabelNode[]) {
        const id = declarator.id as BabelNode;
        const init = declarator.init as BabelNode | null;
        if (id.type === 'Identifier' && init) {
          this.variables.set(id.name as string, slice(init));
        }
      }
    }

    const ancestors: BabelNode[] = [];
    walk(ast, {
      enter: (node: BabelNode) => {
        ancestors.push(node);
        const parent = ancestors.at(-2);
        if (
          node.type !== 'ObjectExpression' ||
          (parent?.type !== 'VariableDeclarator' &&
            parent?.type !== 'ObjectProperty')
        ) {
          return;
        }
        this.objects.set(writtenMemberExpressionTo(ancestors), {
          properties: (node.properties as BabelNode[]).filter(
            (property) => property.type === 'ObjectProperty',
          ),
          offset,
        });
      },
      leave: () => {
        ancestors.pop();
      },
    });
  }

  /** The code of a variable in place of its name, as upstream does. */
  inline(code: string) {
    const name = code.trim();
    return /^[A-Za-z_$][\w$]*$/.test(name)
      ? (this.variables.get(name) ?? code)
      : code;
  }

  /** The imports some pieces of code need to run on their own. */
  importsFor(codes: string[]) {
    const identifiers = new Set(
      codes.flatMap((code) => [...getIdentifiers(code)]),
    );
    return this.imports
      .filter(({ names }) => names.some((name) => identifiers.has(name)))
      .map((declaration) => declaration.code);
  }
}

/** The features an email uses, collected as its source is read. */
class FeatureCollector {
  readonly elements: SourceUsage[] = [];
  readonly attributes: SourceUsage[] = [];
  readonly styleProperties: StylePropertyUsage[] = [];
  /** Class lists, by the last place they're written at, as upstream does. */
  readonly classLists = new Map<string, SourceLocation>();
  hasTailwind = false;
  readonly tailwindProps: {
    config?: string;
    theme?: TailwindCssProp;
    utility?: TailwindCssProp;
  } = {};
  private readonly resolve: PositionResolver;

  constructor(
    readonly source: string,
    readonly scope: ScriptScope,
  ) {
    this.resolve = createPositionResolver(source);
  }

  location(start: number, end: number) {
    return toLocation(this.resolve, start, end);
  }

  /** Reads a prop of `<Tailwind>`, only the first of each. */
  setTailwindProp(name: TailwindPropName, prop: TailwindCssProp) {
    if (this.tailwindProps[name]) return;
    if (name === 'config') {
      if ('code' in prop)
        this.tailwindProps.config = this.scope.inline(prop.code);
    } else {
      this.tailwindProps[name] =
        'code' in prop ? { code: this.scope.inline(prop.code) } : prop;
    }
  }

  /**
   * The properties of what `style` is bound to: style objects, written in
   * place or in a variable, like `styles.button`. The expression starts at
   * the given offset of the source.
   */
  addStyleExpression(expression: BabelNode, offset: number) {
    const addProperties = (properties: BabelNode[], propertyOffset: number) => {
      for (const property of properties) {
        const styleProperty = this.stylePropertyFrom(property, propertyOffset);
        if (styleProperty) this.styleProperties.push(styleProperty);
      }
    };

    if (expression.type === 'ArrayExpression') {
      for (const element of expression.elements as (BabelNode | null)[]) {
        if (element) this.addStyleExpression(element, offset);
      }
    } else if (expression.type === 'ObjectExpression') {
      addProperties(expression.properties as BabelNode[], offset);
    } else if (
      expression.type === 'Identifier' ||
      expression.type === 'MemberExpression'
    ) {
      const written = this.source
        .slice(offset + expression.start!, offset + expression.end!)
        .replace(/\s+/g, '');
      const styleObject = this.scope.objects.get(written);
      if (styleObject) {
        addProperties(styleObject.properties, styleObject.offset);
      }
    }
  }

  /** A property of a style object, as upstream reads it. */
  private stylePropertyFrom(
    property: BabelNode,
    offset: number,
  ): StylePropertyUsage | undefined {
    if (property.type !== 'ObjectProperty' || property.computed) return;

    const key = property.key as BabelNode;
    const name =
      key.type === 'StringLiteral'
        ? (key.value as string)
        : key.type === 'Identifier'
          ? (key.name as string)
          : undefined;
    if (name === undefined) return;

    const valueNode = property.value as BabelNode;
    const value =
      valueNode.type === 'StringLiteral'
        ? (valueNode.value as string)
        : valueNode.type === 'NumericLiteral'
          ? String(valueNode.value)
          : undefined;
    if (value === undefined) return;

    return {
      name,
      value,
      location: this.location(offset + property.start!, offset + property.end!),
    };
  }

  /** The class lists of the string literals of what `class` is bound to. */
  addClassExpression(expression: BabelNode, offset: number) {
    walk(expression, {
      enter: (node: BabelNode) => {
        if (node.type !== 'StringLiteral') return;
        this.classLists.set(
          node.value as string,
          this.location(offset + node.start!, offset + node.end!),
        );
      },
    });
  }

  /** The properties of a `style` attribute written as CSS. */
  addStyleDeclarations(css: string, offset: number) {
    let ast: ReturnType<typeof parseCss>;
    try {
      ast = parseCss(css, { context: 'declarationList', positions: true });
    } catch {
      return;
    }
    walkCss(ast, (node) => {
      if (node.type !== 'Declaration' || !node.loc) return;
      this.styleProperties.push({
        name: snakeToCamel(node.property),
        value: generate(node.value).trim(),
        location: this.location(
          offset + node.loc.start.offset,
          offset + node.loc.end.offset,
        ),
      });
    });
  }
}

const collectVueAttribute = (
  attribute: VueAttribute,
  isTailwind: boolean,
  collector: FeatureCollector,
) => {
  collector.attributes.push({
    name: attribute.name,
    location: collector.location(
      attribute.nameLoc.start.offset,
      attribute.nameLoc.end.offset,
    ),
  });
  const { value } = attribute;
  if (!value) return;

  if (attribute.name === 'style') {
    const quoted = /^["']/.test(value.loc.source);
    collector.addStyleDeclarations(
      value.content,
      value.loc.start.offset + (quoted ? 1 : 0),
    );
  } else if (attribute.name === 'class') {
    collector.classLists.set(
      value.content,
      collector.location(value.loc.start.offset, value.loc.end.offset),
    );
  } else if (isTailwind && isTailwindProp(attribute.name)) {
    collector.setTailwindProp(attribute.name, { literal: value.content });
  }
};

const collectVueBinding = (
  directive: VueDirective,
  isTailwind: boolean,
  collector: FeatureCollector,
) => {
  if (directive.name !== 'bind' || !directive.arg?.isStatic) return;
  const name = directive.arg.content;
  collector.attributes.push({
    name,
    location: collector.location(
      directive.arg.loc.start.offset,
      directive.arg.loc.end.offset,
    ),
  });
  if (!directive.exp) return;

  if (isTailwind && isTailwindProp(name)) {
    collector.setTailwindProp(name, { code: directive.exp.content });
    return;
  }
  if (name !== 'style' && name !== 'class') return;

  const expression = parseExpression(directive.exp.content);
  if (!expression) return;
  // It's parsed in parentheses, which come before where it starts
  const offset = directive.exp.loc.start.offset - 1;
  if (name === 'style') collector.addStyleExpression(expression, offset);
  else collector.addClassExpression(expression, offset);
};

const collectVueTemplate = (nodes: VueNode[], collector: FeatureCollector) => {
  for (const node of nodes) {
    if (node.type !== ELEMENT) {
      if (node.children) collectVueTemplate(node.children, collector);
      continue;
    }
    const element = node as VueElement;

    // `<template>` tags don't make it into the markup
    if (element.tagType !== TEMPLATE_TAG_TYPE) {
      const nameStart = element.loc.start.offset + 1;
      collector.elements.push({
        name: element.tag,
        location: collector.location(nameStart, nameStart + element.tag.length),
      });
    }

    const isTailwind = element.tag === 'Tailwind';
    if (isTailwind) collector.hasTailwind = true;
    for (const prop of element.props) {
      if (prop.type === ATTRIBUTE) {
        collectVueAttribute(prop, isTailwind, collector);
      } else {
        collectVueBinding(prop, isTailwind, collector);
      }
    }

    collectVueTemplate(element.children, collector);
  }
};

const collectVueFeatures = (source: string, emailPath: string) => {
  const { descriptor } = parseSfc(source, { filename: emailPath });
  const scope = new ScriptScope();
  for (const block of [descriptor.script, descriptor.scriptSetup]) {
    if (!block) continue;
    const plugins: ('typescript' | 'jsx')[] = [];
    if (block.lang === 'ts' || block.lang === 'tsx') plugins.push('typescript');
    if (block.lang === 'jsx' || block.lang === 'tsx') plugins.push('jsx');
    scope.add(block.content, block.loc.start.offset, plugins);
  }

  const collector = new FeatureCollector(source, scope);
  const templateAst = descriptor.template?.ast as
    | { children: VueNode[] }
    | undefined;
  if (templateAst) collectVueTemplate(templateAst.children, collector);
  return collector;
};

/** Reads emails written with JSX, the way upstream reads React emails. */
const collectJsxFeatures = (source: string) => {
  const scope = new ScriptScope();
  scope.add(source, 0, ['typescript', 'jsx']);
  const collector = new FeatureCollector(source, scope);

  let ast: BabelNode;
  try {
    ast = babelParse(source, {
      sourceType: 'unambiguous',
      errorRecovery: true,
      plugins: ['typescript', 'jsx'],
    }) as unknown as BabelNode;
  } catch {
    return collector;
  }

  // Whether each opening element being read is a `<Tailwind>`
  const openingElements: boolean[] = [];
  walk(ast, {
    enter(node: BabelNode) {
      if (node.type === 'JSXOpeningElement') {
        const name = node.name as BabelNode;
        const isIdentifier = name.type === 'JSXIdentifier';
        const isTailwind = isIdentifier && name.name === 'Tailwind';
        openingElements.push(isTailwind);
        if (isTailwind) collector.hasTailwind = true;
        if (isIdentifier) {
          collector.elements.push({
            name: name.name as string,
            location: collector.location(name.start!, name.end!),
          });
        }
        return;
      }
      if (node.type !== 'JSXAttribute') return;

      const nameNode = node.name as BabelNode;
      if (nameNode.type !== 'JSXIdentifier') return;
      const name = nameNode.name as string;
      collector.attributes.push({
        name,
        location: collector.location(nameNode.start!, nameNode.end!),
      });

      const value = node.value as BabelNode | null;
      const expression =
        value?.type === 'JSXExpressionContainer'
          ? (value.expression as BabelNode)
          : undefined;
      if (openingElements.at(-1) && isTailwindProp(name)) {
        if (value?.type === 'StringLiteral') {
          collector.setTailwindProp(name, { literal: value.value as string });
        } else if (expression?.start != null) {
          collector.setTailwindProp(name, {
            code: source.slice(expression.start, expression.end!),
          });
        }
      } else if ((name === 'className' || name === 'class') && value) {
        collector.addClassExpression(value, 0);
      } else if (name === 'style' && expression) {
        collector.addStyleExpression(expression, 0);
      }
    },
    leave(node: BabelNode) {
      if (node.type === 'JSXOpeningElement') openingElements.pop();
    },
  });
  return collector;
};

/**
 * Finds what an email's source uses that email clients might not support,
 * the way upstream reads the source of React emails: the elements and
 * attributes of its templates, and the style properties of its `style`
 * attributes and of the Tailwind classes of its `class` attributes, all
 * located in its source. `.vue` emails are read through their templates.
 */
export async function getUsedSourceFeatures(
  source: string,
  emailPath: string,
  setupTailwind: SetupTailwind,
): Promise<SourceFeatures> {
  const collector =
    path.extname(emailPath) === '.vue'
      ? collectVueFeatures(source, emailPath)
      : collectJsxFeatures(source);

  const tailwindProperties: StylePropertyUsage[] = [];
  if (collector.hasTailwind) {
    const { config, theme, utility } = collector.tailwindProps;
    const codes = [config, theme, utility].flatMap((prop) =>
      typeof prop === 'string'
        ? [prop]
        : prop && 'code' in prop
          ? [prop.code]
          : [],
    );
    const inline = await setupTailwind(
      { imports: collector.scope.importsFor(codes), config, theme, utility },
      [...collector.classLists.keys()].flatMap((classes) =>
        classes.split(/\s+/),
      ),
    );
    for (const [classes, location] of collector.classLists) {
      for (const [name, value] of Object.entries(
        inline(classes.split(/\s+/)),
      )) {
        tailwindProperties.push({ name, value, location });
      }
    }
  }

  return {
    elements: collector.elements,
    attributes: collector.attributes,
    styleProperties: [...tailwindProperties, ...collector.styleProperties],
  };
}
