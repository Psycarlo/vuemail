<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/vuemail/vuemail/tree/main/apps/demo/emails

import { computed } from 'vue';
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
} from 'vuemail';
import CollageFonts from './collage-fonts.vue';
import { collageTailwindConfig } from './theme';

type FeatureRow = {
  title: string;
  description: string;
  ctaLabel: string;
  imageSrc: string;
};

type HighlightItem = {
  title: string;
  description: string;
};

interface FeatureAnnouncementEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<FeatureAnnouncementEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Collage',
    url: 'https://example.com/',
  } satisfies FeatureAnnouncementEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const brand = computed(() => companyName);

const featureLead = computed(() => ({
  title: 'One workspace for the whole picture',
  description: `Bring briefs, files, feedback, and status into ${brand.value} so your team spends less time chasing context across tools.`,
  ctaLabel: "See what's new \u2192",
}));

const featureRows: FeatureRow[] = [
  {
    title: 'Faster by default',
    description:
      'The new flow cuts steps in half so your team can publish changes without bouncing between screens.',
    ctaLabel: 'See how it works \u2192',
    imageSrc: `${baseUrl}/static/collage/collage-image-6.png`,
  },
  {
    title: 'Clearer for everyone',
    description:
      'Permissions and activity are easier to read, so admins spend less time answering who changed this.',
    ctaLabel: 'View the details \u2192',
    imageSrc: `${baseUrl}/static/collage/collage-image-7.png`,
  },
];

const highlights: HighlightItem[] = [
  {
    title: 'One place to review',
    description:
      'A single summary screen shows status, owners, and next steps for each release.',
  },
  {
    title: 'Smarter notifications',
    description:
      'You only get pinged when something needs your attention—not on every edit.',
  },
  {
    title: 'Works with your stack',
    description:
      'Connects to the tools you already use so context stays in sync across teams.',
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
        <Preview>Something new is live in {{ brand }}</Preview>
        <Container class="mx-auto max-w-[640px] px-4 pt-16 pb-6">
          <Section class="shadow-collage-card rounded-[8px]">
            <Section class="bg-bg border-stroke rounded-[8px] border">
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
                    Meet your next favorite feature
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    We&apos;re rolling out an update that makes {{ brand }}
                    faster, clearer, and easier to use every day.
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0">
                    It&apos;s available now—open {{ brand }} to try it, or read
                    on for what changed and why it matters.
                  </Text>
                </Section>

                <Section class="text-left">
                  <Button
                    :href="url"
                    class="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                  >
                    Try it now
                  </Button>
                </Section>
              </Section>

              <Section class="mobile:px-6! px-10 pt-4 pb-16 text-left">
                <Section class="mb-12 text-left">
                  <Text class="font-15 font-inter text-fg m-0">
                    {{ featureLead.title }}
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-2">
                    {{ featureLead.description }}
                  </Text>
                  <Text class="m-0 mt-2">
                    <Link :href="url" class="font-14 font-inter text-fg">
                      {{ featureLead.ctaLabel }}
                    </Link>
                  </Text>
                </Section>

                <Section
                  v-for="(row, idx) in featureRows"
                  :key="idx"
                  :class="idx > 0 ? 'mt-12' : ''"
                >
                  <Row class="align-top">
                    <Column
                      class="mobile:!block mobile:pb-6 mobile:!w-full mobile:!max-w-full w-[48%] align-top"
                    >
                      <Img
                        :src="row.imageSrc"
                        alt=""
                        :width="264"
                        class="mobile:!max-w-full block w-full max-w-[264px] border-none"
                      />
                    </Column>
                    <Column
                      class="mobile:!block mobile:pl-0 mobile:!w-full mobile:!max-w-full w-[52%] pl-4 align-top"
                    >
                      <Text class="font-15 font-inter text-fg m-0">
                        {{ row.title }}
                      </Text>
                      <Text class="font-14 font-inter text-fg-2 m-0 mt-2">
                        {{ row.description }}
                      </Text>
                      <Text class="m-0 mt-2">
                        <Link :href="url" class="font-14 font-inter text-fg">
                          {{ row.ctaLabel }}
                        </Link>
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Section>

              <Section class="bg-bg-2 mobile:px-0! px-4 mobile:py-16! py-20">
                <Section class="px-6">
                  <Text class="font-48 text-fg m-0 max-w-[400px] font-sans">
                    Built from real feedback
                  </Text>
                  <Text
                    class="font-14 font-inter text-fg-2 m-0 mt-[18px] max-w-[479px]"
                  >
                    Teams told us where {{ brand }} felt slow or opaque. This
                    release tightens those loops so you spend less time
                    coordinating and more time shipping.
                  </Text>
                </Section>
                <Section class="px-6 pt-14">
                  <Text class="font-15 font-inter text-fg m-0">
                    Highlights from this release:
                  </Text>
                  <Section class="pt-9">
                    <Section
                      v-for="(item, idx) in highlights"
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
