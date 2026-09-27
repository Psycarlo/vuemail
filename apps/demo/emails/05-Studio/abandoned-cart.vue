<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/vuemail/vuemail/tree/main/apps/demo/emails

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
import TechFonts from './tech-fonts.vue';
import { techTailwindConfig } from './theme';

interface TechAbandonedCartEmailProps {
  companyName: string;
  url: string;
}

type BenefitItem = {
  title: string;
};

const { companyName, url } = defineProps<TechAbandonedCartEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Halo',
    url: 'https://example.com/',
  } satisfies TechAbandonedCartEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const techAbandonedCartBenefits: BenefitItem[] = [
  { title: 'Try your ring risk-free 30 days' },
  { title: 'Free shipping and easy returns' },
  { title: 'Two-year ring warranty included' },
];
</script>

<template>
  <Tailwind :config="techTailwindConfig">
    <Html>
      <Head>
        <TechFonts />
      </Head>

      <Body class="bg-bg-2 m-0 p-0">
        <Preview>Your Halo ring cart is waiting</Preview>
        <Container class="mx-auto w-full max-w-[640px]">
          <Section class="bg-bg-3 px-0 pt-14 text-center">
            <Section class="mb-10">
              <Img
                :src="`${baseUrl}/static/tech/logo-wordmark.png`"
                :alt="`${companyName} logo`"
                :width="64"
                class="block mx-auto"
              />
            </Section>

            <Section class="mx-auto px-12 pb-20 text-center">
              <Section class="mx-auto max-w-[480px]">
                <Text class="m-0 font-40 font-geist text-fg text-center">
                  Pick up where <br /> you left off
                </Text>
                <Text class="m-0 mx-auto mt-5 font-14 font-sans text-fg-2">
                  Your cart still holds your Halo ring—we saved your size and
                  finish. Check out soon before inventory shifts or your hold
                  window expires.
                </Text>

                <Button
                  :href="url"
                  class="inline-block bg-white mt-8 px-5 py-3 border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
                >
                  Return to cart
                </Button>
              </Section>

              <Section
                class="bg-bg-4 mt-16 mb-6 px-2 py-2 rounded-[16px] text-left"
              >
                <Row>
                  <Column class="w-[80px] align-middle">
                    <Section class="rounded-[12px] w-[80px]">
                      <Img
                        :src="`${baseUrl}/static/tech/tech-image.png`"
                        alt="Halo Ring 1"
                        :width="80"
                        class="block rounded-[12px] w-full max-w-[80px]"
                      />
                    </Section>
                  </Column>
                  <Column class="pl-4 align-middle">
                    <Text class="m-0 font-15 font-sans text-fg">
                      Halo Ring 1
                    </Text>
                    <Text class="m-0 mt-1 font-14 font-sans text-fg-3">
                      x1
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section class="px-8 mobile:px-4 pt-8 pb-20">
              <Section>
                <Text class="m-0 font-24 font-geist text-fg">
                  Don&apos;t take it from us
                </Text>
              </Section>

              <Section
                class="bg-bg-4 mt-10 px-12 mobile:px-6 py-20 rounded-[10px] text-center"
              >
                <Text class="m-0 font-20 font-sans text-fg-2">★★★★★</Text>
                <Text class="m-0 mt-5 font-22 font-sans text-fg">
                  &ldquo;It&apos;s wild how fast Halo on my finger felt like
                  calm help whenever my head was full and my hands were
                  busy.&rdquo;
                </Text>
              </Section>

              <Section class="mt-12 px-6 w-full">
                <Row>
                  <Column
                    v-for="(item, idx) in techAbandonedCartBenefits"
                    :key="idx"
                    class="mobile:!block px-1 w-1/4 mobile:!w-full mobile:!max-w-full text-center align-top"
                  >
                    <Text
                      class="m-0 mx-auto max-w-[120px] font-15 text-fg text-center"
                    >
                      {{ item.title }}
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section class="mt-10">
                <Button
                  :href="url"
                  class="inline-block bg-white px-5 py-3 border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
                >
                  Return to cart
                </Button>
              </Section>
            </Section>
          </Section>

          <!--Footer-->
          <Section class="px-10 pt-20 pb-20 text-center">
            <Section class="mx-auto max-w-[320px]">
              <Text class="m-0 font-13 font-sans text-fg-2">
                {{ companyName }} is the AI ring on your finger—easy shopping,
                clear shipping, and real support when you need it.
              </Text>

              <Section class="mx-auto mt-8 mb-8 w-fit">
                <Row>
                  <Column class="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
                      <Img
                        :src="`${baseUrl}/static/shared/social-x-black.png`"
                        alt="X"
                        width="20"
                        height="20"
                        class="block"
                      />
                    </Link>
                  </Column>
                  <Column class="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
                      <Img
                        :src="`${baseUrl}/static/shared/social-in-black.png`"
                        alt="LinkedIn"
                        :width="20"
                        :height="20"
                        class="block"
                      />
                    </Link>
                  </Column>
                  <Column class="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
                      <Img
                        :src="`${baseUrl}/static/shared/social-yt-black.png`"
                        alt="YouTube"
                        :width="20"
                        :height="20"
                        class="block"
                      />
                    </Link>
                  </Column>
                  <Column class="w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
                      <Img
                        :src="`${baseUrl}/static/shared/social-gh-black.png`"
                        alt="GitHub"
                        :width="20"
                        :height="20"
                        class="block"
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>

              <Text class="m-0 font-11 font-sans text-fg-2">
                123 Market Street, Floor 1
                <br />
                Tech City, CA, 94102
              </Text>
              <Text class="m-0 mt-5 font-11 font-sans text-fg-2">
                <Link href="https://example.com/" class="text-fg-2">Unsubscribe</Link>
                from {{ companyName }} marketing emails.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
