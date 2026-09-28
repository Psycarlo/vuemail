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
} from '@vuemaildev/vuemail';
import CollageFonts from './collage-fonts.vue';
import { collageTailwindConfig } from './theme';

interface PasswordResetEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<PasswordResetEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Collage',
    url: 'https://example.com/',
  } satisfies PasswordResetEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Tailwind :config="collageTailwindConfig">
    <Html>
      <Head>
        <CollageFonts />
      </Head>

      <Body class="bg-canvas font-14 font-inter text-fg m-0 p-0">
        <Preview>Reset your password</Preview>
        <Container class="mx-auto max-w-[640px] px-4 pt-16 pb-6">
          <Section class="rounded-[8px] shadow-collage-card">
            <Section class="bg-bg border-stroke rounded-[8px] border">
              <Section class="mobile:px-6! px-10 pt-16">
                <Img
                  :src="`${baseUrl}/static/collage/collage-image-2.png`"
                  alt=""
                  :width="148"
                  :height="111"
                  class="block border-none"
                />
              </Section>

              <Section class="mobile:px-6! px-10 pt-8">
                <Section class="mb-9">
                  <Text class="font-48 text-fg m-0 font-sans">
                    Reset your password
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    Someone requested a password reset for your
                    {{ companyName }}
                    account. Use the button below to choose a new password.
                  </Text>
                </Section>

                <Button
                  :href="url"
                  class="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                >
                  Change password
                </Button>
              </Section>

              <Section class="mobile:px-6! px-10 pt-16 pb-8">
                <Text class="font-11 font-inter text-fg-3 m-0 max-w-[310px]">
                  If you didn&apos;t request this, please ignore this email.
                  Your password won&apos;t change until you access the link
                  above and create a new one.
                </Text>
              </Section>

              <Section class="border-stroke border-t px-10 py-16">
                <Text class="font-13 font-inter text-fg-3 m-0 max-w-[320px]">
                  Collage is the workspace where your team keeps projects,
                  context, and updates together—from first idea to launch.
                </Text>

                <Row align="left">
                  <Column class="w-full align-top">
                    <Section align="left" class="mt-8 w-[152px]">
                      <Row align="left">
                        <Column class="w-[20px] pr-8">
                          <Link
                            href="https://example.com/"
                            class="inline-block"
                          >
                            <Img
                              :src="`${baseUrl}/static/shared/social-x-black.png`"
                              alt="X"
                              :width="20"
                              :height="20"
                              class="block border-none"
                            />
                          </Link>
                        </Column>
                        <Column class="w-[20px] pr-8">
                          <Link
                            href="https://example.com/"
                            class="inline-block"
                          >
                            <Img
                              :src="`${baseUrl}/static/shared/social-in-black.png`"
                              alt="LinkedIn"
                              :width="20"
                              :height="20"
                              class="block border-none"
                            />
                          </Link>
                        </Column>
                        <Column class="w-[20px] pr-8">
                          <Link
                            href="https://example.com/"
                            class="inline-block"
                          >
                            <Img
                              :src="`${baseUrl}/static/shared/social-yt-black.png`"
                              alt="YouTube"
                              :width="20"
                              :height="20"
                              class="block border-none"
                            />
                          </Link>
                        </Column>
                        <Column class="w-[20px]">
                          <Link
                            href="https://example.com/"
                            class="inline-block"
                          >
                            <Img
                              :src="`${baseUrl}/static/shared/social-gh-black.png`"
                              alt="GitHub"
                              :width="20"
                              :height="20"
                              class="block border-none"
                            />
                          </Link>
                        </Column>
                      </Row>
                    </Section>
                  </Column>
                </Row>

                <Row align="left">
                  <Column class="w-full pt-8 align-top">
                    <Text class="font-11 font-inter text-fg-2 m-0">
                      123 Market Street, Floor 1
                      <br />
                      Tech City, CA, 94102
                    </Text>
                  </Column>
                </Row>

                <Row align="left">
                  <Column class="w-full pt-5 align-top">
                    <Text
                      class="font-11 font-inter text-fg-2 m-0 max-w-[169px]"
                    >
                      <Link href="https://example.com/" class="text-fg-2">
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
