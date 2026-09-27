<script setup lang="ts">
import { Img, Section } from 'vuemail';

const responsiveRow = { textAlign: 'center', fontSize: '0' } as const;

const responsiveColumn = {
  maxWidth: '300px',
  display: 'inline-block',
  verticalAlign: 'top',
  fontSize: '16px',
  boxSizing: 'border-box',
} as const;
</script>

<template>
  <Section
    class="mx-[12px] my-[16px] text-[14px] text-gray-600"
    :style="responsiveRow"
  >
    <Section
      class="mt-0 mr-[24px] mb-[24px] ml-0 w-64 overflow-hidden rounded-3xl"
      :style="responsiveColumn"
    >
      <Img
        src="/static/steve-jobs.jpg"
        :width="320"
        :height="320"
        alt="Steve Jobs"
        class="h-[320px] w-full object-cover object-center"
      />
    </Section>
    <Section class="pr-[24px]" :style="responsiveColumn">
      <p
        class="mx-0 my-0 mb-[24px] text-left text-[16px] leading-[1.625] font-light text-gray-700"
      >
        Design is not just what it looks like and feels like. Design is how it
        works. The people who are crazy enough to think they can change the
        world are the ones who do. Innovation distinguishes between a leader and
        a follower.
      </p>
      <p
        class="mx-0 mt-0 mb-[4px] text-left text-[16px] font-semibold text-gray-800"
      >
        Steve Jobs
      </p>
      <p class="m-0 text-left text-[14px] text-gray-600">Co-founder of Apple</p>
    </Section>
  </Section>
</template>
