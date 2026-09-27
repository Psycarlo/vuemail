<script setup lang="ts">
import { Button, Column, Hr, Img, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <Section>
      <Row>
        <Text
          class="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]"
        >
          Timing Products
        </Text>
        <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          Dieter Rams consistently implemented his design principles over the
          course of over three decades as the Braun design leader.
        </Text>
      </Row>
      <Row class="mt-[16px]">
        <Column align="left" class="w-1/2 pr-[8px]" :colspan="1">
          <Img
            alt="Braun Wall Clock"
            class="w-full rounded-[8px] object-cover"
            :height="250"
            src="/static/braun-wall-clock.jpg"
          />
          <Text
            class="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]"
          >
            Wall Clock
          </Text>
          <Text class="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
            Easy to read dial layout.
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
        </Column>
        <Column align="left" class="w-1/2 pl-[8px]" :colspan="1">
          <Img
            alt="Braun Wireless Alarm"
            class="w-full rounded-[8px] object-cover"
            :height="250"
            src="/static/braun-wireless-alarm.jpg"
          />
          <Text
            class="m-0 mt-[24px] font-semibold text-[20px] text-gray-900 leading-[28px]"
          >
            Wireless Alarm
          </Text>
          <Text class="m-0 mt-[16px] text-[16px] text-gray-500 leading-[24px]">
            Designed with a focus on function.
          </Text>
          <Text
            class="m-0 mt-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]"
          >
            $50.00
          </Text>
          <Button
            class="mt-[16px] rounded-[8px] bg-indigo-600 px-[24px] py-[12px] font-semibold text-white"
            href="https://vuemail.dev"
          >Buy</Button>
        </Column>
      </Row>
    </Section>
    <Hr class="mx-0 my-[24px] w-full border border-gray-200 border-solid" />
    <Section>
      <Row>
        <Column align="left" class="w-1/2 pr-[8px]" :colspan="1">
          <Img
            alt="Braun Classic Watch"
            class="w-full rounded-[8px] object-cover"
            :height="250"
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
        </Column>
        <Column align="left" class="w-1/2 pl-[8px]" :colspan="1">
          <Img
            alt="Braun Analogue Clock"
            class="w-full rounded-[8px] object-cover"
            :height="250"
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
        </Column>
      </Row>
    </Section>
  </Section>
</template>
