import InspectorBreadcrumb from './breadcrumb.vue';
import InspectorDocument from './document.vue';
import InspectorNode from './node.vue';
import { InspectorRoot } from './root';
import AttributesSection from './sections/attributes.vue';
import BackgroundSection from './sections/background.vue';
import BorderSection from './sections/border.vue';
import ColumnSpacingSection from './sections/column-spacing.vue';
import LinkSection from './sections/link.vue';
import PaddingSection from './sections/padding.vue';
import SizeSection from './sections/size.vue';
import TypographySection from './sections/typography.vue';
import InspectorText from './text.vue';

export const Inspector = {
  Root: InspectorRoot,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
  Node: InspectorNode,
  Text: InspectorText,
  Attributes: AttributesSection,
  Background: BackgroundSection,
  Border: BorderSection,
  ColumnSpacing: ColumnSpacingSection,
  Link: LinkSection,
  Padding: PaddingSection,
  Size: SizeSection,
  Typography: TypographySection,
};

export type {
  InspectorBreadcrumbSegment,
  InspectorBreadcrumbSlots,
} from './breadcrumb.vue';
export type { NodeMeta } from './config/node-meta';
export { getNodeMeta } from './config/node-meta';
export type {
  InspectorDocumentContext,
  InspectorDocumentProps,
  InspectorDocumentSlots,
} from './document.vue';
export type {
  InspectorNodeContext,
  InspectorNodeProps,
  InspectorNodeSlots,
} from './node.vue';
export type {
  InspectorTextContext,
  InspectorTextProps,
  InspectorTextSlots,
} from './text.vue';
