<script setup lang="ts">
import { computed, ref } from 'vue';
import type { EmailsDirectory } from '../../../shared/types';
import { renderEmail } from '../../api';
import { useEmails } from '../../composables/use-emails';
import IconCloudAlert from '../../icons/icon-cloud-alert.vue';
import IconCloudCheck from '../../icons/icon-cloud-check.vue';
import IconLoader from '../../icons/icon-loader.vue';
import Button from '../button.vue';
import Results from './results.vue';
import ResultsColumn from './results-column.vue';
import ResultsRow from './results-row.vue';
import { uploadTemplateToResend } from './toolbar-api';

interface ResendItem {
  status: 'uploading' | 'failed' | 'succeeded';
  name: string;
  id?: string;
}

const props = defineProps<{
  emailSlug: string;
  htmlMarkup: string;
}>();

const { emailsDirectory } = useEmails();
const items = ref<ResendItem[]>([]);
const isExportSinglePending = ref(false);
const isBulkProcessing = ref(false);

const getAllDirectories = (metadata: EmailsDirectory): EmailsDirectory[] => {
  const result = [metadata];
  for (const subDir of metadata.subDirectories) {
    result.push(...getAllDirectories(subDir));
  }
  return result;
};

const loading = computed(
  () => isExportSinglePending.value || isBulkProcessing.value,
);

const updateItem = (index: number, update: Partial<ResendItem>) => {
  items.value = items.value.map((item, i) =>
    i === index ? { ...item, ...update } : item,
  );
};

const upload = async () => {
  items.value = [
    {
      status: 'uploading',
      name: props.emailSlug,
    },
  ];

  isExportSinglePending.value = true;
  try {
    items.value = [
      await uploadTemplateToResend({
        name: props.emailSlug,
        html: props.htmlMarkup,
      }),
    ];
  } catch (error) {
    console.error('Error uploading %s:', props.emailSlug, error);
    items.value = [{ status: 'failed', name: props.emailSlug }];
  } finally {
    isExportSinglePending.value = false;
  }
};

const bulkUpload = async () => {
  const allDirectories = emailsDirectory.value
    ? getAllDirectories(emailsDirectory.value)
    : [];
  const allEmailSlugs = allDirectories.flatMap((dir) =>
    dir.emailFilenames.map((filename) => {
      // Relative paths use backslashes on Windows
      const relativePath = dir.relativePath.replaceAll('\\', '/');
      const slug = relativePath ? `${relativePath}/${filename}` : filename;
      return {
        name: slug,
        status: 'uploading' as const,
      };
    }),
  );

  items.value = allEmailSlugs;
  isBulkProcessing.value = true;

  for (let i = 0; i < allEmailSlugs.length; i++) {
    const emailItem = allEmailSlugs[i];
    if (!emailItem) continue;

    const emailSlug = emailItem.name;
    // Remove file extension, keeping the directory structure
    const templateName = emailSlug.replace(/\.[^/.]+$/, '');

    try {
      const renderResult = await renderEmail(emailSlug);

      if ('error' in renderResult) {
        updateItem(i, { status: 'failed' });
        continue;
      }

      const exportResult = await uploadTemplateToResend({
        name: templateName,
        html: renderResult.markup,
      });

      if (exportResult.status === 'succeeded') {
        updateItem(i, { status: 'succeeded', id: exportResult.id });
      } else {
        updateItem(i, { status: 'failed' });
      }

      // This avoid exceeding the default rate limit of 2 requests per second
      await new Promise((resolve) => setTimeout(resolve, 600));
    } catch (error) {
      console.error('Error processing %s:', emailSlug, error);
      updateItem(i, { status: 'failed' });
    }
  }

  isBulkProcessing.value = false;
};
</script>

<template>
  <div
    v-if="items.length === 0 && !loading"
    class="flex flex-col items-center justify-center pt-8"
  >
    <h3 class="text-slate-12 font-medium text-base mb-1">Upload to Resend</h3>
    <p class="text-slate-11 text-sm text-center max-w-[320px]">
      Import your email using the Templates API.
    </p>
    <div class="flex gap-2">
      <Button @click="upload">Upload</Button>
      <Button appearance="gradient" class="mt-2 mb-4" @click="bulkUpload">
        Bulk Upload
      </Button>
    </div>
  </div>

  <Results v-else>
    <ResultsRow v-for="(item, index) in items" :key="item.id || index">
      <ResultsColumn>
        <span
          v-if="item.status === 'uploading'"
          class="flex gap-2 items-center text-slate-12"
        >
          <IconLoader class="animate-spin" />
          {{ item.name }}
        </span>
        <span
          v-if="item.status === 'failed'"
          class="flex gap-2 items-center text-red-400"
        >
          <IconCloudAlert />
          {{ item.name }}
        </span>
        <span
          v-if="item.status === 'succeeded'"
          class="flex gap-2 items-center text-green-400"
        >
          <IconCloudCheck />
          {{ item.name }}
        </span>
      </ResultsColumn>
      <ResultsColumn>
        {{
          item.status === 'uploading'
            ? 'Uploading...'
            : item.status === 'failed'
              ? 'Failed to upload. Try again.'
              : 'Template uploaded successfully.'
        }}
      </ResultsColumn>
      <ResultsColumn>
        <a
          v-if="item.status === 'succeeded'"
          :href="`https://resend.com/templates/${item.id}/editor`"
          class="underline ml-2 decoration-slate-9 decoration-1 hover:decoration-slate-11 transition-colors hover:text-slate-12"
          rel="noreferrer"
          target="_blank"
        >
          Open in Resend ↗
        </a>
      </ResultsColumn>
    </ResultsRow>
  </Results>
</template>
