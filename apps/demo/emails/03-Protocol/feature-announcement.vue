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
import DitherFonts from './dither-fonts.vue';
import { ditherTailwindConfig } from './theme';

interface FeatureAnnouncementEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<FeatureAnnouncementEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Dither',
    url: 'https://example.com/',
  } satisfies FeatureAnnouncementEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const featureName = 'Smart Tasks';
const heroImageSrc = `${baseUrl}/static/dither/dither-image-2.png`;
</script>

<template>
  <Tailwind :config="ditherTailwindConfig">
    <Html>
      <Head>
        <DitherFonts />
      </Head>

      <Body class="bg-bg-2 font-14 m-0 p-0 font-sans">
        <Preview>Meet {{ featureName }}</Preview>
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
          <Section class="mobile:px-4 px-6">
            <Img
              :src="heroImageSrc"
              alt=""
              :width="592"
              class="mobile:!max-w-full block w-full max-w-[592px]"
            />
          </Section>

          <Section
            class="mobile:px-4 mobile:pt-10 mobile:pb-8 px-6 pt-14 pb-12"
          >
            <Text
              class="mobile:!max-w-full font-56 font-condensed mobile:font-40 text-fg m-0 max-w-[490px] uppercase"
            >
              Meet a new way to manage work
            </Text>
            <Text
              class="mobile:!max-w-full font-14 text-fg-2 m-0 mt-10 max-w-[490px] font-sans"
            >
              Introducing {{ featureName }}: a calmer way to organize work,
              surface what matters next, and keep your team aligned without
              the noise.
            </Text>
            <Section class="mt-10">
              <Button
                :href="url"
                class="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
              >
                Explore {{ featureName }}
              </Button>
            </Section>
          </Section>

          <Section
            class="mobile:px-4 mobile:pt-8 mobile:pb-12 px-6 pt-10 pb-16"
          >
            <Text
              class="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase"
            >
              Meet smart tasks
            </Text>
            <Section class="pt-12">
              <Img
                :src="heroImageSrc"
                alt=""
                :width="592"
                class="mobile:!max-w-full block w-full max-w-[592px]"
              />
              <Text class="font-20 font-condensed text-fg m-0 mt-8">
                Auto-prioritization
              </Text>
              <Text class="font-14 text-fg-2 m-0 my-3 font-sans">
                All your tasks for the week are surfaced based on urgency and
                impact.
              </Text>
              <Link :href="url" class="font-15 text-fg font-sans">
                Explore {{ featureName }}
              </Link>
            </Section>

            <Section
              v-for="(title, idx) in [
                'Less manual work',
                'Clear focus',
                'Better alignment',
              ]"
              :key="title"
              :class="idx === 0 ? 'mobile:pt-10 pt-16' : 'mobile:pt-8 pt-12'"
            >
              <Row class="align-top">
                <Column
                  class="mobile:!block mobile:pb-6 mobile:!w-full mobile:!max-w-full w-[48%] align-top"
                >
                  <Img
                    :src="heroImageSrc"
                    alt=""
                    :width="269"
                    class="mobile:!max-w-full block w-full max-w-[269px]"
                  />
                </Column>
                <Column
                  class="mobile:!block mobile:pl-0 mobile:!w-full mobile:!max-w-full w-[52%] pl-6 align-middle"
                >
                  <Text class="font-20 font-condensed text-fg m-0">
                    {{ title }}
                  </Text>
                  <Text class="font-14 text-fg-2 m-0 mt-3 font-sans">
                    {{
                      idx === 0
                        ? 'Fewer status updates, more automated work.'
                        : idx === 1
                          ? 'Always know what to do next—less thrash, more momentum.'
                          : 'Your team stays in sync automatically.'
                    }}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Text class="mobile:!max-w-full font-20 m-0 mt-12 max-w-[456px]">
              <span class="text-fg">
                Smart Tasks analyzes your projects in real time and helps
                organize
              </span>
              <span class="text-fg-3">
                your workload automatically. As things change, your task list
                updates so you&apos;re always focused on what matters most.
              </span>
            </Text>

            <Section align="left" class="pt-12">
              <Img
                :src="heroImageSrc"
                alt=""
                :width="592"
                class="mobile:!max-w-full mx-auto block w-full max-w-[592px]"
              />
              <Section
                align="left"
                class="bg-bg mobile:px-6 mobile:py-12 border-stroke mx-auto mt-6 max-w-[640px] border px-10 py-20 text-center"
              >
                <Text class="font-14 text-fg m-0 font-sans">
                  &quot;Smart Tasks helps me know what to do next without
                  thinking about it.&quot;
                </Text>
                <Text class="font-13 text-fg-2 m-0 mt-4 font-sans">
                  Alex, Product Designer at Studio
                </Text>
              </Section>
            </Section>

            <Section class="mobile:pt-12 pt-18">
              <Text
                class="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase"
              >
                Try smart tasks
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-5 font-sans">
                See how much easier work can be.
              </Text>
              <Section class="mt-8">
                <Button
                  :href="url"
                  class="bg-fg font-15 text-bg inline-block px-5 py-3.5 text-center font-sans"
                >
                  Explore {{ featureName }}
                </Button>
              </Section>
            </Section>

            <Section class="mobile:pt-10 pt-14">
              <Text class="font-13 text-fg m-0 font-sans">
                Need help?
              </Text>
              <Text
                class="mobile:!max-w-full font-13 text-fg-2 m-0 mt-0.5 max-w-[490px] font-sans"
              >
                Find guides, tips, and best practices anytime, visit our
                <Link href="https://example.com/" class="text-fg-2">Help Center</Link>.
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
