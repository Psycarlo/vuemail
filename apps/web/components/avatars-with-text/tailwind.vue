<script setup lang="ts">
import { Column, Img, Link, Row } from '@vuemaildev/vuemail';
</script>

<template>
  <Row>
    <Column align="center">
      <Link href="https://github.com/zehfernandes">
        <Row class="w-auto table-fixed border-collapse border-spacing-0">
          <Column
            class="h-[44px] w-[44px] overflow-hidden rounded-full p-0 text-center align-middle leading-[0px]"
          >
            <Img
              src="https://github.com/zehfernandes.png?size=100"
              width="36"
              height="36"
              alt="Zeh Fernandes"
              class="h-full w-full object-cover object-center"
            />
          </Column>
          <Column
            class="pl-3 text-[14px] leading-[20px] font-medium text-gray-500"
          >
            <p class="m-0 text-gray-700">Zeh Fernandes</p>
            <p class="m-0 text-[12px] leading-[14px]">Founding Designer</p>
          </Column>
        </Row>
      </Link>
    </Column>
  </Row>
</template>
