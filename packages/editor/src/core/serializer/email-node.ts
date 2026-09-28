import {
  type Editor,
  type JSONContent,
  Node,
  type NodeConfig,
  type NodeType,
} from '@tiptap/core';
import type { CSSProperties, VNodeChild } from 'vue';

export type NodeRenderer = (props: {
  node: JSONContent;
  style: CSSProperties;
  /** The node's content, already rendered. */
  children?: VNodeChild;

  extension: EmailNode<any, any>;
}) => VNodeChild;

export interface EmailNodeConfig<Options, Storage>
  extends NodeConfig<Options, Storage> {
  /** Renders the node into Vuemail components, when the email is composed. */
  renderToVueEmail: NodeRenderer;
}

type ConfigParameter<Options, Storage> = Partial<
  Omit<EmailNodeConfig<Options, Storage>, 'renderToVueEmail'>
> &
  Pick<EmailNodeConfig<Options, Storage>, 'renderToVueEmail'> &
  ThisType<{
    name: string;
    options: Options;
    storage: Storage;
    editor: Editor;
    type: NodeType;
    parent: (...args: any[]) => any;
  }>;

export class EmailNode<
  Options = Record<string, never>,
  Storage = Record<string, never>,
> extends Node<Options, Storage> {
  declare config: EmailNodeConfig<Options, Storage>;

  // Only here to change the type of `config`
  constructor(config: ConfigParameter<Options, Storage>) {
    super(config);
  }

  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create<O = Record<string, never>, S = Record<string, never>>(
    config: ConfigParameter<O, S> | (() => ConfigParameter<O, S>),
  ) {
    // If the config is a function, execute it to get the configuration object
    const resolvedConfig = typeof config === 'function' ? config() : config;
    return new EmailNode<O, S>(resolvedConfig);
  }

  static from<O, S>(
    node: Node<O, S>,
    renderToVueEmail: NodeRenderer,
  ): EmailNode<O, S> {
    const customNode = EmailNode.create({} as ConfigParameter<O, S>);
    // This only makes a shallow copy, so if there's nested objects here mutating things will be dangerous
    Object.assign(customNode, { ...node });
    customNode.config = { ...node.config, renderToVueEmail };
    return customNode;
  }

  // Subclass return types for configure/extend; safe at runtime. TipTap's Node typings cause TS2416 when returning EmailNode.
  // @ts-expect-error - EmailNode is a valid Node subclass; base typings don't support subclass return types
  configure(options?: Partial<Options>) {
    return super.configure(options) as EmailNode<Options, Storage>;
  }

  // @ts-expect-error - same as configure: extend returns EmailNode for chaining; base typings are incompatible
  // The config is typed as the email one directly: inferring a config type
  // from it would reject `renderToVueEmail`
  extend<ExtendedOptions = Options, ExtendedStorage = Storage>(
    extendedConfig?:
      | (() => Partial<EmailNodeConfig<ExtendedOptions, ExtendedStorage>>)
      | (Partial<EmailNodeConfig<ExtendedOptions, ExtendedStorage>> &
          ThisType<{
            name: string;
            options: ExtendedOptions;
            storage: ExtendedStorage;
            editor: Editor;
            type: NodeType;
          }>),
  ): EmailNode<ExtendedOptions, ExtendedStorage> {
    // If the extended config is a function, execute it to get the configuration object
    const resolvedConfig =
      typeof extendedConfig === 'function' ? extendedConfig() : extendedConfig;
    return super.extend(resolvedConfig) as EmailNode<
      ExtendedOptions,
      ExtendedStorage
    >;
  }
}
