<script setup lang="ts">
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui';
import { computed, onBeforeUnmount, ref, useId } from 'vue';
import { toast } from 'vue-sonner';
import { useCachedWorkspaceState } from '../composables/use-cached-workspace-state';
import Button from './button.vue';
import Text from './text.vue';

const props = defineProps<{
  markup: string;
  defaultSubject?: string;
  /**
   * Stable identifier for the email template (typically the slug/relative
   * path). When provided, user edits to the subject are persisted in
   * localStorage so the next visit reuses what they typed.
   */
  storageKey?: string;
}>();

const fallbackSubject = computed(
  () => props.defaultSubject?.trim() || 'Testing Vuemail',
);

const [cachedSubject, setCachedSubject] = useCachedWorkspaceState<string>(
  `test-email-subject:${props.storageKey ?? ''}`,
);
// The recipient is cached under a single workspace-wide key — testers
// usually send to the same address regardless of which template they're
// on, so per-template scoping would just make them retype it.
const [cachedRecipient, setCachedRecipient] = useCachedWorkspaceState<string>(
  'test-email-recipient',
);

const to = ref(cachedRecipient.value ?? '');
const subject = ref(cachedSubject.value ?? fallbackSubject.value);
const isSending = ref(false);
const isPopOverOpen = ref(false);

const onFormSubmit = async () => {
  isSending.value = true;

  try {
    const response = await fetch('https://vuemail.dev/api/send/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: to.value,
        subject: subject.value,
        html: props.markup,
      }),
    });

    if (response.ok) {
      toast.success('Email sent! Check your inbox.');
    } else if (response.status === 429) {
      toast.error('Too many requests. Try again in around 1 minute');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  } catch {
    toast.error('Something went wrong. Please try again.');
  }

  isSending.value = false;
};

const onRecipientInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value;
  to.value = next;
  if (next.length === 0) {
    setCachedRecipient(undefined);
  } else {
    setCachedRecipient(next);
  }
};

const onSubjectInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value;
  subject.value = next;
  if (!props.storageKey) return;

  // Persist the override only when the user diverges from the inferred
  // title; if they revert to the default (or clear the field), drop the
  // override so future changes to the inferred title can take effect.
  if (next === fallbackSubject.value || next.length === 0) {
    setCachedSubject(undefined);
  } else {
    setCachedSubject(next);
  }
};

const onOpenChange = () => {
  if (!isPopOverOpen.value) {
    document.body.classList.add('popup-open');
    isPopOverOpen.value = true;
  } else {
    document.body.classList.remove('popup-open');
    isPopOverOpen.value = false;
  }
};

onBeforeUnmount(() => {
  if (isPopOverOpen.value) document.body.classList.remove('popup-open');
});

const toId = useId();
const subjectId = useId();
</script>

<template>
  <PopoverRoot :open="isPopOverOpen" @update:open="onOpenChange">
    <PopoverTrigger as-child>
      <button
        class="box-border flex h-5 w-20 items-center justify-center self-center rounded-lg border border-slate-6 bg-slate-2 px-4 py-4 text-center font-sans text-sm text-slate-11 outline-hidden transition duration-300 ease-in-out hover:border-slate-10 hover:text-slate-12"
        type="submit"
      >
        Send
      </button>
    </PopoverTrigger>
    <PopoverAnchor />
    <PopoverPortal>
      <PopoverContent
        align="end"
        class="-mt-10 w-80 rounded-lg border border-slate-6 bg-black/70 p-3 text-slate-11 shadow-md backdrop-blur-lg font-sans"
        :side-offset="48"
      >
        <form class="mt-1" @submit.prevent="onFormSubmit">
          <label
            class="mb-2 block text-xs uppercase text-slate-10"
            :for="toId"
          >
            Recipient
          </label>
          <input
            :id="toId"
            autofocus
            class="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
            placeholder="you@example.com"
            required
            type="email"
            :value="to"
            @input="onRecipientInput"
          />
          <label
            class="mb-2 mt-1 block text-xs uppercase text-slate-10"
            :for="subjectId"
          >
            Subject
          </label>
          <input
            :id="subjectId"
            class="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
            placeholder="My Email"
            required
            type="text"
            :value="subject"
            @input="onSubjectInput"
          />
          <input class="appearance-none checked:bg-blue-500" type="checkbox" />
          <div class="mt-3 flex items-center justify-between">
            <div class="inline-flex flex-col">
              <Text size="1">
                Powered by
                <a
                  class="text-white/85 transition duration-300 ease-in-out hover:text-slate-12"
                  href="https://resend.com"
                  rel="noreferrer"
                  target="_blank"
                  >Resend</a
                >
              </Text>
            </div>
            <Button
              class="disabled:border-transparent disabled:bg-slate-11 m-0"
              :disabled="subject.length === 0 || to.length === 0 || isSending"
              type="submit"
            >
              Send
            </Button>
          </div>
        </form>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
