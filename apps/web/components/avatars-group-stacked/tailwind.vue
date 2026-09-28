<script setup lang="ts">
import { Column, Img, Row } from '@vuemaildev/vuemail';
</script>

<template>
  <Row :width="undefined" class="border-collapse border-spacing-0">
    <Column
      width="44"
      height="44"
      class="h-[44px] w-[44px] p-0 text-center align-middle leading-[0px]"
    >
      <div
        class="box-border h-full w-full overflow-hidden rounded-[100%] border-4 border-solid border-white bg-gray-950"
      >
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          class="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
    <Column
      width="44"
      height="44"
      class="relative left-[-12px] h-[44px] w-[44px] p-0 text-center align-middle leading-[0px]"
    >
      <div
        class="box-border h-full w-full overflow-hidden rounded-[100%] border-4 border-solid border-white bg-gray-950"
      >
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          class="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
    <Column
      width="44"
      height="44"
      class="relative left-[-24px] h-[44px] w-[44px] p-0 text-center align-middle leading-[0px]"
    >
      <div
        class="box-border h-full w-full overflow-hidden rounded-[100%] border-4 border-solid border-white bg-gray-950"
      >
        <Img
          src="https://github.com/bukinoshita.png?size=100"
          alt="Bu Kinoshita"
          width="40"
          height="40"
          class="inline-block h-full w-full object-cover object-center"
        />
      </div>
    </Column>
  </Row>
</template>
