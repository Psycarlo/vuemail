<script setup lang="ts">
defineProps<{ items: string[]; showFooter?: boolean }>();
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
  <p v-if="showFooter">Footer</p>
  <span v-html="'<!--[if mso]><i>outlook only</i><![endif]-->'" />
</template>
