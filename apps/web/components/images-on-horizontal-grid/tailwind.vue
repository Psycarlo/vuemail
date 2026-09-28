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
          Collections
        </Text>
        <Text
          class="m-0 mt-[8px] font-semibold text-[24px] text-gray-900 leading-[32px]"
        >
          Bundle & Save
        </Text>
        <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
          Award-winning grinders and burrs for brewing like a barista at home.
        </Text>
      </Row>
    </Section>
    <Section class="mt-[16px]">
      <Row class="mt-[16px]">
        <Column class="w-1/2 pr-[8px]">
          <Row class="pb-[8px]">
            <td>
              <Link href="#">
                <Img
                  alt="Grinder Collection"
                  class="w-full rounded-[12px] object-cover"
                  :height="152"
                  src="/static/grinder-collection.jpg"
                />
              </Link>
            </td>
          </Row>
          <Row class="pt-[8px]">
            <td>
              <Link href="#">
                <Img
                  alt="Bundle Collection"
                  class="w-full rounded-[12px] object-cover"
                  :height="152"
                  src="/static/bundle-collection.jpg"
                />
              </Link>
            </td>
          </Row>
        </Column>
        <Column class="w-1/2 py-[8px] pl-[8px]">
          <Link href="#">
            <Img
              alt="Clara French Press"
              class="w-full rounded-[12px] object-cover"
              :height="152 + 152 + 8 + 8"
              src="/static/clara-french-press.jpg"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
</template>
