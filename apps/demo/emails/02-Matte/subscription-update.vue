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

interface SubscriptionUpdateProps {
  companyName: string;
  url: string;
  userName: string;
  planName: string;
  planPrice: string;
  cycleLabel: string;
  nextBillingDate: string;
}

const {
  companyName,
  url,
  userName,
  planName,
  planPrice,
  cycleLabel,
  nextBillingDate,
} = defineProps<SubscriptionUpdateProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Collage',
    url: 'https://example.com/',
    userName: 'Alex',
    planName: 'Pro',
    planPrice: '$29',
    cycleLabel: 'month',
    nextBillingDate: 'April 22, 2026',
  } satisfies SubscriptionUpdateProps,
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
        <Preview>Your {{ companyName }} plan renewed ({{ planName }})</Preview>
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

              <Section class="mobile:px-6! px-10 pb-14 pt-8">
                <Section
                  align="left"
                  class="mb-12 ml-0 mr-auto w-full max-w-[480px] text-left"
                >
                  <Text class="font-48 text-fg m-0 font-sans">
                    Plan renewed
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    Hi {{ userName }}. Your {{ companyName }} subscription
                    renewed for another {{ cycleLabel }}. Here&apos;s a quick
                    summary of your plan and billing.
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    You&apos;re on the {{ planName }} plan at
                    {{ planPrice }} per {{ cycleLabel }}. Your next charge is on
                    {{ nextBillingDate }}. Review invoices, update payment
                    details, or change plans anytime in your account.
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    Something look off? Reply to this email and we&apos;ll help
                    sort it out.
                  </Text>
                </Section>

                <Button
                  :href="url"
                  class="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                >
                  Manage subscription
                </Button>
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
