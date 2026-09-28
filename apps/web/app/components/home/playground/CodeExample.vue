<script setup lang="ts">
// The email the playground of the home page previews, rendered on the server
// by `server/api/playground.get.ts`. Its code, as shown in the playground, is
// in `app/utils/home/playground.ts`.
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';

interface WelcomeEmailProps {
  username?: string;
  company?: string;
}

const { username = 'Nicole', company = 'Helix' } =
  defineProps<WelcomeEmailProps>();

const previewText = `Welcome to ${company}, ${username}!`;

// Relative without it, which the preview's iframe resolves against the page
const siteUrl = process.env.URL;
const baseUrl = siteUrl
  ? siteUrl.startsWith('http')
    ? siteUrl
    : `https://${siteUrl}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Preview>{{ previewText }}</Preview>
    <Tailwind>
      <Body class="m-auto bg-black font-sans antialiased">
        <Container class="mb-10 mx-auto p-5 max-w-[465px]">
          <Section class="mt-10">
            <Img
              :src="`${baseUrl}/brand/example-logo.png`"
              width="60"
              height="60"
              alt="Logo Example"
              class="my-0 mx-auto"
            />
          </Section>
          <Heading
            class="text-2xl text-white font-normal text-center p-0 my-8 mx-0"
          >
            Welcome to <strong>{{ company }}</strong>, {{ username }}!
          </Heading>
          <Text class="text-start text-sm text-white">
            Hello {{ username }},
          </Text>
          <Text class="text-start text-sm text-white leading-relaxed">
            We're excited to have you onboard at <strong>{{ company }}</strong>.
            We hope you enjoy your journey with us. If you have any questions or
            need assistance, feel free to reach out.
          </Text>
          <Section class="text-center mt-[32px] mb-[32px]">
            <Button
              class="py-2.5 px-5 bg-white rounded-md text-black text-sm font-semibold no-underline text-center pointer-events-none select-none"
            >
              Get Started
            </Button>
          </Section>
          <Text class="text-start text-sm text-white">
            Cheers,
            <br />
            The {{ company }} Team
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
