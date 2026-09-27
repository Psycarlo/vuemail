<!-- Wraps internal pages, which end with the footer -->
<template>
  <div
    class="relative mx-auto flex min-h-[calc(100dvh-7rem)] flex-col justify-between px-2 md:max-w-7xl md:px-4"
  >
    <slot />
    <AppFooter />
  </div>
</template>
