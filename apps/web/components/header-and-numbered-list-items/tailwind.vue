<script setup lang="ts">
import { Column, Hr, Row, Section, Text } from 'vuemail';

const features = [
  {
    title: 'Versatile Comfort',
    description:
      'Experience ultimate comfort and versatility with our furniture collection, designed to adapt to your ever-changing needs.',
  },
  {
    title: 'Luxurious Retreat',
    description:
      'Transform your space into a haven of relaxation with our indulgent furniture collection.',
  },
  {
    title: 'Unleash Creativity',
    description:
      'Unleash your inner designer with our customizable furniture options, allowing you to create a space that reflects your unique vision',
  },
  {
    title: 'Elevate Outdoor Living',
    description:
      'Take your outdoor space to new heights with our premium outdoor furniture, designed to elevate your alfresco experience.',
  },
];
</script>

<template>
  <Section class="my-[16px]">
    <Section class="pb-[24px]">
      <Row>
        <Text
          class="m-0 font-semibold text-[24px] text-gray-900 leading-[32px]"
        >
          Functional Style
        </Text>
        <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space.
        </Text>
      </Row>
    </Section>
    <template v-for="(feature, index) in features" :key="feature.title">
      <Hr class="!border-gray-300 m-0 w-full border border-solid" />
      <Section class="py-[24px]">
        <Row>
          <Column
            width="48"
            height="40"
            class="w-[40px] h-[40px] pr-[8px]"
            valign="baseline"
          >
            <Row width="40" align="left">
              <Column
                align="center"
                valign="middle"
                width="40"
                height="40"
                class="h-[40px] font-semibold w-[40px] rounded-full bg-indigo-200 text-indigo-600 p-0"
              >
                {{ index + 1 }}
              </Column>
            </Row>
          </Column>
          <Column width="100%" class="w-full">
            <Text
              class="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]"
            >
              {{ feature.title }}
            </Text>
            <Text class="m-0 pt-[8px] text-[16px] text-gray-500 leading-[24px]">
              {{ feature.description }}
            </Text>
          </Column>
        </Row>
      </Section>
    </template>
  </Section>
</template>
