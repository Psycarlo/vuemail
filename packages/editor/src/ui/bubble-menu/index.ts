import BubbleMenuAlignCenter from './align-center.vue';
import BubbleMenuAlignLeft from './align-left.vue';
import BubbleMenuAlignRight from './align-right.vue';
import { BubbleMenuBold } from './bold';
import BubbleMenuButtonDefault from './button-default.vue';
import BubbleMenuButtonEditLink from './button-edit-link.vue';
import BubbleMenuButtonForm from './button-form.vue';
import BubbleMenuButtonToolbar from './button-toolbar.vue';
import BubbleMenuButtonUnlink from './button-unlink.vue';
import { BubbleMenuCode } from './code';
import BubbleMenuItemGroup from './group.vue';
import BubbleMenuImageDefault from './image-default.vue';
import BubbleMenuImageEditLink from './image-edit-link.vue';
import BubbleMenuImageForm from './image-form.vue';
import BubbleMenuImageToolbar from './image-toolbar.vue';
import BubbleMenuImageUnlink from './image-unlink.vue';
import { BubbleMenuItalic } from './italic';
import BubbleMenuItem from './item.vue';
import BubbleMenuLinkDefault from './link-default.vue';
import BubbleMenuLinkEditLink from './link-edit-link.vue';
import BubbleMenuLinkForm from './link-form.vue';
import BubbleMenuLinkOpenLink from './link-open-link.vue';
import BubbleMenuLinkSelector from './link-selector.vue';
import BubbleMenuLinkToolbar from './link-toolbar.vue';
import BubbleMenuLinkUnlink from './link-unlink.vue';
import {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector';
import BubbleMenuRoot from './root.vue';
import BubbleMenuSeparator from './separator.vue';
import { BubbleMenuStrike } from './strike';
import { BubbleMenuUnderline } from './underline';
import { BubbleMenuUppercase } from './uppercase';

// Named exports
export { default as BubbleMenuAlignCenter } from './align-center.vue';
export { default as BubbleMenuAlignLeft } from './align-left.vue';
export { default as BubbleMenuAlignRight } from './align-right.vue';
export { BubbleMenuBold } from './bold';
export type { BubbleMenuButtonDefaultProps } from './button-default.vue';
export { default as BubbleMenuButtonDefault } from './button-default.vue';
export type { BubbleMenuButtonEditLinkProps } from './button-edit-link.vue';
export { default as BubbleMenuButtonEditLink } from './button-edit-link.vue';
export type { BubbleMenuButtonFormProps } from './button-form.vue';
export { default as BubbleMenuButtonForm } from './button-form.vue';
export type { BubbleMenuButtonToolbarProps } from './button-toolbar.vue';
export { default as BubbleMenuButtonToolbar } from './button-toolbar.vue';
export type { BubbleMenuButtonUnlinkProps } from './button-unlink.vue';
export { default as BubbleMenuButtonUnlink } from './button-unlink.vue';
export { BubbleMenuCode } from './code';
export type { BubbleMenuContextValue } from './context';
export { useBubbleMenuContext } from './context';
export type { PreWiredItemProps } from './create-mark-bubble-item';
export type { BubbleMenuItemGroupProps } from './group.vue';
export { default as BubbleMenuItemGroup } from './group.vue';
export type { BubbleMenuImageDefaultProps } from './image-default.vue';
export { default as BubbleMenuImageDefault } from './image-default.vue';
export type { BubbleMenuImageEditLinkProps } from './image-edit-link.vue';
export { default as BubbleMenuImageEditLink } from './image-edit-link.vue';
export type { BubbleMenuImageFormProps } from './image-form.vue';
export { default as BubbleMenuImageForm } from './image-form.vue';
export type { BubbleMenuImageToolbarProps } from './image-toolbar.vue';
export { default as BubbleMenuImageToolbar } from './image-toolbar.vue';
export type { BubbleMenuImageUnlinkProps } from './image-unlink.vue';
export { default as BubbleMenuImageUnlink } from './image-unlink.vue';
export { BubbleMenuItalic } from './italic';
export type { BubbleMenuItemProps } from './item.vue';
export { default as BubbleMenuItem } from './item.vue';
export type { BubbleMenuLinkDefaultProps } from './link-default.vue';
export { default as BubbleMenuLinkDefault } from './link-default.vue';
export type { BubbleMenuLinkEditLinkProps } from './link-edit-link.vue';
export { default as BubbleMenuLinkEditLink } from './link-edit-link.vue';
export type { BubbleMenuLinkFormProps } from './link-form.vue';
export { default as BubbleMenuLinkForm } from './link-form.vue';
export type { BubbleMenuLinkOpenLinkProps } from './link-open-link.vue';
export { default as BubbleMenuLinkOpenLink } from './link-open-link.vue';
export type { BubbleMenuLinkSelectorProps } from './link-selector.vue';
export { default as BubbleMenuLinkSelector } from './link-selector.vue';
export type { BubbleMenuLinkToolbarProps } from './link-toolbar.vue';
export { default as BubbleMenuLinkToolbar } from './link-toolbar.vue';
export type { BubbleMenuLinkUnlinkProps } from './link-unlink.vue';
export { default as BubbleMenuLinkUnlink } from './link-unlink.vue';
export type {
  BubbleMenuNodeSelectorProps,
  BubbleMenuNodeSelectorSlots,
  NodeSelectorContentProps,
  NodeSelectorContentSlots,
  NodeSelectorItem,
  NodeSelectorRootProps,
  NodeSelectorTriggerProps,
  NodeType,
} from './node-selector';
export {
  BubbleMenuNodeSelector,
  NodeSelectorContent,
  NodeSelectorRoot,
  NodeSelectorTrigger,
} from './node-selector';
export type { BubbleMenuRootProps } from './root.vue';
export { default as BubbleMenuRoot } from './root.vue';
export type { BubbleMenuSeparatorProps } from './separator.vue';
export { default as BubbleMenuSeparator } from './separator.vue';
export { BubbleMenuStrike } from './strike';
export type { TriggerFn, TriggerParams } from './triggers';
export { bubbleMenuTriggers } from './triggers';
export { BubbleMenuUnderline } from './underline';
export { BubbleMenuUppercase } from './uppercase';

export const BubbleMenu = Object.assign(BubbleMenuRoot, {
  Root: BubbleMenuRoot,
  ItemGroup: BubbleMenuItemGroup,
  Separator: BubbleMenuSeparator,
  Item: BubbleMenuItem,
  Bold: BubbleMenuBold,
  Italic: BubbleMenuItalic,
  Underline: BubbleMenuUnderline,
  Strike: BubbleMenuStrike,
  Code: BubbleMenuCode,
  Uppercase: BubbleMenuUppercase,
  AlignLeft: BubbleMenuAlignLeft,
  AlignCenter: BubbleMenuAlignCenter,
  AlignRight: BubbleMenuAlignRight,
  NodeSelector: Object.assign(BubbleMenuNodeSelector, {
    Root: NodeSelectorRoot,
    Trigger: NodeSelectorTrigger,
    Content: NodeSelectorContent,
  }),
  LinkSelector: BubbleMenuLinkSelector,
  ButtonToolbar: BubbleMenuButtonToolbar,
  ButtonEditLink: BubbleMenuButtonEditLink,
  ButtonUnlink: BubbleMenuButtonUnlink,
  ButtonForm: BubbleMenuButtonForm,
  ButtonDefault: BubbleMenuButtonDefault,
  LinkToolbar: BubbleMenuLinkToolbar,
  LinkEditLink: BubbleMenuLinkEditLink,
  LinkUnlink: BubbleMenuLinkUnlink,
  LinkOpenLink: BubbleMenuLinkOpenLink,
  LinkForm: BubbleMenuLinkForm,
  LinkDefault: BubbleMenuLinkDefault,
  ImageToolbar: BubbleMenuImageToolbar,
  ImageEditLink: BubbleMenuImageEditLink,
  ImageUnlink: BubbleMenuImageUnlink,
  ImageForm: BubbleMenuImageForm,
  ImageDefault: BubbleMenuImageDefault,
} as const);
