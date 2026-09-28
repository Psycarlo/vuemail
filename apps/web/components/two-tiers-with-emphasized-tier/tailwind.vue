<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'vuemail';

const plans = [
  {
    title: 'Hobby',
    price: 29,
    highlighted: false,
    description: 'The perfect plan for getting started.',
    features: [
      '25 products',
      'Up to 10,000 subscribers',
      'Advanced analytics',
      '24-hour support response time',
    ],
    buttonText: 'Get started today',
    buttonUrl: '#',
  },
  {
    title: 'Enterprise',
    price: 99,
    highlighted: true,
    description: 'Dedicated support and enterprise ready.',
    features: [
      'Unlimited products',
      'Unlimited subscribers',
      'Advanced analytics',
      'Dedicated support representative',
      'Marketing automations',
      'Custom integrations',
    ],
    buttonText: 'Get started today',
    buttonUrl: '#',
  },
];
</script>

<template>
  <Html>
    <Head />
    <Body>
      <Preview>Choose the right plan for you</Preview>
      <Container class="bg-white rounded-[8px] mx-auto max-w-[600px] p-[24px]">
        <Section class="mb-[42px]">
          <Heading class="text-[24px] leading-[32px] mb-[12px] text-center">
            Choose the right plan for you
          </Heading>
          <Text
            class="text-gray-500 text-[14px] leading-[20px] mx-auto max-w-[500px] text-center"
          >
            Choose an affordable plan with top features to engage audiences,
            build loyalty, and boost sales.
          </Text>
        </Section>
        <Section class="flex items-start gap-[20px] justify-center pb-[24px]">
          <Section
            v-for="plan in plans"
            :key="plan.title"
            :class="[
              plan.highlighted
                ? 'bg-[rgb(16,24,40)] border-[rgb(16,24,40)] text-gray-300 mb-[12px]'
                : 'bg-white border-gray-300 text-gray-600 mb-[24px]',
              'rounded-[8px] border border-solid p-[24px] text-left w-full',
            ]"
          >
            <Text
              :class="[
                plan.highlighted
                  ? 'text-[rgb(124,134,255)]'
                  : 'text-[rgb(79,70,229)]',
                'text-[14px] leading-[20px] font-semibold mb-[16px]',
              ]"
            >
              {{ plan.title }}
            </Text>
            <Text class="text-[28px] font-bold mb-[8px] mt-0">
              <span
                :class="
                  plan.highlighted
                    ? 'text-white'
                    : 'text-[rgb(16,24,40)]'
                "
              >${{ plan.price }}</span>
              {{ ' ' }}
              <span class="text-[14px] leading-[20px]">/ month</span>
            </Text>
            <Text class="mt-[12px] mb-[24px]">{{ plan.description }}</Text>
            <ul class="text-[12px] leading-[20px] mb-[30px] pl-[14px]">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="mb-[8px]"
              >
                {{ feature }}
              </li>
            </ul>
            <Button
              :href="plan.buttonUrl"
              class="bg-indigo-600 rounded-[8px] box-border text-white inline-block font-semibold m-0 max-w-full p-[12px] text-center w-full"
            >{{ plan.buttonText }}</Button>
          </Section>
        </Section>
        <Hr class="mt-0" />
        <Text
          class="text-gray-500 text-[12px] leading-[16px] font-medium mt-[30px] text-center"
        >
          Customer Experience Research Team
        </Text>
      </Container>
    </Body>
  </Html>
</template>
