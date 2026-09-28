<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';
import tailwindConfig from '../../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-[#f6f9fc] font-stripe">
        <Preview>You're now ready to make live transactions with Stripe!</Preview>
        <Container class="bg-white mx-auto py-5 pb-12 mb-16">
          <Section class="px-12">
            <Img
              :src="`${baseUrl}/static/stripe-logo.png`"
              width="49"
              height="21"
              alt="Stripe"
            />
            <Hr class="border-[#e6ebf1] my-5" />
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              Thanks for submitting your account information. You're now ready
              to make live transactions with Stripe!
            </Text>
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              You can view your payments and a variety of other information
              about your account right from your dashboard.
            </Text>
            <Button
              class="bg-[#656ee8] rounded-[3px] text-white text-[16px] font-bold no-underline text-center block p-[10px]"
              href="https://dashboard.stripe.com/login"
            >
              View your Stripe Dashboard
            </Button>
            <Hr class="border-[#e6ebf1] my-5" />
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              If you haven't finished your integration, you might find our
              <Link
                class="text-[#556cd6]"
                href="https://docs.stripe.com/dashboard/basics"
              >docs</Link>
              handy.
            </Text>
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              Once you're ready to start accepting payments, you'll just need to
              use your live
              <Link
                class="text-[#556cd6]"
                href="https://dashboard.stripe.com/login?redirect=%2Fapikeys"
              >API keys</Link>
              instead of your test API keys. Your account can simultaneously be
              used for both test and live requests, so you can continue testing
              while accepting live payments. Check out our
              <Link
                class="text-[#556cd6]"
                href="https://docs.stripe.com/dashboard/basics"
              >tutorial about account basics</Link>.
            </Text>
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              Finally, we've put together a
              <Link
                class="text-[#556cd6]"
                href="https://docs.stripe.com/get-started/checklist/website"
              >quick checklist</Link>
              to ensure your website conforms to card network standards.
            </Text>
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              We'll be here to help you with any step along the way. You can
              find answers to most questions and get in touch with us on our
              <Link
                class="text-[#556cd6]"
                href="https://support.stripe.com"
              >support site</Link>.
            </Text>
            <Text class="text-[#525f7f] text-base leading-6 text-left">
              — The Stripe team
            </Text>
            <Hr class="border-[#e6ebf1] my-5" />
            <Text class="text-[#8898aa] text-xs leading-4">
              Stripe, 354 Oyster Point Blvd, South San Francisco, CA 94080
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
