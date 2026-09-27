import { beforeEach, describe, expect, it } from 'vitest';
import { createApp, defineComponent, h, ref } from 'vue';
import {
  readWorkspaceValue,
  writeWorkspaceValue,
} from '../utils/workspace-storage';
import { useCachedWorkspaceState } from './use-cached-workspace-state';
import { provideWorkspaceId } from './use-workspace';

const mountWithWorkspace = <T>(workspaceId: string, composable: () => T) => {
  let result: T | undefined;
  const Child = defineComponent({
    setup() {
      result = composable();
      return () => null;
    },
  });
  const Parent = defineComponent({
    setup() {
      provideWorkspaceId(workspaceId);
      return () => h(Child);
    },
  });
  const app = createApp(Parent);
  app.mount(document.createElement('div'));
  return { result: result as T, unmount: () => app.unmount() };
};

describe('useCachedWorkspaceState()', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reads what is stored for the workspace', () => {
    writeWorkspaceValue('workspace', 'test-email-recipient', 'me@example.com');

    const { result } = mountWithWorkspace('workspace', () =>
      useCachedWorkspaceState<string>('test-email-recipient'),
    );

    expect(result[0].value).toBe('me@example.com');
  });

  it('writes to the workspace, and deletes with undefined', () => {
    const { result } = mountWithWorkspace('workspace', () =>
      useCachedWorkspaceState<boolean>('props-panel-open'),
    );
    const [value, setValue] = result;

    expect(value.value).toBeUndefined();

    setValue(true);
    expect(readWorkspaceValue('workspace', 'props-panel-open')).toBe(true);
    expect(value.value).toBe(true);

    setValue(undefined);
    expect(readWorkspaceValue('workspace', 'props-panel-open')).toBeUndefined();
    expect(value.value).toBeUndefined();
  });

  it('reads again when the key changes', () => {
    writeWorkspaceValue('workspace', 'test-email-subject:welcome', 'Welcome!');
    writeWorkspaceValue('workspace', 'test-email-subject:reset', 'Reset');

    const key = ref('test-email-subject:welcome');
    const { result } = mountWithWorkspace('workspace', () =>
      useCachedWorkspaceState<string>(key),
    );

    expect(result[0].value).toBe('Welcome!');
    key.value = 'test-email-subject:reset';
    expect(result[0].value).toBe('Reset');
  });

  it('keeps workspaces apart', () => {
    writeWorkspaceValue('other', 'test-email-recipient', 'other@example.com');

    const { result } = mountWithWorkspace('workspace', () =>
      useCachedWorkspaceState<string>('test-email-recipient'),
    );

    expect(result[0].value).toBeUndefined();
  });
});
