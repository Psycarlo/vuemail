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
import { barebonesBoxedTailwindConfig } from './theme';
import BarebonesFonts from './theme-fonts.vue';
import WelcomeBulletCell from './welcome-bullet-cell.vue';

interface WelcomeEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<WelcomeEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Barebones',
    url: 'https://example.com/',
  } satisfies WelcomeEmailProps,
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
        <Preview>Welcome aboard—{{ companyName }}</Preview>
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
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 pt-5 mobile:pt-4 pb-14 mobile:pb-10 rounded-[10px]"
              >
                <Section class="mb-10">
                  <Img
                    :src="`${baseUrl}/static/barebones/barebones-image.png`"
                    alt=""
                    :width="600"
                    class="block mx-auto rounded-[12px] w-full max-w-[600px]"
                  />
                </Section>
                <Section class="mx-auto max-w-[422px] text-center">
                  <Text class="mt-0 mb-6 font-13 font-sans text-fg-3">
                    Thanks for joining us
                  </Text>
                  <Heading as="h1" class="mt-0 mb-6 font-40 font-sans text-fg">
                    Welcome to {{ companyName }}
                  </Heading>
                  <Text class="m-0 font-16 font-sans text-fg-2">
                    You&apos;re all set. Open your dashboard to explore the
                    basics, connect a few tools, and invite your team when
                    you&apos;re ready.
                  </Text>
                </Section>
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 pt-5 mobile:pt-4 pb-14 mobile:pb-10 rounded-[10px]"
              >
                <Section class="mb-10">
                  <Img
                    :src="`${baseUrl}/static/barebones/barebones-image.png`"
                    alt=""
                    :width="600"
                    class="block mx-auto rounded-[12px] w-full max-w-[600px]"
                  />
                </Section>
                <Section class="px-6">
                  <Heading as="h2" class="mt-0 mb-10 font-32 font-sans text-fg">
                    Getting started
                  </Heading>
                  <Section class="mb-10">
                    <Row class="mb-9 text-left">
                      <WelcomeBulletCell />
                      <WelcomeBulletCell />
                    </Row>
                    <Row class="mb-3 text-left">
                      <WelcomeBulletCell />
                      <WelcomeBulletCell is-last />
                    </Row>
                  </Section>
                  <Section class="text-center">
                    <Button
                      :href="url"
                      class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Open dashboard
                    </Button>
                  </Section>
                </Section>
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]"
              >
                <Text
                  class="mt-0 mb-16 mobile:mb-10 font-32 font-sans text-fg text-center"
                >
                  Some new things
                </Text>
                <Row>
                  <Column
                    class="mobile:!block pr-2.5 mobile:pr-0 mobile:pb-10 w-1/2 mobile:!w-full mobile:!max-w-full align-top"
                  >
                    <Img
                      :src="`${baseUrl}/static/barebones/barebones-image.png`"
                      alt=""
                      :width="280"
                      class="block mx-auto mb-6 rounded-xl w-full max-w-[280px] mobile:!max-w-full"
                    />
                    <Text
                      class="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-left"
                    >
                      Team workspaces
                    </Text>
                    <Text
                      class="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                    >
                      Roles, guests, and access levels so the right people see
                      the right work—without extra admin overhead.
                    </Text>
                  </Column>
                  <Column
                    class="mobile:!block pl-2.5 mobile:pl-0 w-1/2 mobile:!w-full mobile:!max-w-full align-top"
                  >
                    <Img
                      :src="`${baseUrl}/static/barebones/barebones-image.png`"
                      alt=""
                      :width="280"
                      class="block mx-auto mb-6 rounded-xl w-full max-w-[280px] mobile:!max-w-full"
                    />
                    <Text
                      class="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-left"
                    >
                      Connect your stack
                    </Text>
                    <Text
                      class="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                    >
                      Plug in the apps your team already uses and keep updates
                      flowing without jumping between tabs.
                    </Text>
                  </Column>
                </Row>
                <Section class="mt-9 text-center">
                  <Button
                    :href="url"
                    class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                  >
                    Explore features
                  </Button>
                </Section>
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
                <Text class="mt-0 mb-8 font-28 font-sans text-fg-2 text-center">
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
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-x-black.png`"
                          alt="X"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-in-black.png`"
                          alt="LinkedIn"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
                        <Img
                          :src="`${baseUrl}/static/shared/social-yt-black.png`"
                          alt="YouTube"
                          :width="18"
                          class="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        class="inline-block px-2 align-middle"
                      >
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
                      <Link href="https://example.com/" class="text-fg-3">
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
