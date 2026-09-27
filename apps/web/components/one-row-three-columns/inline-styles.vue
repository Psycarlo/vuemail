<script setup lang="ts">
import { Column, Row } from 'vuemail';
</script>

<template>
  <Row>
    <Column
      align="center"
      :style="{
        width: '33.333333%',
        height: '40px',
        backgroundColor: 'rgb(251,146,60,0.6)',
      }"
    >
      1/3
    </Column>
    <Column
      align="center"
      :style="{
        width: '33.333333%',
        height: '40px',
        backgroundColor: 'rgb(52,211,153,0.6)',
      }"
    >
      1/3
    </Column>
    <Column
      align="center"
      :style="{
        width: '33.333333%',
        height: '40px',
        backgroundColor: 'rgb(34,211,238,0.6)',
      }"
    >
      1/3
    </Column>
  </Row>
</template>
