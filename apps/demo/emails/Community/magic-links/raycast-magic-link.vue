<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';
import tailwindConfig from '../../tailwind.config';

interface RaycastMagicLinkEmailProps {
  magicLink?: string;
}

const { magicLink } = defineProps<RaycastMagicLinkEmailProps>();

defineOptions({
  PreviewProps: {
    magicLink: 'https://raycast.com',
  } satisfies RaycastMagicLinkEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-white font-raycast">
        <Preview>Log in with this magic link.</Preview>
        <Container
          class="mx-auto my-0 pt-5 px-[25px] pb-12 bg-[url('/static/raycast-bg.png')] [background-position:bottom] [background-repeat:no-repeat]"
        >
          <Img
            :src="`${baseUrl}/static/raycast-logo.png`"
            :width="48"
            :height="48"
            alt="Raycast"
          />
          <Heading class="text-[28px] font-bold mt-12">
            🪄 Your magic link
          </Heading>
          <Section class="my-6 mx-0">
            <Text class="text-base leading-6.5">
              <Link class="text-[#FF6363]" :href="magicLink">
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text class="text-base leading-6.5">
              If you didn't request this, please ignore this email.
            </Text>
          </Section>
          <Text class="text-base leading-6.5">
            Best,
            <br />- Raycast Team
          </Text>
          <Hr class="border-[#dddddd] mt-12" />
          <Img
            :src="`${baseUrl}/static/raycast-logo.png`"
            :width="32"
            :height="32"
            :style="{
              '-webkit-filter': 'grayscale(100%)',
            }"
            class="[filter:grayscale(100%)] my-5 mx-0"
          />
          <Text class="text-[#8898aa] text-xs leading-6 ml-1">
            Raycast Technologies Inc.
          </Text>
          <Text class="text-[#8898aa] text-xs leading-6 ml-1">
            2093 Philadelphia Pike #3222, Claymont, DE 19703
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
