<script setup lang="ts">
import { Motion, useMotionTemplate, useMotionValue } from 'motion-v';

const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);
const background = useMotionTemplate`radial-gradient(130px circle at ${mouseX}px ${mouseY}px, var(--color), transparent 80%)`;

const handleMouseMove = (event: MouseEvent) => {
  const { left, top } = (
    event.currentTarget as HTMLElement
  ).getBoundingClientRect();

  mouseX.set(event.clientX - left);
  mouseY.set(event.clientY - top);
};

const items = [
  {
    href: '/docs/integrations/resend',
    name: 'Resend',
    logo: 'resend',
  },
  {
    href: '/docs/integrations/sendgrid',
    name: 'SendGrid',
    logo: 'sendgrid',
  },
  {
    href: '/docs/integrations/mailgun',
    name: 'Mailgun',
    logo: 'mailgun',
  },
  {
    href: '/docs/integrations/aws-ses',
    name: 'Amazon Web Services',
    logo: 'ses',
  },
  {
    href: '/docs/integrations/postmark',
    name: 'Postmark',
    logo: 'postmark',
  },
] as const;
</script>

<template>
  <section class="relative pt-12 pb-28 md:pb-80 px-6">
    <div class="space-y-12 md:space-y-16">
      <div class="max-w-full text-center space-y-6">
        <UiHeading
          as="h2"
          size="8"
          weight="medium"
          class="text-white/80 text-balance"
        >
          Integrate with any service
        </UiHeading>
        <div class="sm:px-20 md:max-w-3xl md:mx-auto text-balance">
          <UiText size="5" class="opacity-70">
            Convert your Vue code into HTML or Plain&nbsp;Text and send it with
            any email service provider.
          </UiText>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <SmartLink
          v-for="(item, index) in items"
          :key="index"
          class="group relative min-w-full max-w-full sm:min-w-[250px] sm:max-w-[250px] md:min-w-[280px] md:max-w-[280px] rounded-3xl bg-slate-4 p-px outline-hidden focus-visible:ring-slate-7 focus-visible:ring-1"
          :href="item.href"
          @mousemove="handleMouseMove"
        >
          <Motion
            class="-inset-px pointer-events-none absolute rounded-3xl opacity-0 transition duration-300 group-hover:opacity-20 [--color:rgb(187,255,215,0.6)]"
            :style="{ background }"
          />
          <div
            class="relative z-5 h-28 sm:h-32 flex items-center justify-center py-4 rounded-3xl bg-black overflow-hidden"
          >
            <div class="relative mx-auto block w-fit max-sm:scale-90">
              <HomeIntegrationLogo :name="item.logo" />
            </div>
            <div
              aria-hidden="true"
              class="absolute top-0 right-4 h-px w-32 bg-linear-to-l from-transparent via-green-12/30 via-50% to-transparent"
            />
            <div
              aria-hidden="true"
              class="pointer-events-none absolute z-1 -top-1 left-1/2 h-[200px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[500px]"
              :style="{
                background:
                  'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #0a0a0a 50%),radial-gradient(rgba(37, 99, 235, 0.1) 0%, transparent 80%)',
              }"
            />
          </div>
          <span class="sr-only">{{ item.name }}</span>
        </SmartLink>
      </div>
    </div>
    <HomeBackgroundImage
      class="pointer-events-none absolute inset-0 -top-40 z-3 select-none mix-blend-lighten opacity-60"
      priority
    />
  </section>
</template>
