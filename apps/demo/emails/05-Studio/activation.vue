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
import TechFonts from './tech-fonts.vue';
import { techTailwindConfig } from './theme';

interface TechActivationEmailProps {
  companyName: string;
  url: string;
}

const { companyName, url } = defineProps<TechActivationEmailProps>();

defineOptions({
  PreviewProps: {
    companyName: 'Halo',
    url: 'https://example.com/',
  } satisfies TechActivationEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Tailwind :config="techTailwindConfig">
    <Html>
      <Head>
        <TechFonts />
      </Head>

      <Body class="bg-bg-2 m-0 p-0">
        <Preview>Confirm your email address</Preview>
        <Container class="mx-auto w-full max-w-[640px]">
          <Section class="bg-bg-3 px-0 pt-14 text-center">
            <Section class="px-6 pb-[72px]">
              <Section class="mb-8">
                <Img
                  :src="`${baseUrl}/static/tech/logo-wordmark.png`"
                  alt="Logo"
                  :width="64"
                  class="block mx-auto"
                />
              </Section>

              <Section class="mx-auto mb-8 max-w-[448px]">
                <Text class="m-0 font-40 font-geist text-fg">
                  One last step
                </Text>
                <Text class="m-0 mt-6 font-14 font-sans text-fg-2">
                  Thanks for creating your {{ companyName }} account.
                  <br />
                  To shop, track ring orders, and get updates, please confirm
                  this email address.
                </Text>
              </Section>

              <Button
                :href="url"
                class="inline-block bg-white px-[20px] py-[12px] border border-button-border rounded-[8px] font-15 font-sans text-[#1F2222]"
              >
                Confirm Email
              </Button>
            </Section>
          </Section>

          <Section class="px-6 py-20 text-center">
            <Section class="mx-auto max-w-[320px]">
              <Text class="m-0 font-13 font-sans text-fg-2">
                {{ companyName }} is the AI ring on your finger—easy shopping,
                clear shipping, and real support when you need it.
              </Text>

              <Section class="mx-auto mt-8 mb-8 w-fit">
                <Row>
                  <Column class="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
                      <Img
                        :src="`${baseUrl}/static/shared/social-x-black.png`"
                        alt="X"
                        :width="20"
                        :height="20"
                        class="block"
                      />
                    </Link>
                  </Column>
                  <Column class="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
                      <Img
                        :src="`${baseUrl}/static/shared/social-in-black.png`"
                        alt="LinkedIn"
                        :width="20"
                        :height="20"
                        class="block"
                      />
                    </Link>
                  </Column>
                  <Column class="pr-[32px] w-[20px]">
                    <Link href="https://example.com/" class="inline-block">
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
                    <Link href="https://example.com/" class="inline-block">
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

              <Text class="m-0 font-11 font-sans text-fg-2">
                123 Market Street, Floor 1
                <br />
                Tech City, CA, 94102
              </Text>
              <Text class="m-0 mt-5 font-11 font-sans text-fg-2">
                <Link href="https://example.com/" class="text-fg-2">Unsubscribe</Link>
                from {{ companyName }} marketing emails.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
