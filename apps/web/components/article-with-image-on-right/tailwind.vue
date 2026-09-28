<script setup lang="ts">
import { Img, Link, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="my-[16px] text-center">
    <Section class="inline-block w-full max-w-[250px] text-left align-top">
      <Text
        class="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]"
      >
        What's new
      </Text>
      <Text
        class="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]"
      >
        Versatile Comfort
      </Text>
      <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Experience ultimate comfort and versatility with our furniture
        collection, designed to adapt to your ever-changing needs.
      </Text>
      <Link
        class="text-indigo-600 underline"
        href="https://vuemail.dev"
      >Read more</Link>
    </Section>
    <Section class="my-[8px] inline-block w-full max-w-[220px] align-top">
      <Img
        alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
        class="rounded-[8px] object-cover"
        :height="220"
        src="/static/versatile-comfort.jpg"
        :width="220"
      />
    </Section>
  </Section>
</template>
