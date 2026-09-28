// Node below 20.12 has no util.styleText. A static import of it would throw at
// module load, before the dev command can print its "upgrade Node" message.
import * as nodeUtil from 'node:util';

type StyleTextFunction = typeof nodeUtil.styleText;

export const styleText: StyleTextFunction =
  (nodeUtil as { styleText?: StyleTextFunction }).styleText ??
  ((_format, text) => text);
