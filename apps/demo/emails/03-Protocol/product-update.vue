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

type ProductUpdateFeature = {
  title: string;
  body: string;
  linkText: string;
  linkHref: string;
  imageSrc: string;
};

const productUpdateHeadline = 'THE WORK BEHIND THE WORK';

interface ProductUpdateEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<ProductUpdateEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Dither',
    url: 'https://example.com/',
  } satisfies ProductUpdateEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const featureRows: ProductUpdateFeature[] = [
  {
    title: 'Auto-prioritization',
    body: 'All your tasks for the week are surfaced based on urgency and impact.',
    linkText: 'Explore Smart Tasks',
    linkHref: url,
    imageSrc: `${baseUrl}/static/dither/dither-image-7.png`,
  },
  {
    title: 'Less manual work',
    body: 'Fewer status updates, more automated work.',
    linkText: 'Read more',
    linkHref: url,
    imageSrc: `${baseUrl}/static/dither/dither-image-4.png`,
  },
  {
    title: 'Less manual work',
    body: 'Fewer status updates, more automated work.',
    linkText: 'Read more',
    linkHref: url,
    imageSrc: `${baseUrl}/static/dither/dither-image-5.png`,
  },
];
</script>

<template>
  <Tailwind :config="ditherTailwindConfig">
    <Html>
      <Head>
        <DitherFonts />
      </Head>
      <Body class="bg-bg-2 font-14 m-0 p-0 font-sans">
        <Preview>What&apos;s new in {{ companyName }}</Preview>
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

          <Section class="mobile:mt-8 mobile:px-4 mt-12 px-6 pb-2">
            <Img
              :src="`${baseUrl}/static/dither/dither-image-6.png`"
              alt=""
              :width="592"
              class="mobile:!max-w-full block w-full max-w-[592px]"
            />
            <Row align="left">
              <Column align="left" class="w-full">
                <Section
                  align="left"
                  class="mobile:!max-w-full mt-12 mb-6 w-full max-w-[480px] text-left"
                >
                  <Text
                    class="font-56 font-condensed mobile:font-40 text-fg m-0 uppercase"
                  >
                    {{ productUpdateHeadline }}
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          <Section class="mobile:px-4 px-6 pb-16">
            <Text class="font-14 text-fg-2 m-0 mb-4">
              Here from the {{ companyName }} team.
            </Text>
            <Text class="font-14 text-fg-2 m-0 mb-4">
              This month was about making {{ companyName }} feel smoother, faster,
              and easier to use in everyday work.
            </Text>
            <Text class="font-14 text-fg-2 m-0 mb-4">
              We shipped new features, improved key workflows, and made small
              but meaningful updates that reduce friction across the product.
            </Text>
            <Text class="font-14 text-fg-2 m-0 mb-4">
              A lot of our focus was on simplifying actions, improving
              performance, and responding to feedback from teams using the
              product day to day.
            </Text>
            <Text class="font-14 text-fg-2 m-0">
              We&apos;re continuing to shape {{ companyName }} around real
              workflows—not just features—so everything feels more connected
              and effortless over time.
            </Text>
          </Section>

          <Section class="mobile:px-4 px-6 pb-16">
            <Text
              class="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase"
            >
              WE LAUNCHED SMART TASKS
            </Text>
            <Section class="mt-12">
              <Img
                :src="featureRows[0].imageSrc"
                alt=""
                :width="560"
                class="mobile:!max-w-full block w-full max-w-[560px]"
              />
              <Text class="font-20 font-condensed text-fg m-0 mt-8">
                {{ featureRows[0].title }}
              </Text>
              <Text class="font-14 text-fg-2 m-0 mt-3.5">
                {{ featureRows[0].body }}
              </Text>
              <Link
                :href="featureRows[0].linkHref"
                class="font-15 text-fg-2 mt-3 inline-block"
              >
                {{ featureRows[0].linkText }}
              </Link>
            </Section>
          </Section>

          <Section class="mobile:px-4 px-6 pb-12">
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
          </Section>

          <Section class="mobile:px-4 px-6 pb-16">
            <Text
              class="font-32 font-condensed mobile:font-24 text-fg m-0 uppercase"
            >
              READ MORE ON OUR BLOG
            </Text>
            <Section class="mt-12">
              <Row>
                <Column
                  class="mobile:!block mobile:pr-0 mobile:pb-10 mobile:!w-full mobile:!max-w-full w-[50%] pr-2.5 align-top"
                >
                  <Img
                    :src="featureRows[1].imageSrc"
                    alt=""
                    :width="269"
                    class="mobile:!max-w-full block w-full max-w-[269px]"
                  />
                  <Section class="pt-6">
                    <Text class="font-20 font-condensed text-fg m-0">
                      {{ featureRows[1].title }}
                    </Text>
                    <Text class="font-14 text-fg-2 m-0 mt-2">
                      {{ featureRows[1].body }}
                    </Text>
                    <Link
                      :href="featureRows[1].linkHref"
                      class="font-15 text-fg-2 mt-3 inline-block"
                    >
                      {{ featureRows[1].linkText }}
                    </Link>
                  </Section>
                </Column>
                <Column
                  class="mobile:!block mobile:pl-0 mobile:!w-full mobile:!max-w-full w-[50%] pl-2.5 align-top"
                >
                  <Img
                    :src="featureRows[2].imageSrc"
                    alt=""
                    :width="269"
                    class="mobile:!max-w-full block w-full max-w-[269px]"
                  />
                  <Section class="pt-6">
                    <Text class="font-20 font-condensed text-fg m-0">
                      {{ featureRows[2].title }}
                    </Text>
                    <Text class="font-14 text-fg-2 m-0 mt-2">
                      {{ featureRows[2].body }}
                    </Text>
                    <Link
                      :href="featureRows[2].linkHref"
                      class="font-15 text-fg-2 mt-3 inline-block"
                    >
                      {{ featureRows[2].linkText }}
                    </Link>
                  </Section>
                </Column>
              </Row>
            </Section>
          </Section>

          <Section class="mobile:px-4 px-6 pb-16">
            <Text class="font-13 text-fg m-0 font-sans">Need help?</Text>
            <Text class="font-13 text-fg-2 m-0 mt-0.5 font-sans">
              Find guides, tips, and best practices anytime, visit our Help
              Center.
            </Text>
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
                      <Link :href="url" class="inline-block">
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
                      <Link :href="url" class="inline-block">
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
                      <Link :href="url" class="inline-block">
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
                      <Link :href="url" class="inline-block">
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
                  <Link :href="url" class="text-fg-2">Unsubscribe</Link>
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
