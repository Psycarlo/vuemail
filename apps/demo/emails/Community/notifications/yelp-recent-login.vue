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
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';
import tailwindConfig from '../../tailwind.config';

interface YelpRecentLoginEmailProps {
  userFirstName?: string;
  loginDate?: Date;
  loginDevice?: string;
  loginLocation?: string;
  loginIp?: string;
}

const { userFirstName, loginDate, loginDevice, loginLocation, loginIp } =
  defineProps<YelpRecentLoginEmailProps>();

defineOptions({
  PreviewProps: {
    userFirstName: 'Alan',
    loginDate: new Date('September 7, 2022, 10:58 am'),
    loginDevice: 'Chrome on Mac OS X',
    loginLocation: 'Upland, California, United States',
    loginIp: '47.149.53.167',
  } satisfies YelpRecentLoginEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

const formattedDate = new Intl.DateTimeFormat('en', {
  dateStyle: 'long',
  timeStyle: 'short',
}).format(loginDate);
</script>

<template>
  <Html>
    <Tailwind :config="tailwindConfig">
      <Head />
      <Body class="bg-white font-yelp">
        <Preview>Yelp recent login</Preview>
        <Container>
          <Section class="px-5 py-[30px]">
            <Img :src="`${baseUrl}/static/yelp-logo.png`" alt="Yelp logo" />
          </Section>

          <Section
            class="border border-solid border-black/10 rounded overflow-hidden"
          >
            <Row>
              <Img
                class="max-w-full"
                :width="620"
                :src="`${baseUrl}/static/yelp-header.png`"
                alt="Yelp header illustration"
              />
            </Row>

            <Row class="p-5 pb-0">
              <Column>
                <Heading class="text-[32px] font-bold text-center">
                  Hi {{ userFirstName }},
                </Heading>
                <Heading as="h2" class="text-[26px] font-bold text-center">
                  We noticed a recent login to your Yelp account.
                </Heading>

                <Text class="text-base">
                  <b>Time: </b>{{ formattedDate }}
                </Text>
                <Text class="text-base -mt-[5px]">
                  <b>Device: </b>{{ loginDevice }}
                </Text>
                <Text class="text-base -mt-[5px]">
                  <b>Location: </b>{{ loginLocation }}
                </Text>
                <Text
                  class="text-black/50 text-sm leading-[24px] -mt-[5px]"
                >
                  *Approximate geographic location based on IP address:{{ loginIp }}
                </Text>

                <Text class="text-base">
                  If this was you, there's nothing else you need to do.
                </Text>
                <Text class="text-base -mt-[5px]">
                  If this wasn't you or if you have additional questions,
                  please see our support page.
                </Text>
              </Column>
            </Row>
            <Row class="p-5 pt-0">
              <Column class="text-center" :colspan="2">
                <Button
                  class="bg-[#e00707] rounded border border-solid border-black/10 text-white font-bold cursor-pointer inline-block px-[30px] py-3 no-underline"
                >
                  Learn More
                </Button>
              </Column>
            </Row>
          </Section>

          <Section class="pt-[45px]">
            <Img
              class="max-w-full"
              :width="620"
              :src="`${baseUrl}/static/yelp-footer.png`"
              alt="Yelp footer decoration"
            />
          </Section>

          <Text class="text-center text-xs leading-[24px] text-black/70">
            © 2022 | Yelp Inc., 350 Mission Street, San Francisco, CA 94105,
            U.S.A. | www.yelp.com
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
