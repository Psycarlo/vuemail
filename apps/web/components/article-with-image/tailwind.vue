<script setup lang="ts">
import { Button, Heading, Img, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <Img
      alt="Herman Miller Chair"
      class="w-full rounded-[12px] object-cover"
      height="320"
      src="/static/herman-miller-chair.jpg"
    />
    <Section class="mt-[32px] text-center">
      <Text
        class="my-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]"
      >
        Our new article
      </Text>
      <Heading
        as="h1"
        class="m-0 mt-[8px] font-semibold text-[36px] text-gray-900 leading-[36px]"
      >
        Designing with Furniture
      </Heading>
      <Text class="text-[16px] text-gray-500 leading-[24px]">
        Unleash your inner designer as we explore how furniture plays a vital
        role in creating stunning interiors, offering insights into choosing the
        right pieces, arranging them harmoniously, and infusing your space with
        personality.
      </Text>
      <Button
        class="mt-[16px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
        href="https://vuemail.dev"
      >Read more</Button>
    </Section>
  </Section>
</template>
