import { type InjectionKey, inject, provide, type Ref, ref } from 'vue';
import type { EmailsDirectory } from '../../shared/types';
import { fetchEmailsDirectory } from '../api';
import { useHotReload } from './use-hot-reload';

interface EmailsContext {
  emailsDirectory: Ref<EmailsDirectory | undefined>;
  refresh(): Promise<void>;
}

const emailsKey: InjectionKey<EmailsContext> = Symbol('emails');

/** Loads the emails directory, and keeps it up to date as files change. */
export function provideEmails(): EmailsContext {
  const emailsDirectory = ref<EmailsDirectory>();

  const refresh = async () => {
    try {
      emailsDirectory.value = await fetchEmailsDirectory();
    } catch (exception) {
      console.error(
        'Unable to load the emails directory for the sidebar',
        exception,
      );
    }
  };

  // Any change can add or remove an email, like a component that starts
  // rendering an `<Html>` element
  useHotReload(() => {
    void refresh();
  });

  void refresh();

  const context = { emailsDirectory, refresh };
  provide(emailsKey, context);
  return context;
}

export function useEmails(): EmailsContext {
  const context = inject(emailsKey);
  if (!context) throw new Error('useEmails() needs provideEmails() above it');
  return context;
}
