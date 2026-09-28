<script setup lang="ts">
import { Button, Heading, Img, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <Img
      alt="Braun Collection"
      class="w-full rounded-[12px] object-cover"
      :height="320"
      src="/static/braun-collection.jpg"
    />
    <Section class="mt-[32px] text-center">
      <Text
        class="mt-[16px] font-semibold text-[18px] text-indigo-600 leading-[28px]"
      >
        Classic Watches
      </Text>
      <Heading
        as="h1"
        class="font-semibold text-[36px] text-gray-900 leading-[40px] tracking-[0.4px]"
      >
        Elegant Comfort
      </Heading>
      <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Dieter Rams’ work has an outstanding quality which distinguishes it from
        the vast majority of industrial design of the entire 20th Century.
      </Text>
      <Text class="font-semibold text-[16px] text-gray-900 leading-[24px]">
        $210.00
      </Text>
      <Button
        class="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
        href="https://vuemail.dev"
      >Buy now</Button>
    </Section>
  </Section>
</template>
