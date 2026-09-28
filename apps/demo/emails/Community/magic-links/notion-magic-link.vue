<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Tailwind,
  Text,
} from 'vuemail';
import tailwindConfig from '../../tailwind.config';

interface NotionMagicLinkEmailProps {
  loginCode?: string;
}

const { loginCode } = defineProps<NotionMagicLinkEmailProps>();

defineOptions({
  PreviewProps: {
    loginCode: 'sparo-ndigo-amurt-secan',
  } satisfies NotionMagicLinkEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-white font-notion">
        <Preview>Log in with this magic link</Preview>
        <Container class="px-3 mx-auto">
          <Heading class="text-[#333] text-[24px] my-10 mx-0 p-0">
            Login
          </Heading>
          <Link
            href="https://notion.so"
            target="_blank"
            class="text-[#2754C5] text-[14px] underline mb-4 block"
          >Click here to log in with this magic link</Link>
          <Text class="text-[#333] text-[14px] my-6 mb-3.5">
            Or, copy and paste this temporary login code:
          </Text>
          <code
            class="inline-block py-4 px-[4.5%] w-9/10 bg-[#f4f4f4] rounded-md border border-solid border-[#eee] text-[#333]"
          >{{ loginCode }}</code>
          <Text class="text-[#ababab] text-[14px] mt-3.5 mb-4">
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text class="text-[#ababab] text-[14px] mt-3.5 mb-9.5">
            Hint: You can set a permanent password in Settings & members → My
            account.
          </Text>
          <Img
            :src="`${baseUrl}/static/notion-logo.png`"
            width="32"
            height="32"
            alt="Notion's Logo"
          />
          <Text class="text-[#898989] text-[12px] leading-[22px] mt-3 mb-6">
            <Link
              href="https://notion.so"
              target="_blank"
              class="text-[#898989] text-[14px] underline"
            >Notion.so</Link>, the all-in-one-workspace
            <br />
            for your notes, tasks, wikis, and databases.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
