<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';
import FeatureBlock from './feature-block.vue';
import { barebonesBoxedTailwindConfig } from './theme';
import BarebonesFonts from './theme-fonts.vue';

interface FeatureAnnouncementEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<FeatureAnnouncementEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Barebones',
    url: 'https://example.com/',
  } satisfies FeatureAnnouncementEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Tailwind :config="barebonesBoxedTailwindConfig">
    <Html>
      <Head>
        <BarebonesFonts />
      </Head>

      <Body class="bg-bg-2 m-0 font-sans text-center">
        <Preview>Release notes — {{ companyName }}</Preview>
        <Container class="mx-auto mt-8 mobile:mt-0 w-full max-w-[640px]">
          <Section>
            <Section class="bg-bg px-6 mobile:px-2 py-4">
              <Section class="mb-3 px-6">
                <Row>
                  <Column class="py-[7px] w-1/2 align-middle">
                    <Row>
                      <Column class="w-[32px] align-middle">
                        <Img
                          :src="`${baseUrl}/static/shared/logo-black.png`"
                          alt=""
                          :width="23"
                          class="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" class="py-[7px] w-1/2 align-middle">
                    <Text class="m-0 font-13 font-sans text-right">
                      <span class="text-fg-3">{{ companyName }}</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-6 mobile:px-4 py-20 mobile:py-12 pb-16 mobile:pb-10 rounded-[10px]"
              >
                <Section class="mx-auto mb-16 max-w-[422px] text-center">
                  <Text class="mt-0 mb-4 font-13 font-sans text-fg-3">
                    What's new from {{ companyName }}
                  </Text>
                  <Heading as="h1" class="mt-0 mb-4 font-40 font-sans text-fg">
                    Release Notes
                  </Heading>
                  <Text class="m-0 font-16 font-sans text-fg-2">
                    Learn what&apos;s shipping this month, plus other
                    {{ companyName }} updates below.
                  </Text>
                </Section>

                <Section class="mb-20">
                  <FeatureBlock
                    :image-url="`${baseUrl}/static/barebones/barebones-image.png`"
                    :cta-url="url"
                    title="Hello feature. Goodbye old feature."
                    body-p1="Ship updates in smaller, safer steps: clearer defaults, fewer clicks, and less context switching for your team."
                  />
                </Section>
                <FeatureBlock
                  :image-url="`${baseUrl}/static/barebones/barebones-image.png`"
                  :cta-url="url"
                  title="Hello feature. Goodbye old feature."
                  body-p1="Ship updates in smaller, safer steps: clearer defaults, fewer clicks, and less context switching for your team."
                />
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-8 mobile:px-4 py-14 mobile:py-10 rounded-[10px] text-left"
              >
                <Heading
                  as="h2"
                  class="mt-0 mb-10 font-32 font-sans text-fg text-left"
                >
                  New ways to work
                </Heading>
                <Row align="left" class="mb-9">
                  <Column class="pr-8 mobile:pr-5 w-14 align-top">
                    <Img
                      :src="`${baseUrl}/static/barebones/barebones-image-3.png`"
                      alt=""
                      :width="48"
                      class="block"
                    />
                  </Column>
                  <Column class="w-full text-left align-top">
                    <Text class="mt-0 mb-1.5 font-16 font-sans text-fg">
                      Automations that save real time
                    </Text>
                    <Text
                      class="mt-0 mb-4 max-w-[400px] font-16 font-sans text-fg-2"
                    >
                      Bring your workflows into one place, cut manual handoffs,
                      and give everyone the same source of truth.
                    </Text>
                    <Link :href="url" class="font-16 font-sans text-fg">
                      Read more
                    </Link>
                  </Column>
                </Row>
                <Row align="left">
                  <Column class="pr-8 mobile:pr-5 w-14 align-top">
                    <Img
                      :src="`${baseUrl}/static/barebones/barebones-image-3.png`"
                      alt=""
                      :width="48"
                      class="block"
                    />
                  </Column>
                  <Column class="w-full max-w-[440px] text-left align-top">
                    <Text class="mt-0 mb-1.5 font-16 font-sans text-fg">
                      A clearer view of what needs attention
                    </Text>
                    <Text
                      class="mt-0 mb-4 max-w-[400px] font-16 font-sans text-fg-2"
                    >
                      Bring your workflows into one place, cut manual handoffs,
                      and give everyone the same source of truth.
                    </Text>
                    <Link :href="url" class="font-16 font-sans text-fg">
                      Read more
                    </Link>
                  </Column>
                </Row>
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-6 mobile:px-4 pt-8 mobile:pt-6 pb-16 mobile:pb-10 rounded-[10px]"
              >
                <FeatureBlock
                  :image-url="`${baseUrl}/static/barebones/barebones-image.png`"
                  :cta-url="url"
                  title="Hello feature. Goodbye old feature."
                  body-p1="Ship updates in smaller, safer steps: clearer defaults, fewer clicks, and less context switching for your team."
                />
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-6 mobile:px-4 py-14 mobile:py-10 rounded-[10px]"
              >
                <Section class="mb-8 text-center">
                  <Section
                    class="bg-black mx-auto p-3 rounded-xl w-14 text-center"
                  >
                    <Img
                      :src="`${baseUrl}/static/shared/logo-white.png`"
                      alt=""
                      :width="32"
                      class="block mx-auto"
                    />
                  </Section>
                </Section>
                <Text
                  class="mx-auto mt-0 mb-8 max-w-[420px] font-28 font-sans text-fg text-center"
                >
                  Start using {{ companyName }}
                  <br />
                  The fastest, easiest way to use {{ companyName }}.
                </Text>
                <Section class="text-center">
                  <Button
                    :href="url"
                    class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                  >
                    Go to Dashboard
                  </Button>
                </Section>
              </Section>

              <!-- Footer -->
              <Section class="bg-bg">
                <Row>
                  <Column class="px-6 py-10 text-center">
                    <Text
                      class="mx-auto mt-0 mb-8 max-w-[280px] font-13 font-sans text-fg-3 text-center"
                    >
                      {{ companyName }} is the catchy slogan that perfectly
                      encapsulates the vision of our company.
                    </Text>

                    <Section class="mb-8">
                      <Link :href="url" class="inline-block px-2 align-middle">
                        <Img
                          :src="`${baseUrl}/static/shared/social-x-black.png`"
                          alt="X"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link :href="url" class="inline-block px-2 align-middle">
                        <Img
                          :src="`${baseUrl}/static/shared/social-in-black.png`"
                          alt="LinkedIn"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link :href="url" class="inline-block px-2 align-middle">
                        <Img
                          :src="`${baseUrl}/static/shared/social-yt-black.png`"
                          alt="YouTube"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link :href="url" class="inline-block px-2 align-middle">
                        <Img
                          :src="`${baseUrl}/static/shared/social-gh-black.png`"
                          alt="GitHub"
                          :width="18"
                          class="block"
                        />
                      </Link>
                    </Section>

                    <Text
                      class="mt-4 mb-5 font-11 font-sans text-fg-3 text-center"
                    >
                      123 Market Street, Floor 1
                      <br />
                      Tech City, CA, 94102
                    </Text>
                    <Text class="m-0 font-11 font-sans text-fg-3 text-center">
                      <Link :href="url" class="text-fg-3"> Unsubscribe </Link>
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
