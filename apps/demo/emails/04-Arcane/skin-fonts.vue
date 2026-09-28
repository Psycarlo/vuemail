<script setup lang="ts">
import { Font } from '@vuemaildev/vuemail';
</script>

<template>
  <Font
    font-family="Instrument Serif"
    :fallback-font-family="['Georgia', 'Times New Roman', 'serif']"
    :web-font="{
      url: 'https://fonts.gstatic.com/s/instrumentserif/v5/jizBRFtNs2ka5fXjeivQ4LroWlx-6zUTjg.woff2',
      format: 'woff2',
    }"
    :font-weight="400"
    font-style="normal"
  />
  <Font
    font-family="Inter"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{
      url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
      format: 'woff2',
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
