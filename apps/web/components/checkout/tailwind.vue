<script setup lang="ts">
import { Button, Column, Heading, Img, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="py-[16px] text-center">
    <Heading as="h1" class="mb-0 font-semibold text-[30px] leading-[36px]">
      You left something in your cart
    </Heading>
    <Section
      class="my-[16px] rounded-[8px] border border-gray-200 border-solid p-[16px] pt-0"
    >
      <table class="mb-[16px]" width="100%">
        <tbody>
          <tr>
            <th class="border-0 border-gray-200 border-b border-solid py-[8px]">
              &nbsp;
            </th>
            <th
              align="left"
              class="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
              :colspan="6"
            >
              <Text class="font-semibold">Product</Text>
            </th>
            <th
              align="center"
              class="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
            >
              <Text class="font-semibold">Quantity</Text>
            </th>
            <th
              align="center"
              class="border-0 border-gray-200 border-b border-solid py-[8px] text-gray-500"
            >
              <Text class="font-semibold">Price</Text>
            </th>
          </tr>
          <tr>
            <td class="border-0 border-gray-200 border-b border-solid py-[8px]">
              <Img
                alt="Braun Classic Watch"
                class="rounded-[8px] object-cover"
                :height="110"
                src="/static/braun-classic-watch.jpg"
              />
            </td>
            <td
              align="left"
              class="border-0 border-gray-200 border-b border-solid py-[8px]"
              :colspan="6"
            >
              <Text>Classic Watch</Text>
            </td>
            <td
              align="center"
              class="border-0 border-gray-200 border-b border-solid py-[8px]"
            >
              <Text>1</Text>
            </td>
            <td
              align="center"
              class="border-0 border-gray-200 border-b border-solid py-[8px]"
            >
              <Text>$210.00</Text>
            </td>
          </tr>
          <tr>
            <td class="border-0 border-gray-200 border-b border-solid py-[8px]">
              <Img
                alt="Braun Analogue Clock"
                class="rounded-[8px] object-cover"
                :height="110"
                src="/static/braun-analogue-clock.jpg"
              />
            </td>
            <td
              align="left"
              class="border-0 border-gray-200 border-b border-solid py-[8px]"
              :colspan="6"
            >
              <Text>Analogue Clock</Text>
            </td>
            <td
              align="center"
              class="border-0 border-gray-200 border-b border-solid py-[8px]"
            >
              <Text>1</Text>
            </td>
            <td
              align="center"
              class="border-0 border-gray-200 border-b border-solid py-[8px]"
            >
              <Text>$40.00</Text>
            </td>
          </tr>
        </tbody>
      </table>
      <Row>
        <Column align="center">
          <Button
            class="box-border w-full rounded-[8px] bg-indigo-600 px-[12px] py-[12px] text-center font-semibold text-white"
            href="https://vuemail.dev"
          >Checkout</Button>
        </Column>
      </Row>
    </Section>
  </Section>
</template>
