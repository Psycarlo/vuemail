<script setup lang="ts">
import { Button, Img, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="my-[16px]">
    <table class="w-full">
      <tbody class="w-full">
        <tr class="w-full">
          <td class="box-border w-1/2 pr-[32px]">
            <Img
              alt="Braun Vintage"
              class="w-full rounded-[8px] object-cover"
              :height="220"
              src="/static/braun-vintage.jpg"
            />
          </td>
          <td class="w-1/2 align-baseline">
            <Text
              class="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]"
            >
              Great Timepiece
            </Text>
            <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              Renowned for their minimalist design and high functionality,
              celebrating the principles of simplicity and clarity.
            </Text>
            <Text
              class="mt-[8px] font-semibold text-[18px] text-gray-900 leading-[28px]"
            >
              $120.00
            </Text>
            <Button
              class="w-3/4 rounded-[8px] bg-indigo-600 px-[16px] py-[12px] text-center font-semibold text-white"
              href="https://vuemail.dev"
            >Buy</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>
