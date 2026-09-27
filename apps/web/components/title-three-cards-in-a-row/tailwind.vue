<script setup lang="ts">
import { Button, Img, Row, Section, Text } from 'vuemail';

const responsiveRow = { textAlign: 'center', fontSize: '0' } as const;

const responsiveColumn = {
  maxWidth: '200px',
  display: 'inline-block',
  verticalAlign: 'top',
  fontSize: '16px',
  boxSizing: 'border-box',
} as const;
</script>

<template>
  <Section class="my-[16px]">
    <Row>
      <Text class="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]">
        Timing Products
      </Text>
      <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Dieter Rams consistently implemented his design principles over the
        course of over three decades as the Braun design leader.
      </Text>
    </Row>
    <Section class="mt-[16px]" :style="responsiveRow">
      <Section class="py-[16px] pr-[4px] text-left" :style="responsiveColumn">
        <Img
          alt="Braun Analogue Clock"
          class="w-full rounded-[8px] object-cover"
          :height="180"
          src="/static/braun-analogue-clock.jpg"
        />
        <Text
          class="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]"
        >
          Analogue Clock
        </Text>
        <Text class="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
          Thoughtful and simply designed.
        </Text>
        <Text
          class="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]"
        >
          $40.00
        </Text>
        <Button
          class="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href="https://vuemail.dev"
        >Buy</Button>
      </Section>
      <Section class="px-[4px] py-[16px] text-left" :style="responsiveColumn">
        <Img
          alt="Braun Wall Clock"
          class="w-full rounded-[8px] object-cover"
          :height="180"
          src="/static/braun-wall-clock.jpg"
        />
        <Text
          class="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]"
        >
          Wall Clock
        </Text>
        <Text class="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
          The original easy to read dial layout.
        </Text>
        <Text
          class="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]"
        >
          $45.00
        </Text>
        <Button
          class="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href="https://vuemail.dev"
        >Buy</Button>
      </Section>
      <Section class="py-[16px] pl-[4px] text-left" :style="responsiveColumn">
        <Img
          alt="Braun Classic Watch"
          class="w-full rounded-[8px] object-cover"
          :height="180"
          src="/static/braun-classic-watch.jpg"
        />
        <Text
          class="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]"
        >
          Classic Watch
        </Text>
        <Text class="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
          Functional, classic, and built to last.
        </Text>
        <Text
          class="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]"
        >
          $210.00
        </Text>
        <Button
          class="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
          href="https://vuemail.dev"
        >Buy</Button>
      </Section>
    </Section>
  </Section>
</template>
