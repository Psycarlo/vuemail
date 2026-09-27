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

type FeatureCard = {
  title: string;
  description: string;
  cta: string;
  imageSrc: string;
};

type UpdateItem = {
  title: string;
  description: string;
};

interface ProductUpdateEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<ProductUpdateEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Collage',
    url: 'https://example.com/',
  } satisfies ProductUpdateEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const brand = computed(() => companyName);

const cards: FeatureCard[] = [
  {
    title: 'Smarter Search',
    description:
      'Search results are now grouped by intent and ranked by relevance, so teams find the right content faster.',
    cta: 'Read the update \u2192',
    imageSrc: `${baseUrl}/static/collage/collage-image-6.png`,
  },
  {
    title: 'Shared Workspaces',
    description:
      'You can now organize projects into shared workspaces with clearer ownership and cleaner handoffs.',
    cta: 'See what changed \u2192',
    imageSrc: `${baseUrl}/static/collage/collage-image-7.png`,
  },
];

const items: UpdateItem[] = [
  {
    title: 'New Help Center',
    description:
      'A faster docs experience with guided setup, troubleshooting paths, and deeper API references.',
  },
  {
    title: 'Permissions',
    description:
      'Granular role controls let admins manage access by workspace, project, and action.',
  },
  {
    title: 'New Discovery Tools',
    description:
      'Saved views and smart filters make it easier to surface new ideas and high-signal activity.',
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
        <Preview>Your monthly {{ brand }} product updates</Preview>
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
                    Monthly roundup
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                    Here&apos;s what shipped this month across {{ brand }}.
                  </Text>
                  <Text class="font-14 font-inter text-fg-2 m-0">
                    We focused on speed, collaboration, and control to help your
                    team move from idea to launch faster.
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

              <Section class="mobile:px-6! px-10 pt-4 pb-16">
                <Row>
                  <Column
                    v-for="(card, idx) in cards.slice(0, 2)"
                    :key="idx"
                    :class="`w-1/2 align-top mobile:!block mobile:!w-full mobile:!max-w-full ${
                      idx === 0
                        ? 'pr-4 mobile:pr-0 mobile:pb-10'
                        : 'mobile:pl-0'
                    }`"
                  >
                    <Section :class="idx === 0 ? 'pl-0' : 'pl-4 mobile:pl-0'">
                      <Img
                        :src="card.imageSrc"
                        alt=""
                        :width="264"
                        class="mobile:!max-w-full block w-full max-w-[264px] border-none"
                      />
                      <Section class="pt-5">
                        <Text class="font-15 font-inter text-fg m-0">
                          {{ card.title }}
                        </Text>
                        <Text class="font-14 font-inter text-fg-2 m-0 mt-2">
                          {{ card.description }}
                        </Text>
                        <Link
                          :href="url"
                          class="font-14 font-inter text-fg-2 m-0 mt-2 inline-block"
                        >
                          {{ card.cta }}
                        </Link>
                      </Section>
                    </Section>
                  </Column>
                </Row>
              </Section>

              <Section class="bg-bg-2 mobile:px-0! px-4 mobile:py-16! py-20">
                <Section class="px-6">
                  <Text class="font-48 text-fg m-0 max-w-[400px] font-sans">
                    Something to be proud of
                  </Text>
                  <Text
                    class="font-14 font-inter text-fg-2 m-0 mt-[18px] max-w-[479px]"
                  >
                    From quality-of-life fixes to major workflow improvements,
                    this release is built around feedback from teams using
                    {{ brand }} every day.
                  </Text>
                </Section>
                <Section class="px-6 pt-14">
                  <Text class="font-15 font-inter text-fg m-0">
                    Here&apos;s the newest from the month:
                  </Text>
                  <Section class="pt-9">
                    <Section
                      v-for="(item, idx) in items"
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

              <Section
                class="mobile:px-6! mobile:pt-10 px-10 pt-20 text-center"
              >
                <Text class="font-48 text-fg m-0 font-sans">
                  Jump back into {{ brand }}
                </Text>
                <Text class="font-14 font-inter text-fg-2 m-0 mt-[18px]">
                  You&apos;re all set—open {{ brand }} to explore what&apos;s
                  new and keep projects moving.
                </Text>
                <Section class="pt-9 text-center">
                  <Button
                    :href="url"
                    class="bg-brand font-15 font-inter text-fg-inverted inline-block border-none px-5 py-3.5 text-center"
                  >
                    Open {{ brand }}
                  </Button>
                </Section>
                <Section class="pt-16">
                  <Img
                    :src="`${baseUrl}/static/collage/collage-image-8.png`"
                    alt=""
                    :width="608"
                    class="mx-auto block w-full max-w-[608px] border-none"
                  />
                </Section>
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
                          <Link :href="url" class="inline-block">
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
                          <Link :href="url" class="inline-block">
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
                          <Link :href="url" class="inline-block">
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
                          <Link :href="url" class="inline-block">
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
                      <Link :href="url" class="text-fg-2"> Unsubscribe </Link>
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
