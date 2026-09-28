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
import { computed } from 'vue';
import CollageFonts from './collage-fonts.vue';
import { collageTailwindConfig } from './theme';

type WelcomeTip = {
  title: string;
  description: string;
};

interface WelcomeEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<WelcomeEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Collage',
    url: 'https://example.com/',
  } satisfies WelcomeEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const brand = computed(() => companyName);
const welcomeTitle = computed(() => `Welcome to ${brand.value}`);

const tips: WelcomeTip[] = [
  {
    title: 'Complete your profile',
    description:
      'Add a photo and a short bio so teammates recognize you in comments and mentions.',
  },
  {
    title: 'Turn on notifications',
    description:
      'Choose email or in-app alerts so you never miss a review request or deadline.',
  },
  {
    title: 'Browse templates',
    description:
      'Starter layouts and snippets help your team ship polished work without reinventing the wheel.',
  },
];
</script>

<template>
  <Tailwind :config="collageTailwindConfig">
    <Html>
      <Head>
        <CollageFonts />
      </Head>

      <Body class="bg-canvas font-14 font-inter text-fg m-0 p-0">
        <Preview>Welcome to {{ brand }}</Preview>
        <Container class="mx-auto max-w-[640px] px-4 pt-16 pb-6">
          <Section class="shadow-collage-card rounded-[8px]">
            <Section
              class="bg-bg border-stroke rounded-[8px] border overflow-hidden"
            >
              <Section class="p-0">
                <Img
                  :src="`${baseUrl}/static/collage/collage-image-5.png`"
                  alt=""
                  :width="608"
                  class="block w-full max-w-[608px] border-none"
                />
              </Section>

              <Section
                class="mobile:px-6! mobile:pt-10 px-10 pt-20 pb-14 text-left"
              >
                <Section class="mb-9 text-left">
                  <Text class="font-48 text-fg m-0 font-sans">
                    {{ welcomeTitle }}
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    Thank you for signing up for {{ brand }}.
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0">
                    You&apos;re all set—explore what&apos;s new and get your
                    first project going.
                  </Text>
                </Section>

                <Section class="text-left">
                  <Button
                    :href="url"
                    class="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                  >
                    Explore
                  </Button>
                </Section>
              </Section>

              <Section class="bg-bg-2 mobile:px-0! px-4 mobile:py-16! py-20">
                <Section class="px-6">
                  <Text class="font-48 text-fg m-0 max-w-[400px] font-sans">
                    Your first week in {{ brand }}
                  </Text>
                  <Text
                    class="font-14 font-inter text-fg-2 m-0 mt-[18px] max-w-[479px]"
                  >
                    Small steps add up. Use this short checklist to get
                    comfortable—everything here is optional, but it helps you
                    feel at home faster.
                  </Text>
                </Section>
                <Section class="px-6 pt-14">
                  <Text class="font-15 font-inter text-fg m-0">
                    Here&apos;s what to try first:
                  </Text>
                  <Section class="pt-9">
                    <Section
                      v-for="(item, idx) in tips"
                      :key="idx"
                      class="border-stroke border-b py-6"
                    >
                      <Row>
                        <Column class="w-[92%] align-top">
                          <Text
                            class="font-20 font-inter text-fg m-0 leading-normal"
                          >
                            {{ item.title }}
                          </Text>
                          <Text
                            class="font-14 font-inter text-fg-2 m-0 mt-1 max-w-[380px]"
                          >
                            {{ item.description }}
                          </Text>
                        </Column>
                        <Column class="w-[8%] text-right align-middle">
                          <Img
                            :src="`${baseUrl}/static/collage/collage-image-9.png`"
                            alt=""
                            :width="12"
                            :height="12"
                            class="inline-block border-none align-middle"
                          />
                        </Column>
                      </Row>
                    </Section>
                  </Section>
                </Section>
              </Section>

              <Section class="p-0">
                <Img
                  :src="`${baseUrl}/static/collage/collage-image-4.png`"
                  alt=""
                  :width="608"
                  class="block w-full max-w-[608px] border-none"
                />
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
