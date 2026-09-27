<script setup lang="ts">
import { Column, Hr, Img, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <Section>
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
    <Section>
      <Hr class="!border-gray-300 mx-0 my-[32px] w-full border border-solid" />
      <Section>
        <Row>
          <Column class="align-baseline">
            <Img
              alt="heart icon"
              height="48"
              src="/static/heart-icon.png"
              width="48"
            />
          </Column>
          <Column class="w-[85%]">
            <Text
              class="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]"
            >
              Versatile Comfort
            </Text>
            <Text class="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              Experience ultimate comfort and versatility with our furniture
              collection, designed to adapt to your ever-changing needs.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr class="!border-gray-300 mx-0 my-[32px] w-full border border-solid" />
      <Section>
        <Row>
          <Column class="align-baseline">
            <Img
              alt="rocket icon"
              height="48"
              src="/static/rocket-icon.png"
              width="48"
            />
          </Column>
          <Column class="w-[85%]">
            <Text
              class="m-0 font-semibold text-[20px] text-gray-900 leading-[28px]"
            >
              Luxurious Retreat
            </Text>
            <Text class="m-0 mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              Transform your space into a haven of relaxation with our indulgent
              furniture collection.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr class="!border-gray-300 mx-0 my-[32px] w-full border border-solid" />
    </Section>
  </Section>
</template>
