<script setup lang="ts">
import { Button, Heading, Text } from '@vuemaildev/vuemail';

// Notes for future exploration on finding a way to do this inside of
// Desktop Outlook:
// - https://backgrounds.cm/
// - use VML https://learn.microsoft.com/en-us/windows/win32/vml/msdn-online-vml-fill-element

const tableStyle = {
  // This url must be in quotes for Yahoo
  backgroundImage: "url('/static/my-image.png')",
  backgroundSize: '100% 100%',
};
</script>

<template>
  <table
    align="center"
    :border="0"
    cellpadding="0"
    cellspacing="0"
    class="my-[16px] h-[424px] rounded-[12px] bg-blue-600"
    role="presentation"
    :style="tableStyle"
    width="100%"
  >
    <tbody>
      <tr>
        <td align="center" class="p-[40px] text-center">
          <Text class="m-0 font-semibold text-gray-200">New article</Text>
          <Heading as="h1" class="m-0 mt-[4px] font-bold text-white">
            Artful Accents
          </Heading>
          <Text class="m-0 mt-[8px] text-[16px] text-white leading-[24px]">
            Uncover the power of accent furniture in transforming your space
            with subtle touches of style, personality, and functionality, as we
            explore the art of curating captivating accents.
          </Text>
          <Button
            class="mt-[24px] rounded-[8px] border border-gray-200 border-solid bg-white px-[40px] py-[12px] font-semibold text-gray-900"
            href="https://vuemail.dev"
          >Read more</Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
