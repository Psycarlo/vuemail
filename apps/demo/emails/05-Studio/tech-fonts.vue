<script setup lang="ts">
/** Geist + Inter via `vuemail` (avoids `<style>` + `@import`, which Gmail strips). */
import { Font } from 'vuemail';

const geistLatinWoff2 =
  'https://fonts.gstatic.com/s/geist/v4/gyByhwUxId8gMEwcGFU.woff2';
</script>

<template>
  <Font
    font-family="Geist"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{ url: geistLatinWoff2, format: 'woff2' }"
    :font-weight="400"
    font-style="normal"
  />
  <Font
    font-family="Geist"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{ url: geistLatinWoff2, format: 'woff2' }"
    :font-weight="450"
    font-style="normal"
  />
  <Font
    font-family="Geist"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{ url: geistLatinWoff2, format: 'woff2' }"
    :font-weight="500"
    font-style="normal"
  />
  <Font
    font-family="Geist"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{ url: geistLatinWoff2, format: 'woff2' }"
    :font-weight="600"
    font-style="normal"
  />
  <Font
    font-family="Geist"
    :fallback-font-family="['Arial', 'sans-serif']"
    :web-font="{ url: geistLatinWoff2, format: 'woff2' }"
    :font-weight="700"
    font-style="normal"
  />
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
      url: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuOKfMZg.ttf',
      format: 'truetype',
    }"
    :font-weight="450"
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
