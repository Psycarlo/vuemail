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
} from 'vuemail';
import SkinFonts from './skin-fonts.vue';
import { skinTailwindConfig } from './theme';

export type OrderLine = { name: string; quantity: string; imageSrc: string };
interface OrderConfirmationEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<OrderConfirmationEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Skin',
    url: 'https://example.com/',
  } satisfies OrderConfirmationEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const orderConfirmationLines: OrderLine[] = [
  {
    name: 'Daily C Serum',
    quantity: 'x1',
    imageSrc: `${baseUrl}/static/skin/skin-image-2.png`,
  },
  {
    name: 'Overnight Repair Cream',
    quantity: 'x1',
    imageSrc: `${baseUrl}/static/skin/skin-image-3.png`,
  },
];
</script>

<template>
  <Tailwind :config="skinTailwindConfig">
    <Html>
      <Head>
        <SkinFonts />
      </Head>

      <Body class="m-0 bg-white p-0 font-15 font-sans">
        <Preview>Your {{ companyName }} order #1234567890 is confirmed</Preview>
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
                  Your order has been placed
                </Text>
                <Text
                  class="font-15 text-fg-2 m-0 mt-3 max-w-[480px] font-sans"
                >
                  Your order #1234567890 has been confirmed!
                </Text>
                <Text class="font-15 text-fg-2 m-0 max-w-[480px] font-sans">
                  We&apos;ll send tracking as soon as your parcel leaves our
                  studio, usually within one business day.
                </Text>
              </Section>
              <Link :href="url" class="font-16 text-fg font-sans">
                {{ 'Track your order \u2192' }}
              </Link>

              <Section class="mt-[64px]">
                <Section class="mb-[24px]">
                  <Section
                    v-for="(line, idx) in orderConfirmationLines"
                    :key="idx"
                  >
                    <Section
                      v-if="idx > 0"
                      class="border-stroke mt-[18px] mb-[18px] border-t"
                    >&nbsp;</Section>
                    <Row>
                      <Column class="w-[68px] align-middle">
                        <Img
                          :src="line.imageSrc"
                          alt=""
                          :width="68"
                          class="block w-full max-w-[68px]"
                        />
                      </Column>
                      <Column class="w-[24px]" />
                      <Column class="align-middle">
                        <Text
                          class="font-24 text-fg m-0 font-serif capitalize"
                        >
                          {{ line.name }}
                        </Text>
                        <Text class="font-15 text-fg-3 m-0 font-sans">
                          {{ line.quantity }}
                        </Text>
                      </Column>
                    </Row>
                  </Section>
                </Section>

                <Section class="bg-bg-2 border-bg mt-[64px] border">
                  <Row class="p-[12px]">
                    <Column>
                      <Text class="font-15 text-fg-3 m-0 font-sans">
                        Subtotal
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text class="font-15 text-fg-3 m-0 font-sans">
                        $198.00
                      </Text>
                    </Column>
                  </Row>
                  <Row class="border-bg border-t p-[12px]">
                    <Column>
                      <Text class="font-15 text-fg-3 m-0 font-sans">
                        Tax
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text class="font-15 text-fg-3 m-0 font-sans">
                        $16.00
                      </Text>
                    </Column>
                  </Row>
                  <Row class="border-bg border-t p-[12px]">
                    <Column>
                      <Text class="font-15 text-fg-3 m-0 font-sans">
                        Shipping
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text class="font-15 text-fg-3 m-0 font-sans">
                        $0.00
                      </Text>
                    </Column>
                  </Row>
                  <Row class="border-bg border-t p-[12px]">
                    <Column>
                      <Text class="font-15 text-fg m-0 font-sans">
                        Total
                      </Text>
                    </Column>
                    <Column align="right">
                      <Text class="font-15 text-fg m-0 font-sans">
                        $214.00
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>
            </Section>

            <!-- Footer -->
            <Section
              class="mobile:px-6 border-stroke mt-12 border-t px-[40px] pt-[80px] pb-[64px]"
            >
              <Text class="font-13 text-fg-3 m-0 max-w-[320px] font-sans">
                {{ companyName }} crafts thoughtful skincare—barrier-first
                formulas, honest labels, and routines you&apos;ll actually
                keep.
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
