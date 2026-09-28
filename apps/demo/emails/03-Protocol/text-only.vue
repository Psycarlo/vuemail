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

interface TextOnlyEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<TextOnlyEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Dither',
    url: 'https://example.com/',
  } satisfies TextOnlyEmailProps,
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
        <Preview>A short note from the {{ companyName }} team</Preview>
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
            align="left"
            class="mobile:px-4 mobile:pt-12 mobile:pb-10 px-6 pt-20 pb-14"
          >
            <Text
              class="mobile:!max-w-full font-40 font-condensed mobile:font-32 text-fg m-0 mb-6 max-w-[490px] uppercase"
            >
              A note from us
            </Text>
            <Section align="left" class="mobile:!max-w-full max-w-[490px]">
              <Text class="font-14 text-fg-2 m-0 font-sans">
                We don&apos;t send long emails often. When we do, we keep them
                plain—no hero, no clutter—just a direct word from the team
                behind {{ companyName }}.
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                We&apos;re building {{ companyName }} so your team can see what
                matters, drop what doesn&apos;t, and ship without living in
                fifteen tabs. If you&apos;ve been in the product lately, thank
                you—your feedback sharpens what we ship next.
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                Here&apos;s to clearer priorities and less noise. When
                you&apos;re ready to jump back in, we&apos;ll be there.
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                — The {{ companyName }} team
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-[18px] font-sans">
                <Link :href="url" class="text-fg">
                  Open {{ companyName }}
                </Link>
              </Text>
            </Section>
          </Section>

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
