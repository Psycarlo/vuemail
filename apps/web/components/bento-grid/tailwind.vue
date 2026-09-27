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

const products = [
  {
    imageUrl: '/static/atmos-vacuum-canister.jpg',
    altText: 'Auto-Sealing Vacuum Canister',
    title: 'Auto-Sealing Vacuum Canister',
    description:
      'A container that automatically creates an airtight seal with a button press.',
    linkUrl: '#',
  },
  {
    imageUrl: '/static/vacuum-canister-clear-glass-bundle.jpg',
    altText: '3-Pack Vacuum Containers',
    title: '3-Pack Vacuum Containers',
    description:
      'Keep your coffee fresher for longer with this set of high-performance vacuum containers.',
    linkUrl: '#',
  },
];
</script>

<template>
  <Html>
    <Head />
    <Body>
      <Preview>Coffee Storage</Preview>
      <Container
        class="bg-white rounded-[8px] mx-auto max-w-[900px] overflow-hidden p-0"
      >
        <Section>
          <Row
            class="bg-[rgb(41,37,36)] border-separate [border-spacing:24px] m-0 table-fixed w-full"
          >
            <Column class="pl-[12px]">
              <Heading
                as="h1"
                class="text-white text-[28px] font-bold mb-[10px]"
              >
                Coffee Storage
              </Heading>
              <Text class="text-white/60 text-[14px] leading-[20px] m-0">
                Keep your coffee fresher for longer with innovative technology.
              </Text>
              <Link
                href="#"
                class="text-white/80 block text-[14px] leading-[20px] font-semibold mt-[12px] no-underline"
              >Shop now →</Link>
            </Column>
            <Column class="w-[42%] h-[250px]">
              <Img
                src="/static/coffee-bean-storage.jpg"
                alt="Coffee Bean Storage"
                class="rounded-[4px] h-full -mr-[6px] object-cover object-center w-full"
              />
            </Column>
          </Row>
        </Section>
        <Section class="mb-[24px]">
          <Row class="border-separate [border-spacing:12px] table-fixed w-full">
            <Column
              v-for="product in products"
              :key="product.title"
              class="mx-auto max-w-[180px]"
            >
              <Img
                :src="product.imageUrl"
                :alt="product.altText"
                class="rounded-[4px] mb-[18px] w-full"
              />
              <div>
                <Heading
                  as="h2"
                  class="text-[14px] leading-[20px] font-bold mb-[8px]"
                >
                  {{ product.title }}
                </Heading>
                <Text
                  class="text-gray-500 text-[12px] leading-[20px] m-0 pr-[12px]"
                >
                  {{ product.description }}
                </Text>
              </div>
            </Column>
          </Row>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
