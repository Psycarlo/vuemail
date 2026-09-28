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
} from '@vuemaildev/vuemail';
import SkinFonts from './skin-fonts.vue';
import { skinTailwindConfig } from './theme';

type NewsletterTip = {
  step: number;
  title: string;
  body: string;
  ctaLabel: string;
};
type NewsletterCommunity = {
  imageSrc: string;
  headline: string;
  body: string;
  ctaLabel: string;
};
interface NewsletterEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<NewsletterEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Skin',
    url: 'https://example.com/',
  } satisfies NewsletterEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const newsletterLetterParagraphs = [
  "We're glad you're here. This is where we share routine notes, ingredient spotlights, and first word on drops—plus the occasional restock alert before shelves clear.",
  'No inbox clutter—just emails when we have something worth your time. Thanks for letting us sit next to your morning serum and your evening wind-down.',
];
const newsletterTips: NewsletterTip[] = [
  {
    step: 1,
    title: 'Start with a patch test',
    body: "Try new textures on a small area first, especially if you're rotating in actives or seasonal formulas.",
    ctaLabel: 'Learn more \u2192',
  },
  {
    step: 2,
    title: 'Layer for your climate',
    body: "Humidity, cold snaps, and travel all change how skin drinks product layers in heat, richer barriers when it's dry.",
    ctaLabel: 'Learn more \u2192',
  },
  {
    step: 3,
    title: 'Track what works',
    body: 'Note how your skin feels after AM and PM routines so you can double down on what actually moves the needle.',
    ctaLabel: 'Learn more \u2192',
  },
];

const newsletterCommunity: NewsletterCommunity = {
  imageSrc: `${baseUrl}/static/skin/skin-image-5.png`,
  headline:
    'Most members say one or two routine swaps moved the needle more than a dozen impulse buys.',
  body: 'Peek behind the formulas—short guides, founder notes, and community answers so you shop for your skin, not the algorithm.',
  ctaLabel: 'See what\u2019s new \u2192',
};

const quoteText =
  'Shopping with ' +
  companyName +
  ' finally made my counter feel calm—every product earns its spot, and my skin stays predictable through travel and stress.';
</script>

<template>
  <Tailwind :config="skinTailwindConfig">
    <Html>
      <Head>
        <SkinFonts />
      </Head>

      <Body class="m-0 bg-white p-0 font-15 font-sans">
        <Preview>The latest from {{ companyName }}</Preview>
        <Section class="bg-white m-0 w-full p-0">
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
            <Section class="mobile:px-6 px-[40px] pb-[80px]">
              <Text class="font-72 text-fg m-0 mt-[64px] font-serif capitalize">
                Newsletter
              </Text>
              <Text
                class="font-15 text-fg-2 m-0 mt-[32px] max-w-[430px] font-sans"
              >
                Hi there,
              </Text>
              <Text
                v-for="(p, i) in newsletterLetterParagraphs"
                :key="i"
                class="font-15 text-fg-2 m-0 mt-[32px] max-w-[430px] font-sans"
              >
                {{ p }}
              </Text>
              <Text
                class="font-15 text-fg m-0 mt-[32px] max-w-[430px] font-sans"
              >
                Thanks for reading, <br /> The {{ companyName }} team
              </Text>
            </Section>

            <Section class="bg-bg-2">
              <Img
                :src="`${baseUrl}/static/skin/skin-image-4.png`"
                alt=""
                :width="640"
                class="block w-full max-w-[640px]"
              />
            </Section>
            <Section class="mobile:px-6 mobile:pt-12 px-[40px] pt-[88px]">
              <Text
                class="mobile:mt-10 font-72 text-fg m-0 mt-[64px] font-serif capitalize"
              >
                Tips and resources
              </Text>
              <Section
                v-for="(tip, idx) in newsletterTips"
                :key="idx"
                :class="
                  idx === 0
                    ? 'mobile:mt-12 mt-[88px]'
                    : 'mobile:mt-10 mt-[80px]'
                "
              >
                <Row>
                  <Column
                    class="mobile:!block mobile:!w-full mobile:!max-w-full w-[260px] max-w-[260px] align-top"
                  >
                    <Row>
                      <Column class="w-[40px] align-top">
                        <Section class="bg-bg-2 w-[40px] text-center">
                          <Text class="font-20 text-fg m-0 font-serif">
                            {{ tip.step }}
                          </Text>
                        </Section>
                      </Column>
                      <Column class="mobile:!hidden w-[22px]" />
                      <Column class="mobile:pl-3 mobile:!max-w-full align-top">
                        <Text class="font-15 text-fg m-0 font-sans">
                          {{ tip.title }}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                  <Column class="mobile:!hidden w-[20px]" />
                  <Column
                    class="mobile:!block mobile:pt-6 mobile:!w-full mobile:!max-w-full align-top"
                  >
                    <Text
                      class="mobile:!max-w-full font-15 text-fg m-0 font-sans"
                    >
                      {{ tip.body }}
                    </Text>
                    <Section class="mt-[8px]">
                      <Link :href="url" class="font-15 text-fg font-sans">
                        {{ tip.ctaLabel }}
                      </Link>
                    </Section>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section class="mobile:px-6 px-[40px] pt-[104px]">
              <Text class="font-48 text-fg m-0 font-serif">
                &ldquo;{{ quoteText }}&rdquo;
              </Text>
              <Section class="mt-[48px]">
                <Text class="font-20 text-fg m-0 font-sans">
                  Alex Morgan
                </Text>
                <Text class="font-20 text-fg-2 m-0 font-sans">
                  Member since 2024
                </Text>
              </Section>
            </Section>

            <Section class="mobile:px-6 px-[40px] pt-[48px] pb-[56px]">
              <Section class="bg-bg-2 rounded-[2px]">
                <Img
                  :src="newsletterCommunity.imageSrc"
                  alt=""
                  :width="560"
                  class="block w-full max-w-[560px]"
                />
              </Section>
              <Section class="mt-[56px]">
                <Text class="font-24 text-fg m-0 max-w-[480px] font-sans">
                  {{ newsletterCommunity.headline }}
                </Text>
                <Text
                  class="font-18 text-fg-2 m-0 mt-[20px] max-w-[430px] font-sans"
                >
                  {{ newsletterCommunity.body }}
                </Text>
                <Section class="mt-[32px]">
                  <Link :href="url" class="font-16 text-fg font-sans">
                    {{ newsletterCommunity.ctaLabel }}
                  </Link>
                </Section>
              </Section>
            </Section>

            <!-- Footer -->
            <Section
              class="mobile:px-6 border-stroke mt-8 border-t px-[40px] pt-[80px] pb-[64px]"
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
