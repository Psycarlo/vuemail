<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';
import tailwindConfig from '../../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-[#dbddde] font-google">
        <Preview>Google Play developers</Preview>
        <Container
          class="my-[30px] mx-auto bg-white rounded-[5px] overflow-hidden"
        >
          <Section>
            <Row>
              <Column>
                <Img
                  class="-mt-px"
                  :src="`${baseUrl}/static/google-play-header.png`"
                  width="305"
                  height="28"
                  alt="Google Play developers header blue transparent"
                />
                <Img
                  class="px-10"
                  :src="`${baseUrl}/static/google-play-logo.png`"
                  width="155"
                  height="31"
                  alt="Google Play"
                />
              </Column>
            </Row>
          </Section>

          <Section class="px-10">
            <Hr class="border-[#e8eaed] my-5" />
            <Text class="text-sm leading-[26px] font-bold text-[#004dcf]">
              DEVELOPER UPDATE
            </Text>
            <Text class="text-sm leading-[22px] text-[#3c4043]">
              Hello Google Play Developer,
            </Text>
            <Text class="text-sm leading-[22px] text-[#3c4043]">
              We strive to make Google Play a safe and trusted experience for
              users.
            </Text>
            <Text class="text-sm leading-[22px] text-[#3c4043]">
              We've added clarifications to our
              <Link
                href="https://notifications.google.com"
                class="text-sm leading-[22px] text-[#004dcf]"
              >Target API Level policy</Link>. Because this is a clarification,
              our enforcement standards and practices for this policy remain the
              same.
            </Text>
          </Section>
          <Section class="pl-10">
            <Text class="text-sm leading-[22px] text-[#3c4043]">
              We're noting exceptions to the
              <Link
                href="https://notifications.google.com"
                class="text-sm leading-[22px] text-[#004dcf]"
              >Target API Level policy</Link>, which can be found in our updated
              <Link
                href="https://notifications.google.com"
                class="text-sm leading-[22px] text-[#004dcf]"
              >Help Center article.</Link>These exceptions include permanently
              private apps and apps that target automotive or wearables form
              factors and are bundled within the same package.
              <Link
                href="https://notifications.google.com"
                class="text-sm leading-[22px] text-[#004dcf]"
              >Learn more</Link>
            </Text>
          </Section>
          <Section class="px-10">
            <Text class="text-sm leading-[22px] text-[#3c4043]">
              We're also extending the deadline to give you more time to adjust
              to these changes. Now, apps that target API level 29 or below will
              start experiencing reduced distribution starting
              <b>Jan 31, 2023</b> instead of Nov 1, 2022. If you need more time
              to update your app, you can request an extension to keep your app
              discoverable to all users until May 1, 2023.
            </Text>
            <Hr class="border-[#e8eaed] my-5" />
          </Section>

          <Section class="px-10">
            <Text class="text-sm leading-[22px] text-[#3c4043]">
              Thank you,
            </Text>
            <Text class="text-xl leading-[22px] text-[#3c4043]">
              The Google Play team
            </Text>
          </Section>

          <Section class="bg-[#f0fcff] w-[90%] rounded-[5px] overflow-hidden pl-5">
            <Row>
              <Text class="text-sm leading-[22px] text-[#3c4043]">
                Connect with us
              </Text>
            </Row>
            <Row align="left" class="w-[84px] float-left">
              <Column class="pr-1">
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    :src="`${baseUrl}/static/google-play-chat.png`"
                  />
                </Link>
              </Column>
              <Column class="pr-1">
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    :src="`${baseUrl}/static/google-play-icon.png`"
                  />
                </Link>
              </Column>
              <Column class="pr-1">
                <Link href="https://notifications.google.com">
                  <Img
                    width="28"
                    height="28"
                    :src="`${baseUrl}/static/google-play-academy.png`"
                  />
                </Link>
              </Column>
            </Row>
            <Row>
              <Img
                class="max-w-full"
                width="540"
                height="48"
                :src="`${baseUrl}/static/google-play-footer.png`"
              />
            </Row>
          </Section>

          <Section class="px-10 pb-[30px]">
            <Text
              class="text-xs leading-[22px] text-[#3c4043] text-center m-0"
            >
              © 2022 Google LLC 1600 Amphitheatre Parkway, Mountain View, CA
              94043, USA
            </Text>
            <Text
              class="text-xs leading-[22px] text-[#3c4043] text-center m-0"
            >
              You have received this mandatory email service announcement to
              update you about important changes to your Google Play Developer
              account.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
