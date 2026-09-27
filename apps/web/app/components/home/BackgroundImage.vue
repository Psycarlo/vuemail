<script setup lang="ts">
// The glow behind the sections of the home page. Upstream renders it with a
// `fill` next/image, whose inline style (which wins over classes like
// `-top-40`) is kept here.
defineProps<{ priority?: boolean }>();
</script>

<template>
  <img
    alt=""
    decoding="async"
    :loading="priority ? undefined : 'lazy'"
    src="/static/bg.png"
    style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent"
  />
</template>
