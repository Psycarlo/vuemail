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
import SkinFonts from './skin-fonts.vue';
import { skinTailwindConfig } from './theme';

type WelcomeFeature = {
  title: string;
  body: string;
  ctaLabel: string;
  imageSrc: string;
  imagePosition: 'left' | 'right';
};
interface WelcomeEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<WelcomeEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Skin',
    url: 'https://example.com/',
  } satisfies WelcomeEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const welcomeFeatures: WelcomeFeature[] = [
  {
    title: 'Build your ritual',
    body: 'Layer textures and finishes that match your routine—morning calm, evening wind-down, or both.',
    ctaLabel: 'Learn more \u2192',
    imageSrc: `${baseUrl}/static/skin/skin-image-6.png`,
    imagePosition: 'left',
  },
  {
    title: 'Restocks & drops',
    body: 'Members hear first when favorites return and limited runs go live—stay in the loop from day one.',
    ctaLabel: 'Learn more \u2192',
    imageSrc: `${baseUrl}/static/skin/skin-image-7.png`,
    imagePosition: 'right',
  },
];
</script>

<template>
  <Tailwind :config="skinTailwindConfig">
    <Html>
      <Head>
        <SkinFonts />
      </Head>

      <Body class="m-0 bg-white p-0 font-15 font-sans">
        <Preview>Welcome to {{ companyName }}</Preview>
        <Section class="m-0 bg-white p-0">
          <Container class="bg-bg mx-auto w-full max-w-[640px]">
            <Section class="bg-bg mobile:px-6 px-[40px] pt-[40px] pb-[24px]">
              <Img
                :src="`${baseUrl}/static/shared/logo-white.png`"
                alt=""
                width="32"
                height="32"
                class="block"
              />
            </Section>

            <Section class="mobile:px-6 mobile:pt-12 px-[40px] pt-[64px]">
              <Text
                class="mobile:!max-w-full font-72 mobile:font-56 text-fg m-0 font-serif capitalize"
              >
                Welcome
              </Text>
              <Text
                class="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[24px] max-w-[480px] font-sans"
              >
                Thank you for joining {{ companyName }}. Your shelf just got a
                little smarter.
              </Text>
              <Text
                class="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[4px] max-w-[480px] font-sans"
              >
                Unlock member perks, restock alerts, and checkout that
                remembers your routine.
              </Text>
            </Section>

            <Section class="bg-bg-2 mobile:mt-10 mt-[64px]">
              <Img
                :src="`${baseUrl}/static/skin/skin-image-1.png`"
                alt=""
                :width="640"
                class="mobile:!max-w-full block w-full max-w-[640px]"
              />
            </Section>

            <Section class="mobile:px-6 mobile:pt-12 px-[40px] pt-[88px]">
              <Text
                class="mobile:!max-w-full font-72 mobile:font-56 text-fg m-0 max-w-[560px] font-serif capitalize"
              >
                Some new things
              </Text>
              <Section class="mobile:mt-10 mt-[64px]">
                <Section
                  v-for="(feature, idx) in welcomeFeatures"
                  :key="idx"
                  :class="idx > 0 ? 'mobile:mt-10 mt-[64px]' : ''"
                >
                  <Row class="align-top">
                    <template v-if="feature.imagePosition === 'left'">
                      <Column
                        class="mobile:!block mobile:!w-full w-[280px] max-w-[280px] align-top mobile:!max-w-full"
                      >
                        <Img
                          :src="feature.imageSrc"
                          alt=""
                          :width="280"
                          class="mobile:!max-w-full block w-full max-w-[280px]"
                        />
                      </Column>
                      <Column class="mobile:!hidden w-[24px]" />
                      <Column
                        class="mobile:!block mobile:!w-full align-top mobile:!max-w-full mobile:pt-8"
                      >
                        <Section class="mobile:py-6 py-[40px]">
                          <Text
                            class="mobile:pr-0 mobile:!max-w-full font-15 text-fg m-0 pr-[32px] font-sans"
                          >
                            {{ feature.title }}
                          </Text>
                          <Text
                            class="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[16px] font-sans"
                          >
                            {{ feature.body }}
                          </Text>
                          <Section class="mt-[16px]">
                            <Link :href="url" class="font-15 text-fg font-sans">
                              {{ feature.ctaLabel }}
                            </Link>
                          </Section>
                        </Section>
                      </Column>
                    </template>
                    <template v-else>
                      <Column
                        class="mobile:!block mobile:!w-full align-top mobile:!max-w-full"
                      >
                        <Section class="mobile:py-6 py-[40px]">
                          <Text
                            class="mobile:pr-0 mobile:!max-w-full font-15 text-fg m-0 pr-[32px] font-sans"
                          >
                            {{ feature.title }}
                          </Text>
                          <Text
                            class="mobile:!max-w-full font-15 text-fg-2 m-0 mt-[16px] font-sans"
                          >
                            {{ feature.body }}
                          </Text>
                          <Section class="mt-[16px]">
                            <Link :href="url" class="font-15 text-fg font-sans">
                              {{ feature.ctaLabel }}
                            </Link>
                          </Section>
                        </Section>
                      </Column>
                      <Column class="mobile:!hidden w-[24px]" />
                      <Column
                        class="mobile:!block mobile:!w-full w-[280px] max-w-[280px] align-top mobile:!max-w-full mobile:pt-8"
                      >
                        <Img
                          :src="feature.imageSrc"
                          alt=""
                          :width="280"
                          class="mobile:!max-w-full block w-full max-w-[280px]"
                        />
                      </Column>
                    </template>
                  </Row>
                </Section>
              </Section>
            </Section>

            <Section
              class="mobile:px-6 mobile:pt-12 mobile:pb-10 mt-[80px] px-[40px]"
            >
              <Section class="bg-bg-3 px-[40px] py-[80px] text-center">
                <Text class="font-22 text-fg-inverted text-center font-sans">
                  Join us on the journey
                </Text>
                <Text
                  class="font-20 text-fg-inverted mt-[24px] text-center font-sans"
                >
                  There&apos;s more ahead—new drops, member perks, and restock
                  alerts. Explore what&apos;s new and stay in the loop while
                  your cart is on hold.
                </Text>
                <Section class="mt-[40px] text-center">
                  <Link :href="url" class="font-16 text-fg-inverted font-sans">
                    {{ 'Start Exploring \u2192' }}
                  </Link>
                </Section>
              </Section>
            </Section>

            <!-- Footer -->
            <Section
              class="mobile:px-6 border-stroke mt-12 border-t px-[40px] pt-[80px] pb-[64px]"
            >
              <Text class="font-13 text-fg-3 m-0 max-w-[320px] font-sans">
                {{ companyName }} crafts thoughtful skincare—barrier-first
                formulas, honest labels, and routines you&apos;ll actually
                keep.
              </Text>
              <Row align="left">
                <Column class="w-full align-top">
                  <Section align="left" class="mt-8 w-[152px]">
                    <Row align="left">
                      <Column class="w-[20px] pr-6">
                        <Link :href="url" class="inline-block">
                          <Img
                            :src="`${baseUrl}/static/skin/social-x.png`"
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
                            :src="`${baseUrl}/static/skin/social-li.png`"
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
                            :src="`${baseUrl}/static/skin/social-yt.png`"
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
                            :src="`${baseUrl}/static/skin/social-gh.png`"
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
                  <Text class="font-11 text-fg-3 m-0 font-sans">
                    124 Mercantile Row, Studio 3
                    <br />
                    Los Angeles, CA, 90013
                  </Text>
                </Column>
              </Row>
              <Row align="left">
                <Column class="w-full pt-5 align-top">
                  <Text class="font-11 text-fg-3 m-0 max-w-[169px] font-sans">
                    <Link :href="url" class="text-fg-2">Unsubscribe</Link>
                    from {{ companyName }} marketing emails.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Section>
      </Body>
    </Html>
  </Tailwind>
</template>
