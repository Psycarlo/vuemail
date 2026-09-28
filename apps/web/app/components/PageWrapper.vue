<!-- Wraps internal pages, which end with the footer. The mobile menu scales
it down when it opens (`should-scale-background`). -->
<template>
  <div
    class="relative mx-auto flex min-h-dvh flex-col justify-between px-2 md:max-w-7xl md:px-4"
    vaul-drawer-wrapper=""
  >
    <slot />
    <AppFooter />
  </div>
</template>
