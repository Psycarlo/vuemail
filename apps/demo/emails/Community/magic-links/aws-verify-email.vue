<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/vuemail/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'vuemail';
import tailwindConfig from '../../tailwind.config';

interface AWSVerifyEmailProps {
  verificationCode?: string;
}

const { verificationCode } = defineProps<AWSVerifyEmailProps>();

defineOptions({
  PreviewProps: {
    verificationCode: '596853',
  } satisfies AWSVerifyEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-white font-aws text-[#212121]">
        <Preview>AWS Email Verification</Preview>
        <Container class="p-5 mx-auto bg-[#eee]">
          <Section class="bg-white">
            <Section
              class="bg-[#252f3d] flex py-5 items-center justify-center"
            >
              <Img
                :src="`${baseUrl}/static/aws-logo.png`"
                width="75"
                height="45"
                alt="AWS's Logo"
              />
            </Section>
            <Section class="py-[25px] px-[35px]">
              <Heading class="text-[#333] text-[20px] font-bold mb-[15px]">
                Verify your email address
              </Heading>
              <Text
                class="text-[#333] text-[14px] leading-[24px] mt-6 mb-[14px] mx-0"
              >
                Thanks for starting the new AWS account creation process. We
                want to make sure it's really you. Please enter the following
                verification code when prompted. If you don&apos;t want to
                create an account, you can ignore this message.
              </Text>
              <Section class="flex items-center justify-center">
                <Text
                  class="text-[#333] m-0 font-bold text-center text-[14px]"
                >
                  Verification code
                </Text>

                <Text
                  class="text-[#333] text-[36px] my-[10px] mx-0 font-bold text-center"
                >
                  {{ verificationCode }}
                </Text>
                <Text class="text-[#333] text-[14px] m-0 text-center">
                  (This code is valid for 10 minutes)
                </Text>
              </Section>
            </Section>
            <Hr />
            <Section class="py-[25px] px-[35px]">
              <Text class="text-[#333] text-[14px] m-0">
                Amazon Web Services will never email you and ask you to
                disclose or verify your password, credit card, or banking
                account number.
              </Text>
            </Section>
          </Section>
          <Text class="text-[#333] text-[12px] my-[24px] mx-0 px-5 py-0">
            This message was produced and distributed by Amazon Web Services,
            Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
            Services, Inc.. All rights reserved. AWS is a registered trademark
            of
            <Link
              href="https://amazon.com"
              target="_blank"
              class="text-[#2754C5] underline text-[14px]"
            >Amazon.com</Link>, Inc. View our
            <Link
              href="https://amazon.com"
              target="_blank"
              class="text-[#2754C5] underline text-[14px]"
            >privacy policy</Link>.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
