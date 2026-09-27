<script setup lang="ts">
/**
 * Inter variable family (weights 100–900) via Google CSS `@import`.
 * Many webmail clients strip `@import`; the `<Font>` entries below register 400 / 500 / 600
 * static files as a fallback when the import does not run.
 */
import { h } from 'vue';
import { Font } from 'vuemail';

// Vue leaves <style> tags out of templates, so this one is rendered from here
const InterImport = () =>
  h('style', {
    innerHTML: `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');`,
  });
</script>

<template>
  <InterImport />
  <Font
    font-family="Inter"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{
      url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf',
      format: 'truetype',
    }"
    :font-weight="400"
    font-style="normal"
  />
  <Font
    font-family="Inter"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{
      url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf',
      format: 'truetype',
    }"
    :font-weight="500"
    font-style="normal"
  />
  <Font
    font-family="Inter"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{
      url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf',
      format: 'truetype',
    }"
    :font-weight="600"
    font-style="normal"
  />
</template>
