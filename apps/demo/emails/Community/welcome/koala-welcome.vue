<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';
import tailwindConfig from '../../tailwind.config';

interface KoalaWelcomeEmailProps {
  userFirstname: string;
}

const { userFirstname } = defineProps<KoalaWelcomeEmailProps>();

defineOptions({
  PreviewProps: {
    userFirstname: 'Alan',
  } satisfies KoalaWelcomeEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-white font-koala">
        <Preview>The sales intelligence platform that helps you uncover qualified leads.</Preview>
        <Container class="mx-auto py-5 pb-12">
          <Img
            :src="`${baseUrl}/static/koala-logo.png`"
            width="170"
            height="50"
            alt="Koala"
            class="mx-auto"
          />
          <Text class="text-[16px] leading-[26px]">
            Hi {{ userFirstname }},
          </Text>
          <Text class="text-[16px] leading-[26px]">
            Welcome to Koala, the sales intelligence platform that helps you
            uncover qualified leads and close deals faster.
          </Text>
          <Section class="text-center">
            <Button
              class="bg-[#5F51E8] rounded-[3px] text-white text-[16px] no-underline text-center block p-3"
              href="https://getkoala.com"
            >
              Get started
            </Button>
          </Section>
          <Text class="text-[16px] leading-[26px]">
            Best,
            <br />
            The Koala team
          </Text>
          <Hr class="border-[#cccccc] my-5" />
          <Text class="text-[#8898aa] text-[12px]">
            470 Noor Ave STE B #1148, South San Francisco, CA 94080
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
