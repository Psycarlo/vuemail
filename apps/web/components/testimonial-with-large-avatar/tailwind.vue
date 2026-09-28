<script setup lang="ts">
import { Img } from 'vuemail';
import ResponsiveColumn from '../_components/responsive-column.vue';
import ResponsiveRow from '../_components/responsive-row.vue';
</script>

<template>
  <ResponsiveRow class="mx-[12px] my-[16px] text-[14px] text-gray-600">
    <ResponsiveColumn
      class="mt-0 mr-[24px] mb-[24px] ml-0 w-64 overflow-hidden rounded-3xl"
    >
      <Img
        src="/static/steve-jobs.jpg"
        :width="320"
        :height="320"
        alt="Steve Jobs"
        class="h-[320px] w-full object-cover object-center"
      />
    </ResponsiveColumn>
    <ResponsiveColumn class="pr-[24px]">
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
    </ResponsiveColumn>
  </ResponsiveRow>
</template>
