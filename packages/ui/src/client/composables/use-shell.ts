import { type InjectionKey, inject, provide, type Ref } from 'vue';

interface ShellContext {
  sidebarToggled: Ref<boolean>;
  toggleSidebar: () => void;
}

const shellKey: InjectionKey<ShellContext> = Symbol('shell');

export function provideShell(context: ShellContext) {
  provide(shellKey, context);
}

export function useShell(): ShellContext {
  const context = inject(shellKey, undefined);

  if (typeof context === 'undefined') {
    throw new Error('Cannot call `useShell` outside of the app shell.');
  }

  return context;
}
