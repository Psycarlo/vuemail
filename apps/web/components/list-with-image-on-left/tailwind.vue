<script setup lang="ts">
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'vuemail';

const steps = [
  {
    number: 1,
    imageUrl: '/static/stagg-eletric-kettle.jpg',
    title: 'Start Your Search',
    description:
      'Search for the products you need or upload your list of requirements.',
    learnMoreLink: '#',
  },
  {
    number: 2,
    imageUrl: '/static/atmos-vacuum-canister.jpg',
    title: 'Compare & Save',
    description:
      'Compare prices and offers from different suppliers to find the best deals.',
    learnMoreLink: '#',
  },
  {
    number: 3,
    imageUrl: '/static/bundle-collection.jpg',
    title: 'Build Your Cart',
    description:
      'Select your desired items and add them to your shopping cart.',
    learnMoreLink: '#',
  },
  {
    number: 4,
    imageUrl: '/static/clara-french-press.jpg',
    title: 'Enjoy The Benefits',
    description:
      'Receive your products and enjoy the savings and convenience of our service.',
    learnMoreLink: '#',
  },
];
</script>

<template>
  <Html>
    <Head />
    <Body class="bg-white">
      <Preview>How Our Service Works: 5 Simple Steps</Preview>
      <Container
        class="mx-auto max-w-[600px] rounded-[8px] bg-white px-[24px] pt-[24px] pb-0"
      >
        <Heading
          as="h1"
          class="mb-[42px] text-center text-[24px] leading-[32px]"
        >
          How Our Service Works: 5 Simple Steps
        </Heading>
        <Section v-for="step in steps" :key="step.title" class="mb-[30px]">
          <Row class="mb-[24px]">
            <Column width="40%" class="w-2/5 pr-[24px]">
              <Img
                :src="step.imageUrl"
                width="100%"
                height="168"
                :alt="`Step image - ${step.number}`"
                class="block w-full rounded-[4px] object-cover object-center"
              />
            </Column>
            <Column width="60%" class="w-3/5 pr-[24px]">
              <Row
                width="24"
                class="w-[24px] h-[24px] mb-[18px]"
                :align="undefined"
              >
                <Column
                  width="24"
                  height="24"
                  class="rounded-full h-[24px] w-[24px] bg-indigo-600 font-semibold text-white text-[12px] leading-none"
                  align="center"
                  valign="middle"
                >
                  {{ step.number }}
                </Column>
              </Row>
              <Heading
                as="h2"
                class="mt-0 mb-[8px] font-bold text-[20px] leading-none"
              >
                {{ step.title }}
              </Heading>
              <Text class="m-0 text-gray-500 text-[14px] leading-[24px]">
                {{ step.description }}
              </Text>
              <Link
                :href="step.learnMoreLink"
                class="mt-[12px] block font-semibold text-indigo-600 text-[14px] no-underline"
              >Learn more →</Link>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
