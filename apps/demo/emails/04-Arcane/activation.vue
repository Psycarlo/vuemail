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

interface ActivationEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<ActivationEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Skin',
    url: 'https://example.com/',
  } satisfies ActivationEmailProps,
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

      <Body class="bg-white m-0 p-0 font-15 font-sans">
        <Preview>Confirm your email address</Preview>
        <Section class="bg-white m-0 p-0">
          <Container class="bg-bg mx-auto w-full max-w-[640px]">
            <Section class="bg-bg pt-[40px] pr-[32px] pb-[24px] pl-[40px]">
              <Img
                :src="`${baseUrl}/static/shared/logo-white.png`"
                alt=""
                width="32"
                height="32"
                class="block"
              />
            </Section>
            <Section class="px-[16px]">
              <Img
                :src="`${baseUrl}/static/skin/skin-image-1.png`"
                alt=""
                :width="608"
                class="block w-full max-w-[608px]"
              />
            </Section>
            <Section class="px-[40px] mobile:px-6 py-[80px]">
              <Section class="mb-[36px]">
                <Text class="mb-8 font-72 font-serif text-fg">
                  Almost there
                </Text>
                <Text class="m-0 mt-[18px] font-15 font-sans text-fg-2">
                  Thank you for signing up for {{ companyName }}.
                </Text>
                <Text class="m-0 font-15 font-sans text-fg-2">
                  To verify your account, we just need to confirm your email.
                </Text>
              </Section>
              <Section class="text-left">
                <Link :href="url" class="font-16 font-sans text-fg">
                  {{ 'Confirm email \u2192' }}
                </Link>
              </Section>
            </Section>
            <Section class="px-[40px] mobile:px-6 py-4">
              <Text class="m-0 max-w-[310px] font-11 font-sans text-fg-3">
                If you didn&apos;t create an account with {{ companyName }}, you can
                ignore this email—your inbox won&apos;t be added to our list.
              </Text>
            </Section>

            <!-- Footer -->
            <Section
              class="mt-12 px-[40px] mobile:px-6 pt-[80px] pb-[64px] border-stroke border-t"
            >
              <Text class="m-0 max-w-[320px] font-13 font-sans text-fg-3">
                {{ companyName }} crafts thoughtful skincare—barrier-first formulas,
                honest labels, and routines you&apos;ll actually keep.
              </Text>
              <Row align="left">
                <Column class="w-full align-top">
                  <Section align="left" class="mt-8 w-[152px]">
                    <Row align="left">
                      <Column class="pr-6 w-[20px]">
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
                      <Column class="pr-6 w-[20px]">
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
                      <Column class="pr-6 w-[20px]">
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
                <Column class="pt-8 w-full align-top">
                  <Text class="m-0 font-11 font-sans text-fg-3">
                    124 Mercantile Row, Studio 3
                    <br />
                    Los Angeles, CA, 90013
                  </Text>
                </Column>
              </Row>
              <Row align="left">
                <Column class="pt-5 w-full align-top">
                  <Text class="m-0 max-w-[169px] font-11 font-sans text-fg-3">
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
