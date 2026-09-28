<script setup lang="ts">
import { Column, Img, Link, Row, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <Section>
      <Row>
        <Text
          class="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]"
        >
          Our products
        </Text>
        <Text
          class="m-0 mt-[8px] font-semibold text-[24px] text-gray-900 leading-[32px]"
        >
          Elegant Style
        </Text>
        <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          We spent two years in development to bring you the next generation of
          our award-winning home brew grinder. From the finest pour-overs to the
          coarsest cold brews, your coffee will never be the same again.
        </Text>
      </Row>
    </Section>
    <Section>
      <Row>
        <Column class="w-1/3 pr-[8px]">
          <Link href="#">
            <Img
              alt="Stagg Electric Kettle"
              class="w-full rounded-[12px] object-cover"
              :height="186"
              src="/static/stagg-eletric-kettle.jpg"
            />
          </Link>
        </Column>
        <Column class="w-1/3 px-[8px]">
          <Link href="#">
            <Img
              alt="Ode Grinder"
              class="w-full rounded-[12px] object-cover"
              :height="186"
              src="/static/ode-grinder.jpg"
            />
          </Link>
        </Column>
        <Column class="w-1/3 pl-[8px]">
          <Link href="#">
            <Img
              alt="Clyde Electric Kettle"
              class="w-full rounded-[12px] object-cover"
              :height="186"
              src="/static/clyde-electric-kettle.jpg"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
</template>
