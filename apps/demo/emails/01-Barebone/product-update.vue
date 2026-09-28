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
import BulletCell from './bullet-cell.vue';
import NumberedStep from './numbered-step.vue';
import { barebonesBoxedTailwindConfig } from './theme';
import BarebonesFonts from './theme-fonts.vue';

interface ProductUpdateEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<ProductUpdateEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Barebones',
    url: 'https://example.com/',
  } satisfies ProductUpdateEmailProps,
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
        <Preview>Product update: what&apos;s new at {{ companyName }}</Preview>
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
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 pb-5 mobile:pb-4 rounded-[10px]"
              >
                <Section class="mx-auto mb-10 max-w-[422px] text-center">
                  <Text class="mt-0 mb-6 font-13 font-sans text-fg-3">
                    Product update
                  </Text>
                  <Heading as="h1" class="mt-0 mb-6 font-40 font-sans text-fg">
                    Here&apos;s what&apos;s new with {{ companyName }}
                  </Heading>
                  <Text class="mt-0 mb-6 font-16 font-sans text-fg-2">
                    We shipped a new release with improvements to help you move
                    faster and stay in sync. Open the dashboard to explore the
                    full changelog.
                  </Text>
                  <Section class="text-center">
                    <Button
                      :href="url"
                      class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      View in dashboard
                    </Button>
                  </Section>
                </Section>
                <Img
                  :src="`${baseUrl}/static/barebones/barebones-image.png`"
                  alt=""
                  :width="592"
                  class="block mx-auto rounded-[12px] w-full max-w-[592px]"
                />
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]"
              >
                <Section class="px-6">
                  <Heading as="h2" class="mt-0 mb-10 font-32 font-sans text-fg">
                    Starting is easy
                  </Heading>
                  <Section class="mb-10">
                    <NumberedStep
                      n="1"
                      title="Review the highlights"
                      body="Skim what's new and jump straight to the features that matter for your team."
                    />
                    <NumberedStep
                      n="2"
                      title="Try it when you're ready"
                      body="Turn on new options on your timeline—no forced migration or downtime for your workflow."
                    />
                    <NumberedStep
                      n="3"
                      title="Share with your team"
                      body="Invite teammates so everyone sees the same improvements and clear next steps."
                      last
                    />
                  </Section>
                  <Section class="text-center">
                    <Button
                      :href="url"
                      class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Explore updates
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
                <Row class="mb-9">
                  <Column
                    class="mobile:!block pr-2.5 mobile:pr-0 mobile:pb-10 w-1/2 mobile:!w-full mobile:!max-w-full align-top"
                  >
                    <Img
                      :src="`${baseUrl}/static/barebones/barebones-image-2.png`"
                      alt=""
                      :width="288"
                      class="block mx-auto mb-6 rounded-xl w-full max-w-[288px] mobile:!max-w-full"
                    />
                    <Text
                      class="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-left"
                    >
                      Quality-of-life fixes
                    </Text>
                    <Text
                      class="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                    >
                      Expect faster load times, clearer status, and fewer clicks
                      for everyday tasks. We also tightened the spots where
                      teams tend to get stuck.
                    </Text>
                  </Column>
                  <Column
                    class="mobile:!block pl-2.5 mobile:pl-0 w-1/2 mobile:!w-full mobile:!max-w-full align-top"
                  >
                    <Img
                      :src="`${baseUrl}/static/barebones/barebones-image-2.png`"
                      alt=""
                      :width="288"
                      class="block mx-auto mb-6 rounded-xl w-full max-w-[288px] mobile:!max-w-full"
                    />
                    <Text
                      class="mt-0 mb-1 pl-1 font-16 font-sans text-fg text-base text-left"
                    >
                      Under the hood
                    </Text>
                    <Text
                      class="m-0 pr-8 mobile:pr-0 pl-1 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                    >
                      Expect faster load times, clearer status, and fewer clicks
                      for everyday tasks. We also tightened the spots where
                      teams tend to get stuck.
                    </Text>
                  </Column>
                </Row>
                <Section class="text-center">
                  <Button
                    :href="url"
                    class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                  >
                    Explore updates
                  </Button>
                </Section>
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]"
              >
                <Section class="px-6">
                  <Heading as="h2" class="mt-0 mb-10 font-32 font-sans text-fg">
                    Some new things
                  </Heading>
                  <Row class="mb-9">
                    <Column
                      class="mobile:!block pr-5 mobile:pr-0 mobile:pb-8 w-[48%] mobile:!w-full mobile:!max-w-full text-left"
                    >
                      <Img
                        :src="`${baseUrl}/static/barebones/barebones-image-2.png`"
                        alt=""
                        :width="311"
                        class="block mx-auto rounded-xl w-full max-w-[311px] mobile:!max-w-full"
                      />
                    </Column>
                    <Column
                      class="mobile:!block mobile:pl-0 w-[52%] mobile:!w-full mobile:!max-w-full text-left"
                    >
                      <Text
                        class="mt-0 mb-1 mobile:!max-w-full font-16 font-sans text-fg text-left"
                      >
                        Workflow improvements
                      </Text>
                      <Text
                        class="mt-0 mb-3 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                      >
                        Built for teams who need reliability at scale: clearer
                        behavior, better defaults, and less back-and-forth to
                        get work done.
                      </Text>
                      <Link :href="url" class="font-16 font-sans text-fg">
                        Learn about Pro
                      </Link>
                    </Column>
                  </Row>
                  <Row class="mb-9">
                    <Column
                      class="mobile:!block pr-5 mobile:pr-0 mobile:pb-8 w-[52%] mobile:!w-full mobile:!max-w-full text-left"
                    >
                      <Text
                        class="mt-0 mb-1 mobile:!max-w-full font-16 font-sans text-fg text-base text-left"
                      >
                        Reporting & visibility
                      </Text>
                      <Text
                        class="mt-0 mb-3 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                      >
                        Built for teams who need reliability at scale: clearer
                        behavior, better defaults, and less back-and-forth to
                        get work done.
                      </Text>

                      <Link :href="url" class="font-16 font-sans text-fg">
                        Learn about Pro
                      </Link>
                    </Column>
                    <Column
                      class="mobile:!block mobile:pl-0 w-[48%] mobile:!w-full mobile:!max-w-full align-middle"
                    >
                      <Img
                        :src="`${baseUrl}/static/barebones/barebones-image-2.png`"
                        alt=""
                        :width="311"
                        class="block mx-auto rounded-xl w-full max-w-[311px] mobile:!max-w-full"
                      />
                    </Column>
                  </Row>
                  <Row>
                    <Column
                      class="mobile:!block pr-5 mobile:pr-0 mobile:pb-8 w-[48%] mobile:!w-full mobile:!max-w-full align-middle"
                    >
                      <Img
                        :src="`${baseUrl}/static/barebones/barebones-image-2.png`"
                        alt=""
                        :width="311"
                        class="block mx-auto rounded-xl w-full max-w-[311px] mobile:!max-w-full"
                      />
                    </Column>
                    <Column
                      class="mobile:!block mobile:pl-0 w-[52%] mobile:!w-full mobile:!max-w-full text-left"
                    >
                      <Text
                        class="mt-0 mb-1 mobile:!max-w-full font-16 font-sans text-fg text-left"
                      >
                        API & integrations
                      </Text>
                      <Text
                        class="mt-0 mb-3 mobile:!max-w-full font-16 font-sans text-fg-2 text-left"
                      >
                        Built for teams who need reliability at scale: clearer
                        behavior, better defaults, and less back-and-forth to
                        get work done.
                      </Text>
                      <Link :href="url" class="font-16 font-sans text-fg">
                        Learn about Pro
                      </Link>
                    </Column>
                  </Row>
                </Section>
              </Section>

              <Section
                class="bg-bg-2 mb-6 mobile:mb-2 px-5 mobile:px-4 py-14 mobile:py-10 rounded-[10px]"
              >
                <Section class="px-6">
                  <Heading as="h2" class="mt-0 mb-10 font-32 font-sans text-fg">
                    Some new things
                  </Heading>
                  <Section class="mb-10">
                    <Row class="mb-9 text-left">
                      <BulletCell />
                      <BulletCell />
                    </Row>
                    <Row class="mb-3 text-left">
                      <BulletCell />
                      <BulletCell is-last />
                    </Row>
                  </Section>
                  <Section class="text-center">
                    <Button
                      :href="url"
                      class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                    >
                      Explore updates
                    </Button>
                  </Section>
                </Section>
              </Section>

              <Section
                class="bg-bg-2 mb-12 px-6 mobile:px-4 py-14 mobile:py-10 rounded-[10px]"
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
                  Get the app.
                  <br />
                  The fastest, easiest way to use {{ companyName }}.
                </Text>
                <Section class="text-center">
                  <Row>
                    <Column class="pr-2 w-1/2 text-right align-middle">
                      <Button
                        :href="url"
                        class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                      >
                        App Store
                      </Button>
                    </Column>
                    <Column class="pl-2 w-1/2 text-left align-middle">
                      <Button
                        :href="url"
                        class="inline-block bg-fg px-7 py-4 rounded-lg font-16 font-sans text-fg-inverted text-center leading-6"
                      >
                        Google Play
                      </Button>
                    </Column>
                  </Row>
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
