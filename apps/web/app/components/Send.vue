<script setup lang="ts">
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui';
import { ref, useId } from 'vue';
import { toast } from 'vue-sonner';

// The attributes, like classes, go to the button opening the popover
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  markup: string;
  defaultSubject?: string;
}>();

const to = ref('');
const subject = ref(props.defaultSubject ?? '');
const isSending = ref(false);
const isPopOverOpen = ref(false);

const onFormSubmit = async () => {
  try {
    isSending.value = true;

    const response = await fetch('/api/send/test', {
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
      const { error } = (await response.json()) as { error: string };
      console.error(error);
      toast.error(
        'Too many test emails were sent, try again in a few seconds.',
      );
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  } catch {
    toast.error('Something went wrong. Please try again.');
  } finally {
    isSending.value = false;
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

const toId = useId();
const subjectId = useId();
</script>

<template>
  <PopoverRoot :open="isPopOverOpen" @update:open="onOpenChange">
    <PopoverTrigger as-child>
      <button
        type="submit"
        v-bind="$attrs"
        class="flex items-center justify-center self-center rounded-lg bg-slate-6 border border-solid border-transparent px-3 py-1 h-full text-center font-sans text-sm text-slate-11 outline-hidden transition duration-300 ease-in-out hover:text-slate-12"
      >
        <slot>Send</slot>
      </button>
    </PopoverTrigger>
    <PopoverAnchor />
    <PopoverPortal>
      <PopoverContent
        align="end"
        class="-mt-10 w-80 rounded-lg border border-slate-6 bg-black/70 p-3 text-slate-11 shadow-md backdrop-blur-lg font-sans z-3"
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
            v-model="to"
            autofocus
            class="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
            placeholder="you@example.com"
            required
            type="email"
          />
          <label
            class="mb-2 mt-1 block text-xs uppercase text-slate-10"
            :for="subjectId"
          >
            Subject
          </label>
          <input
            :id="subjectId"
            v-model="subject"
            class="mb-3 w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10"
            placeholder="My Email"
            required
            type="text"
          />
          <input class="appearance-none checked:bg-blue-500" type="checkbox" />
          <div class="mt-3 flex items-center justify-between">
            <UiText class="inline-block" size="1">
              Powered by
              <a
                class="text-white/85 transition duration-300 ease-in-out hover:text-slate-12"
                href="https://resend.com"
                rel="noreferrer"
                target="_blank"
              >
                Resend
              </a>
            </UiText>
            <UiButton
              class="disabled:border-transparent disabled:bg-slate-11"
              :disabled="subject.length === 0 || to.length === 0 || isSending"
              type="submit"
            >
              Send
            </UiButton>
          </div>
        </form>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
