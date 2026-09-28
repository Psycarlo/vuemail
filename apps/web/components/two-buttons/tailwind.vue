<script setup lang="ts">
import { Button, Column, Row } from '@vuemaildev/vuemail';
</script>

<template>
  <Row>
    <Column align="center">
      <Row>
        <td align="center" class="w-1/2 pr-[16px]" :colspan="1">
          <Button
            class="box-border w-full rounded-[8px] bg-indigo-600 px-[20px] py-[12px] text-center font-semibold text-white"
            href="https://vuemail.dev"
          >Login</Button>
        </td>
        <td align="center" class="w-1/2 pl-[16px]" :colspan="1">
          <Button
            class="box-border w-full rounded-[8px] border border-gray-200 border-solid bg-white px-[20px] py-[12px] text-center font-semibold text-gray-900"
            href="https://vuemail.dev"
          >Sign up</Button>
        </td>
      </Row>
    </Column>
  </Row>
</template>
