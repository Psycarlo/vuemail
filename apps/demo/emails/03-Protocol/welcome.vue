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
import DitherFonts from './dither-fonts.vue';
import { ditherTailwindConfig } from './theme';

interface WelcomeEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<WelcomeEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Dither',
    url: 'https://example.com/',
  } satisfies WelcomeEmailProps,
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
        <Preview>Welcome to {{ companyName }}</Preview>
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
            class="mobile:px-4 mobile:pt-10 mobile:pb-8 px-6 pt-16 pb-12"
          >
            <Section align="left" class="mobile:!max-w-full max-w-[490px]">
              <Text
                class="mobile:!max-w-full font-56 font-condensed mobile:font-40 text-fg m-0 max-w-[490px] uppercase"
              >
                Welcome to {{ companyName }}
              </Text>
              <Text
                class="mobile:!max-w-full font-14 text-fg-2 m-0 mt-10 max-w-[490px] font-sans"
              >
                You can start exploring right away, set up your workspace, and
                invite your team if you&apos;re working with others.
              </Text>
            </Section>
          </Section>

          <Section class="mobile:px-4 px-6">
            <Img
              :src="`${baseUrl}/static/dither/dither-image-1.png`"
              alt=""
              :width="592"
              class="block w-full max-w-[592px]"
            />
          </Section>

          <Section
            class="mobile:px-4 mobile:pt-10 mobile:pb-8 px-6 pt-16 pb-12"
          >
            <Text
              class="mobile:!max-w-full font-11 text-muted m-0 max-w-[310px] font-sans"
            >
              If you need help getting started, we&apos;ve got you covered. Find
              guides, tips, and best practices anytime, visit our
              <Link href="https://example.com/" class="text-muted">Help Center</Link>.
            </Text>
          </Section>

          <Section class="mobile:px-4 mobile:pb-10 px-6 pb-14">
            <Text
              class="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase"
            >
              Get started
            </Text>

            <Section class="mobile:py-8 border-stroke border-b py-10">
              <Text class="font-20 font-condensed text-fg mb-4">
                Set up your workspace
              </Text>
              <Text class="font-14 text-fg-2 m-0 my-3 font-sans">
                Complete the basics to get the most out of your account.
              </Text>
              <Link :href="url" class="font-15 text-fg font-sans">
                Complete Setup
              </Link>
            </Section>

            <Section class="mobile:py-8 border-stroke border-b py-10">
              <Text class="font-20 font-condensed text-fg mb-4">
                Invite your team
              </Text>
              <Text class="font-14 text-fg-2 m-0 my-3 font-sans">
                Collaboration works best when everyone&apos;s in.
              </Text>
              <Link :href="url" class="font-15 text-fg font-sans">
                Invite Teammates
              </Link>
            </Section>

            <Section class="mobile:pt-10 pt-14">
              <Text class="font-15 text-fg m-0 font-sans">Need help?</Text>
              <Text
                class="mobile:!max-w-full font-13 text-fg-2 m-0 mt-0.5 max-w-[490px] font-sans"
              >
                Find guides, tips, and best practices anytime, visit our
                <Link :href="url" class="text-fg-2">Help Center</Link>.
              </Text>
            </Section>
          </Section>

          <!-- Footer -->
          <Section
            class="mobile:px-4 mobile:py-12 border-stroke border-t px-6 py-16"
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
