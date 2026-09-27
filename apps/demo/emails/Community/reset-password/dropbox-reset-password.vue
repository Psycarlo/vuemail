<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/vuemail/vuemail/tree/main/apps/demo/emails

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

interface DropboxResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

const { userFirstname, resetPasswordLink } =
  defineProps<DropboxResetPasswordEmailProps>();

defineOptions({
  PreviewProps: {
    userFirstname: 'Alan',
    resetPasswordLink: 'https://www.dropbox.com',
  } satisfies DropboxResetPasswordEmailProps,
  tailwindConfig,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-[#f6f9fc] py-2.5">
        <Preview>Dropbox reset your password</Preview>
        <Container class="bg-white border border-solid border-[#f0f0f0] p-[45px]">
          <Img
            :src="`${baseUrl}/static/dropbox-logo.png`"
            width="40"
            height="33"
            alt="Dropbox"
          />
          <Section>
            <Text
              class="text-base font-dropbox font-light text-[#404040] leading-[26px]"
            >
              Hi {{ userFirstname }},
            </Text>
            <Text
              class="text-base font-dropbox font-light text-[#404040] leading-[26px]"
            >
              Someone recently requested a password change for your Dropbox
              account. If this was you, you can set a new password here:
            </Text>
            <Button
              class="bg-[#007ee6] rounded text-white text-[15px] no-underline text-center font-dropbox-sans block w-[210px] py-[14px] px-[7px]"
              :href="resetPasswordLink"
            >
              Reset password
            </Button>
            <Text
              class="text-base font-dropbox font-light text-[#404040] leading-[26px]"
            >
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text
              class="text-base font-dropbox font-light text-[#404040] leading-[26px]"
            >
              To keep your account secure, please don&apos;t forward this
              email to anyone. See our Help Center for
              <Link class="underline" :href="resetPasswordLink">more security tips.</Link>
            </Text>
            <Text
              class="text-base font-dropbox font-light text-[#404040] leading-[26px]"
            >
              Happy Dropboxing!
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
