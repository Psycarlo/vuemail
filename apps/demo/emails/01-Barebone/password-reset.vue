<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';
import { barebonesBoxedTailwindConfig } from './theme';
import BarebonesFonts from './theme-fonts.vue';

interface PasswordResetEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<PasswordResetEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Barebones',
    url: 'https://example.com/',
  } satisfies PasswordResetEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Tailwind :config="barebonesBoxedTailwindConfig">
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>

      <Body class="bg-bg-2 m-0 text-center font-sans">
        <Preview>Reset your password</Preview>
        <Container class="mobile:mt-0 mx-auto mt-8 w-full max-w-[640px]">
          <Section>
            <Section class="bg-bg mobile:px-2 px-6 py-4">
              <Section class="mb-3 px-6">
                <Row>
                  <Column class="w-1/2 py-[7px] align-middle">
                    <Row>
                      <Column class="w-[32px] align-middle">
                        <Img
                          :src="`${baseUrl}/static/shared/logo-black.png`"
                          alt=""
                          :width="23"
                          class="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" class="w-1/2 py-[7px] align-middle">
                    <Text class="font-13 m-0 text-right font-sans">
                      <span class="text-fg-3">{{ companyName }}</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section
                class="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-[40px] py-[64px] text-center"
              >
                <Section class="mb-3">
                  <Img
                    :src="`${baseUrl}/static/shared/logo-black.png`"
                    alt="Logo"
                    :width="48"
                    class="mx-auto mb-5 block"
                  />
                  <Heading as="h1" class="font-28 text-fg m-0 font-sans">
                    Reset your password
                  </Heading>
                </Section>

                <Text
                  class="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-[380px] text-center font-sans"
                >
                  Someone has requested a link to change your password, and you
                  can do this through the link below.
                </Text>

                <Section class="mb-6 text-center">
                  <Button
                    :href="url"
                    class="bg-fg font-16 text-fg-inverted inline-block rounded-lg px-7 py-4 text-center font-sans leading-6"
                  >
                    Change password
                  </Button>
                </Section>

                <Text
                  class="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-[400px] text-center font-sans"
                >
                  If you didn&apos;t request this, please ignore this email.
                  Your password won&apos;t change until you access the link
                  above and create a new one.
                </Text>
              </Section>

              <!-- Footer -->
              <Section class="bg-bg">
                <Row>
                  <Column class="px-6 py-10 text-center">
                    <Text
                      class="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-[280px] text-center font-sans"
                    >
                      Barebones is the catchy slogan that perfectly encapsulates
                      the vision of our company.
                    </Text>

                    <Section class="mb-8">
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-x-black.png`"
                          alt="X"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-in-black.png`"
                          alt="LinkedIn"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-yt-black.png`"
                          alt="YouTube"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-gh-black.png`"
                          alt="GitHub"
                          :width="18"
                          class="block"
                        />
                      </Link>
                    </Section>

                    <Text
                      class="font-11 text-fg-3 mt-4 mb-5 text-center font-sans"
                    >
                      123 Market Street, Floor 1
                      <br />
                      Tech City, CA, 94102
                    </Text>
                    <Text class="font-11 text-fg-3 m-0 text-center font-sans">
                      <Link href="https://example.com/" class="text-fg-3">
                        Unsubscribe
                      </Link>
                      from {{ companyName }} marketing emails.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
