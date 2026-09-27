<template>
  <section
    class="relative text-center space-y-16 sm:space-y-24 max-md:mt-44 max-md:mb-24 my-56 max-md:px-4"
  >
    <div class="space-y-8">
      <div class="max-w-full text-center space-y-6">
        <UiHeading as="h2" size="8" weight="medium" class="text-white/80">
          Built-in deliverability tools
        </UiHeading>
        <div class="sm:px-20 md:max-w-2xl md:mx-auto">
          <UiText size="5" class="opacity-70">
            Before you hit “send”, check how your email is doing with a set of
            tools to help you build better emails.
          </UiText>
        </div>
      </div>
    </div>
    <HomeToolsInteractiveDemo />
    <HomeBackgroundImage
      class="pointer-events-none absolute inset-0 -top-40 z-3 select-none mix-blend-lighten"
      priority
    />
  </section>
</template>
