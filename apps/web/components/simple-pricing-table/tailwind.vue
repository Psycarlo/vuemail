<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'vuemail';

const features = [
  'Manage up to 25 premium products',
  'Grow your audience with 10,000 subscribers',
  'Make data-driven decisions with advanced analytics',
  'Priority support with 24-hour response time',
  'Seamless integration with your favorite tools',
];
</script>

<template>
  <Html>
    <Head />
    <Body>
      <Preview>
        Exclusive Offer Just For You: Unlock Premium Features at $12/month
      </Preview>
      <Container class="bg-white rounded-[12px] mx-auto max-w-[500px] p-[24px]">
        <Section
          class="bg-white border border-solid border-gray-300 rounded-[12px] text-gray-600 p-[28px] w-full text-left mb-0"
        >
          <Text
            class="text-indigo-600 text-[12px] leading-[20px] font-semibold tracking-wide mb-[16px] mt-[16px] uppercase"
          >
            Exclusive Offer
          </Text>
          <Text class="text-[30px] font-bold leading-[36px] mb-[12px] mt-0">
            <span class="text-[rgb(16,24,40)]">$12</span>
            {{ ' ' }}
            <span class="text-[16px] font-medium leading-[20px]">/ month</span>
          </Text>
          <Text
            class="text-gray-700 text-[14px] leading-[20px] mt-[16px] mb-[24px]"
          >
            We've handcrafted the perfect plan tailored specifically for your
            needs. Unlock premium features at an unbeatable value.
          </Text>
          <ul
            class="text-gray-500 text-[14px] leading-[24px] mb-[32px] pl-[14px]"
          >
            <li
              v-for="feature in features"
              :key="feature"
              class="mb-[12px] relative"
            >
              <span class="relative">{{ feature }}</span>
            </li>
          </ul>
          <Button
            href="#"
            class="bg-indigo-600 rounded-[8px] box-border text-white inline-block text-[16px] leading-[24px] font-bold tracking-wide mb-[24px] max-w-full p-[14px] text-center w-full"
          >Claim Your Special Offer</Button>
          <Hr />
          <Text
            class="text-gray-500 text-[12px] leading-[16px] italic mt-[24px] mb-[6px] text-center"
          >
            Limited time offer - Upgrade now and save 20%
          </Text>
          <Text
            class="text-gray-500 text-[12px] m-0 leading-[16px] text-center"
          >
            No credit card required. 14-day free trial available.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
