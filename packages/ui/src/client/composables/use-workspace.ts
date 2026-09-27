import { type InjectionKey, inject, provide } from 'vue';

const workspaceKey: InjectionKey<string> = Symbol('workspace');

/**
 * Provides the stable identifier for the user's Vuemail project (a hash of
 * the project's absolute path). Used to namespace any per-project browser
 * persistence such as localStorage.
 */
export function provideWorkspaceId(id: string) {
  provide(workspaceKey, id);
}

export function useWorkspaceId(): string {
  const workspaceId = inject(workspaceKey, undefined);

  if (typeof workspaceId === 'undefined') {
    throw new Error(
      'Cannot call `useWorkspaceId` outside of a `provideWorkspaceId`.',
    );
  }

  return workspaceId;
}
