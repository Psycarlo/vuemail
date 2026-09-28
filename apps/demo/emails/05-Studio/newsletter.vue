<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

/** Tech newsletter — same content blocks as Skin `newsletter.vue`, light card layout (Figma Email-Templates family). */

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
import TechFonts from './tech-fonts.vue';
import { techTailwindConfig } from './theme';

type TechNewsletterTip = {
  title: string;
  body: string;
  ctaLabel: string;
  imageSrc: string;
};

type TechNewsletterSpotlight = {
  title: string;
  body: string;
  imageSrc: string;
  buttonLabel: string;
};

type TechNewsletterCommunity = {
  imageSrc: string;
  headline: string;
  body: string;
  ctaLabel: string;
};

interface TechNewsletterEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<TechNewsletterEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Halo',
    url: 'https://example.com/',
  } satisfies TechNewsletterEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const letterMaxWidthClass = 'max-w-[430px]';

const techNewsletterLetterParagraphs = [
  "We're glad you're here. This is our space for Halo ring drops, sizing tips, and the stories behind each batch—we share what we're building, what we're learning, and when limited finishes return.",
  "No inbox noise—just emails when restocks land, firmware improves, or there's something meaningful for members. Thanks for reading; we're happy you're along for the journey.",
];

const techNewsletterTips: TechNewsletterTip[] = [
  {
    title: 'Pick the right ring size online',
    body: 'Use our printable sizer or visit a partner store so your Halo sits snug—returns are easier when the first fit is close.',
    ctaLabel: 'Read More →',
    imageSrc: `${baseUrl}/static/tech/tech-image-4.png`,
  },
  {
    title: 'Keep your AI assistant subtle',
    body: 'Toggle haptics and voice replies in the app so meetings stay quiet while you still get the nudges that matter.',
    ctaLabel: 'Read More →',
    imageSrc: `${baseUrl}/static/tech/tech-image-4.png`,
  },
];

const techNewsletterSpotlight: TechNewsletterSpotlight = {
  title: 'Your personal AI companion, wrapped around your finger.',
  body: 'Halo learns how you shop, move, and focus—then surfaces gentle prompts, order updates, and wellness cues without another screen.',
  imageSrc: `${baseUrl}/static/tech/tech-image-3.png`,
  buttonLabel: 'Read More →',
};

const techNewsletterCommunity: TechNewsletterCommunity = {
  imageSrc: `${baseUrl}/static/tech/tech-image-2.png`,
  headline: "Intelligence that doesn't demand attention.",
  body: "Shop your finish and size—we'll confirm inventory and ship fast.",
  ctaLabel: 'Shop Halo',
};
</script>

