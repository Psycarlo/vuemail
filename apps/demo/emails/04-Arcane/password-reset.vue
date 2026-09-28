<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
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
import SkinFonts from './skin-fonts.vue';
import { skinTailwindConfig } from './theme';

interface PasswordResetEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<PasswordResetEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Skin',
    url: 'https://example.com/',
  } satisfies PasswordResetEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Tailwind :config="skinTailwindConfig">
    <Html>
      <Head>
        <SkinFonts />
      </Head>

      <Body class="m-0 bg-white p-0 font-15 font-sans">
        <Preview>Reset your password</Preview>
        <Section class="m-0 bg-white p-0">
          <Container class="bg-bg mx-auto w-full max-w-[640px]">
            <Section class="bg-bg mobile:px-6 px-[40px] pt-[40px] pb-[24px]">
              <Img
                :src="`${baseUrl}/static/shared/logo-white.png`"
                alt=""
                width="32"
                height="32"
                class="block"
              />
            </Section>

            <Section class="mobile:px-6 px-[40px] pt-[80px] pb-[56px]">
              <Section class="mb-[48px]">
                <Text class="font-72 text-fg mb-8 max-w-[480px] font-serif">
                  Reset your Password
                </Text>
                <Text
                  class="font-15 text-fg-2 m-0 mt-[18px] max-w-[480px] font-sans"
                >
                  We received a request to reset your password for {{ companyName }}.
                </Text>
                <Text
                  class="font-15 text-fg-2 m-0 mt-[18px] max-w-[480px] font-sans"
                >
                  Use the link below to choose a new password. If you
                  didn&apos;t request this, you can ignore this email.
                </Text>
              </Section>
              <Section class="text-left">
                <Link :href="url" class="font-16 text-fg font-sans">
                  {{ 'Reset password \u2192' }}
                </Link>
              </Section>
            </Section>

            <!-- Footer -->
            <Section
              class="mobile:px-6 border-stroke mt-12 border-t px-[40px] pt-[80px] pb-[64px]"
            >
              <Text class="font-13 text-fg-3 m-0 max-w-[320px] font-sans">
                {{ companyName }} crafts thoughtful skincare—barrier-first formulas,
                honest labels, and routines you&apos;ll actually keep.
              </Text>
              <Row align="left">
                <Column class="w-full align-top">
                  <Section align="left" class="mt-8 w-[152px]">
                    <Row align="left">
                      <Column class="w-[20px] pr-6">
                        <Link href="https://example.com/" class="inline-block">
                          <Img
                            :src="`${baseUrl}/static/skin/social-x.png`"
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
                            :src="`${baseUrl}/static/skin/social-li.png`"
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
                            :src="`${baseUrl}/static/skin/social-yt.png`"
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
                            :src="`${baseUrl}/static/skin/social-gh.png`"
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
                  <Text class="font-11 text-fg-3 m-0 font-sans">
                    124 Mercantile Row, Studio 3
                    <br />
                    Los Angeles, CA, 90013
                  </Text>
                </Column>
              </Row>
              <Row align="left">
                <Column class="w-full pt-5 align-top">
                  <Text class="font-11 text-fg-3 m-0 max-w-[169px] font-sans">
                    <Link href="https://example.com/" class="text-fg-2">Unsubscribe</Link>
                    from {{ companyName }} marketing emails.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  </Tailwind>
</template>
