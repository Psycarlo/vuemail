<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

/** Figma Email-Templates `2738:4169` — Tech shipping notification (track CTA, line items, FAQ strip). */

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

type ShippingFaqItem = {
  title: string;
  body: string;
};

interface TechOrderShippingEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<TechOrderShippingEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Halo',
    url: 'https://example.com/',
  } satisfies TechOrderShippingEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const techOrderShippingFaqItems: ShippingFaqItem[] = [
  {
    title: 'When will my ring arrive?',
    body: 'Most domestic Halo orders land in 3–5 business days after the carrier scan—watch your tracking link for live updates.',
  },
  {
    title: 'Need a different size?',
    body: 'Start an exchange from your order page within 30 days. We’ll help you resize or swap finishes while stock allows.',
  },
  {
    title: 'Is my shipment protected?',
    body: 'Every ring ships insured with signature options in select regions—check tracking for delivery preferences.',
  },
  {
    title: 'Can I change the address?',
    body: 'Contact support fast if the package hasn’t left our hub; once it’s moving, carriers require you to redirect with them.',
  },
];
</script>

<template>
  <Tailwind :config="techTailwindConfig">
    <Html>
      <Head>
        <TechFonts />
      </Head>

      <Body class="bg-bg-2 m-0 p-0">
        <Preview>Your {{ companyName }} ring order #1234567890 has shipped</Preview>
        <Container class="mx-auto w-full max-w-[640px]">
          <Section class="bg-bg-3 px-0 pt-14 text-center">
            <Section class="px-6 pb-[56px]">
              <Section class="mb-8">
                <Img
                  :src="`${baseUrl}/static/tech/logo-wordmark.png`"
                  alt="Logo"
                  :width="64"
                  class="block mx-auto"
                />
              </Section>

              <Section class="mx-auto">
                <Section class="max-w-[420px]">
                  <Text class="m-0 font-40 font-geist text-fg">
                    Your order has shipped
                  </Text>
                  <Text class="m-0 mt-6 font-14 font-sans text-fg-2">
                    Order #1234567890 with your Halo ring is on the way. Tap
                    track below—we&apos;ll ping you if delivery details shift.
                  </Text>

                  <Section class="mt-12">
                    <Button
                      :href="url"
                      class="inline-block bg-white px-[20px] py-[12px] border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
                    >
                      {{ 'Track your order →' }}
                    </Button>
                  </Section>
                </Section>

                <Section class="pt-16 text-left">
                  <Section
                    class="bg-bg-4 mt-0 mb-6 px-2 py-2 rounded-[16px] text-left"
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

                  <Section class="mt-12 border-stroke border-t">&nbsp;</Section>
                  <Section class="mt-6 text-center">
                    <Text
                      class="m-0 mx-auto max-w-[300px] font-14 font-sans text-fg-3"
                    >
                      After dispatch we can’t edit items, but you can follow or
                      reroute delivery through the carrier’s tools anytime.
                    </Text>
                  </Section>
                </Section>

                <Section
                  class="mt-12 px-6 mobile:px-2 pt-12 border-stroke border-t text-left"
                >
                  <Text class="m-0 font-16 font-geist text-fg-3">
                    Common questions
                  </Text>
                  <Section class="mt-10">
                    <Section
                      v-for="(item, idx) in techOrderShippingFaqItems"
                      :key="idx"
                      :class="idx > 0 ? 'mt-10' : ''"
                    >
                      <Text class="m-0 font-22 font-sans text-fg">
                        {{ item.title }}
                      </Text>
                      <Text class="m-0 mt-3 font-14 font-sans text-fg-2">
                        {{ item.body }}
                      </Text>
                    </Section>
                    <Section class="mt-10">
                      <Button
                        :href="url"
                        class="inline-block bg-white px-[20px] py-[12px] border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
                      >
                        More
                      </Button>
                    </Section>
                  </Section>
                </Section>
              </Section>
            </Section>
          </Section>

          <Section class="px-6 py-20 text-center">
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
                        :width="20"
                        :height="20"
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
