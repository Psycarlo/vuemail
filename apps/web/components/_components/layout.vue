<script setup lang="ts">
// Wraps every component of the gallery when it's previewed, the same way
// for all of them. It's not part of the code shown for each component.
import { Body, Container, Font, Head, Html, Tailwind } from 'vuemail';
import tailwindConfig from '../tailwind.config';

const { withTailwind = true } = defineProps<{ withTailwind?: boolean }>();

const containerStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  boxSizing: 'border-box',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  height: '100vh',
} as const;
</script>

<template>
  <Html>
    <Head>
      <Font
        fallback-font-family="Helvetica"
        font-family="Inter"
        font-style="normal"
        :font-weight="400"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2',
          format: 'woff2',
        }"
      />
      <Font
        fallback-font-family="Helvetica"
        font-family="Inter"
        font-style="normal"
        :font-weight="600"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50PDca1ZL7.woff2',
          format: 'woff2',
        }"
      />
      <Font
        fallback-font-family="Helvetica"
        font-family="Inter"
        font-style="normal"
        :font-weight="700"
        :web-font="{
          url: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fjbvMwCp50BTca1ZL7.woff2',
          format: 'woff2',
        }"
      />
    </Head>

    <Body :style="{ margin: '0', marginLeft: '12px', marginRight: '12px' }">
      <Tailwind v-if="withTailwind" :config="tailwindConfig">
        <Container :style="containerStyle">
          <slot />
        </Container>
      </Tailwind>
      <Container v-else :style="containerStyle">
        <slot />
      </Container>
    </Body>
  </Html>
</template>
