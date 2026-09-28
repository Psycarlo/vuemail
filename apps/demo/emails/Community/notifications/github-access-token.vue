<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'vuemail';
import tailwindConfig from '../../tailwind.config';

interface GithubAccessTokenEmailProps {
  username?: string;
}

const { username } = defineProps<GithubAccessTokenEmailProps>();

defineOptions({
  PreviewProps: {
    username: 'alanturing',
  } satisfies GithubAccessTokenEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-white text-[#24292e] font-github">
        <Preview>A fine-grained personal access token has been added to your account</Preview>
        <Container class="max-w-[480px] mx-auto my-0 pt-5 pb-12 px-0">
          <Img
            :src="`${baseUrl}/static/github.png`"
            width="32"
            height="32"
            alt="Github"
          />

          <Text class="text-[24px] leading-[1.25]">
            <strong>@{{ username }}</strong>, a personal access was created on
            your account.
          </Text>

          <Section
            class="p-6 border border-solid border-[#dedede] rounded-[5px] text-center"
          >
            <Text class="mb-[10px] mt-0 text-left">
              Hey <strong>{{ username }}</strong>!
            </Text>
            <Text class="mb-[10px] mt-0 text-left">
              A fine-grained personal access token (<Link>resend</Link>) was
              recently added to your account.
            </Text>

            <Button
              class="text-sm bg-[#28a745] text-white leading-normal rounded-lg py-3 px-6"
            >
              View your token
            </Button>
          </Section>
          <Text class="text-center">
            <Link class="text-[#0366d6] text-[12px]">Your security audit log</Link>
            ・
            <Link class="text-[#0366d6] text-[12px]">Contact support</Link>
          </Text>

          <Text
            class="text-[#6a737d] text-xs leading-[24px] text-center mt-[60px] mb-4"
          >
            GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
