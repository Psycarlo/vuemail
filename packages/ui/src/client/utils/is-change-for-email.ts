import type { HotReloadChange } from '../../shared/types';
import { removeFilenameExtension } from './remove-filename-extension';

/** Whether a changed file is the file of the email with the given slug. */
export const isChangeForEmail = (change: HotReloadChange, emailSlug: string) =>
  change.filename === emailSlug ||
  removeFilenameExtension(change.filename) === emailSlug;
