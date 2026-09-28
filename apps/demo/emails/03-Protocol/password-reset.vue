<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';
import DitherFonts from './dither-fonts.vue';
import { ditherTailwindConfig } from './theme';

interface PasswordResetEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<PasswordResetEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Dither',
    url: 'https://example.com/',
  } satisfies PasswordResetEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Tailwind :config="ditherTailwindConfig">
    <Html>
      <Head>
        <DitherFonts />
      </Head>

      <Body class="bg-bg-2 font-14 m-0 p-0 font-sans">
        <Preview>Reset your password</Preview>
        <Container class="bg-bg mx-auto max-w-[640px]">
          <Section class="mobile:px-4 px-6 py-6">
            <Img
              :src="`${baseUrl}/static/shared/logo-white.png`"
              alt=""
              width="32"
              height="32"
              class="block"
            />
          </Section>

          <Section
            class="mobile:px-4 mobile:pt-12 mobile:pb-10 px-6 pt-20 pb-14"
          >
            <Section class="mobile:mb-8 mb-12">
              <Text
                class="font-56 font-condensed mobile:font-40 text-fg m-0 uppercase"
              >
                password reset
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-8 font-sans">
                We received a request to reset your password for {{ companyName }}.
              </Text>
              <Text class="font-13 text-fg-3 m-0 mt-[18px] font-sans">
                If you didn&apos;t request a reset, you can safely ignore this
                email.
              </Text>
            </Section>

            <Button
              :href="url"
              class="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
            >
              Create New Password
            </Button>
          </Section>

          <!-- Footer -->
          <Section
            class="mobile:px-4 mobile:pt-12 mobile:pb-12 border-stroke border-t px-6 pt-20 pb-16"
          >
            <Text class="font-13 text-fg-2 m-0 max-w-[320px] font-sans">
              {{ companyName }} helps teams cut through noise—clear priorities,
              fewer tabs, and less busywork from idea to shipped work.
            </Text>
            <Row align="left">
              <Column class="w-full align-top">
                <Section align="left" class="mt-8 w-[152px]">
                  <Row align="left">
                    <Column class="w-[20px] pr-6">
                      <Link href="https://example.com/" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-x-white.png`"
                          alt="X"
                          width="20"
                          height="20"
                          class="block"
                        />
                      </Link>
                    </Column>
                    <Column class="w-[20px] pr-6">
                      <Link href="https://example.com/" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-li-white.png`"
                          alt="LinkedIn"
                          width="20"
                          height="20"
                          class="block"
                        />
                      </Link>
                    </Column>
                    <Column class="w-[20px] pr-6">
                      <Link href="https://example.com/" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-yt-white.png`"
                          alt="YouTube"
                          width="20"
                          height="20"
                          class="block"
                        />
                      </Link>
                    </Column>
                    <Column class="w-[20px]">
                      <Link href="https://example.com/" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-gh-white.png`"
                          alt="GitHub"
                          width="20"
                          height="20"
                          class="block"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Column>
            </Row>
            <Row align="left">
              <Column class="w-full pt-8 align-top">
                <Text class="font-11 text-fg-2 m-0 font-sans">
                  123 Market Street, Floor 1
                  <br />
                  Tech City, CA, 94102
                </Text>
              </Column>
            </Row>
            <Row align="left">
              <Column class="w-full pt-5 align-top">
                <Text class="font-11 text-fg-2 m-0 max-w-[160px] font-sans">
                  <Link href="https://example.com/" class="text-fg-2">Unsubscribe</Link>
                  from {{ companyName }} marketing emails.
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
