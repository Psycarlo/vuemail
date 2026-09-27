<script setup lang="ts">
import { Column, Img, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <Row>
      <Text class="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]">
        Modern Comfort
      </Text>
      <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Experience contemporary bliss with our sleek and cozy furniture
        collection, designed for optimal comfort and style
      </Text>
    </Row>
    <Row class="mt-[16px]">
      <Column align="center" class="w-1/3 pr-[12px] align-baseline">
        <Img
          alt="heart icon"
          height="48"
          src="/static/heart-icon.png"
          width="48"
        />
        <Text
          class="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[24px]"
        >
          Timeless Charm
        </Text>
        <Text class="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
          Classic designs that never go out of style. Experience enduring
          elegance
        </Text>
      </Column>
      <Column align="center" class="w-1/3 pl-[12px] align-baseline">
        <Img
          alt="rocket icon"
          height="48"
          src="/static/rocket-icon.png"
          width="48"
        />
        <Text
          class="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]"
        >
          Functional Beauty
        </Text>
        <Text class="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
          Seamlessly blending form and function. Furniture that enhances your
          everyday life.
        </Text>
      </Column>
      <Column align="center" class="w-1/3 pl-[12px] align-baseline">
        <Img
          alt="megaphone icon"
          height="48"
          src="/static/megaphone-icon.png"
          width="48"
        />
        <Text
          class="m-0 mt-[16px] font-semibold text-[20px] text-gray-900 leading-[28px]"
        >
          Endless Comfort
        </Text>
        <Text class="mt-[8px] mb-0 text-[16px] text-gray-500 leading-[24px]">
          Sink into pure relaxation. Discover furniture that embraces your
          well-being.
        </Text>
      </Column>
    </Row>
  </Section>
</template>
