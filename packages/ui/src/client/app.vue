<script setup lang="ts">
import AppShell from './components/app-shell.vue';
import { provideEmails } from './composables/use-emails';
import { provideWorkspaceId } from './composables/use-workspace';
import { config } from './config';

provideWorkspaceId(config.workspaceId);
provideEmails();
</script>

<template>
  <div class="bg-linear-to-t from-slate-3 flex flex-col">
    <AppShell>
      <RouterView />
    </AppShell>
  </div>
</template>