<template>
  <Tailwind :config="techTailwindConfig">
    <Html>
      <Head>
        <TechFonts />
      </Head>

      <Body class="bg-bg-3 m-0 p-0">
        <Preview>The latest from {{ companyName }}</Preview>
        <Container class="mx-auto max-w-[640px]">
          <Section class="rounded-[10px] bg-bg-2">
            <Section class="bg-bg-3">
              <Img
                :src="techNewsletterCommunity.imageSrc"
                alt=""
                :width="640"
                class="block w-full max-w-[640px] rounded-t-[10px]"
              />
            </Section>

            <Section class="px-6 pt-14">
              <Text
                class="font-geist font-40 text-fg m-0 mx-auto text-center"
                :class="letterMaxWidthClass"
              >
                Why your finger is the calmest screen
              </Text>

              <Text
                v-for="(p, i) in techNewsletterLetterParagraphs"
                :key="i"
                class="font-14 text-fg-2 m-0 mx-auto mt-6 text-center font-sans"
                :class="letterMaxWidthClass"
              >
                {{ p }}
              </Text>
            </Section>

            <Section class="mx-auto px-6 pt-14">
              <Section class="mx-auto max-w-[560px] rounded-[10px]">
                <Img
                  :src="techNewsletterSpotlight.imageSrc"
                  alt=""
                  :width="560"
                  class="block w-full max-w-[560px] rounded-[10px]"
                />
              </Section>

              <Section class="mt-10 mr-auto w-full max-w-[420px]">
                <Text class="m-0 font-22 font-geist text-fg text-center">
                  {{ techNewsletterSpotlight.title }}
                </Text>
                <Text class="m-0 mt-6 font-14 font-sans text-fg-2 text-center">
                  {{ techNewsletterSpotlight.body }}
                </Text>
                <Section class="mt-6 text-center">
                  <Link :href="url" class="font-14 font-sans text-fg-3">
                    {{ techNewsletterSpotlight.buttonLabel }}
                  </Link>
                </Section>
              </Section>
            </Section>

            <Section class="px-6 pt-14">
              <Text class="m-0 font-22 font-geist text-fg text-center">
                From the Halo journal
              </Text>
            </Section>

            <Section class="px-6 pt-8">
              <Section class="mx-auto max-w-[560px]">
                <Row>
                  <Column
                    v-for="(tip, idx) in techNewsletterTips"
                    :key="idx"
                    :class="
                      idx === 0 ? 'w-1/2 pr-2 align-top' : 'w-1/2 pl-2 align-top'
                    "
                  >
                    <Section class="px-2 py-4 rounded-[10px]">
                      <Section class="rounded-[8px]">
                        <Img
                          :src="tip.imageSrc"
                          alt=""
                          :width="252"
                          class="block w-full max-w-[252px] rounded-[8px]"
                        />
                      </Section>
                      <Text class="m-0 mt-4 font-14 font-sans text-fg">
                        {{ tip.title }}
                      </Text>
                      <Text class="m-0 mt-3 font-14 font-sans text-fg-2">
                        {{ tip.body }}
                      </Text>
                      <Section class="mt-4">
                        <Link :href="url" class="font-14 font-sans text-fg-3">
                          {{ tip.ctaLabel }}
                        </Link>
                      </Section>
                    </Section>
                  </Column>
                </Row>
              </Section>
            </Section>

            <Section class="px-6 pt-12 pb-12">
              <Section
                class="bg-bg-2 mx-auto px-4 py-10 rounded-[10px] max-w-[560px] text-center"
              >
                <Text class="m-0 font-20 font-geist text-fg">
                  {{ techNewsletterCommunity.headline }}
                </Text>
                <Text class="m-0 mt-3 font-14 font-sans text-fg-2">
                  {{ techNewsletterCommunity.body }}
                </Text>
                <Section class="mt-6">
                  <Button
                    :href="url"
                    class="inline-block border border-button-border bg-white px-5 py-3 font-15 font-sans text-fg rounded-[8px]"
                  >
                    {{ techNewsletterCommunity.ctaLabel }}
                  </Button>
                </Section>
              </Section>
            </Section>

            <Section class="mx-auto px-6 pb-8" :class="letterMaxWidthClass">
              <Text class="m-0 font-14 font-sans text-fg-3 text-center">
                {{ companyName }} is the AI ring on your finger—easy shopping,
                clear shipping, and real support when you need it.
              </Text>
            </Section>

            <Section class="px-6 pt-2 pb-16 text-center">
              <Section class="mx-auto max-w-[320px]">
                <Section class="mx-auto mt-2 mb-8 w-fit">
                  <Row>
                    <Column class="pr-[20px] w-[20px]">
                      <Link :href="url" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-x-black.png`"
                          alt="X"
                          :width="20"
                          :height="20"
                          class="block"
                        />
                      </Link>
                    </Column>
                    <Column class="pr-[20px] w-[20px]">
                      <Link :href="url" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-in-black.png`"
                          alt="LinkedIn"
                          :width="20"
                          :height="20"
                          class="block"
                        />
                      </Link>
                    </Column>
                    <Column class="pr-[20px] w-[20px]">
                      <Link :href="url" class="inline-block">
                        <Img
                          :src="`${baseUrl}/static/shared/social-yt-black.png`"
                          alt="YouTube"
                          :width="20"
                          :height="20"
                          class="block"
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
                          class="block"
                        />
                      </Link>
                    </Column>
                  </Row>
                </Section>

                <Text class="m-0 font-11 font-sans text-fg-3">
                  123 Market Street, Floor 1
                  <br />
                  Tech City, CA, 94102
                </Text>
                <Text class="m-0 mt-5 font-11 font-sans text-fg-3">
                  <Link :href="url" class="text-fg-2">Unsubscribe</Link>
                  from {{ companyName }} marketing emails.
                </Text>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
