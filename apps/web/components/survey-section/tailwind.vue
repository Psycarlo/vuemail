<script setup lang="ts">
import { Button, Column, Heading, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="py-[16px] text-center">
    <Text
      class="my-[8px] font-semibold text-[18px] text-indigo-600 leading-[28px]"
    >
      Your opinion matters
    </Text>
    <Heading
      as="h1"
      class="m-0 mt-[8px] font-semibold text-[30px] text-gray-900 leading-[36px]"
    >
      We want to hear you
    </Heading>
    <Text class="text-[16px] text-gray-700 leading-[24px]">
      How would you rate your experience using our product in a scale from 1 to
      5?
    </Text>
    <Row>
      <Column align="center">
        <table>
          <tbody>
            <tr>
              <td
                v-for="number in 5"
                :key="number"
                align="center"
                class="p-[4px]"
              >
                <!-- Replace with the proper URL that saves the selected number -->
                <Button
                  class="h-[20px] w-[20px] rounded-[8px] border border-indigo-600 border-solid p-[8px] font-semibold text-indigo-600"
                  href="https://vuemail.dev"
                >{{ number }}</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Column>
    </Row>
  </Section>
</template>
