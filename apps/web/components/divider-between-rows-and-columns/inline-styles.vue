<script setup lang="ts">
import { Column, Hr, Row } from '@vuemaildev/vuemail';
</script>

<template>
  <Row>
    <Column>First column</Column>
    <Column>Second column</Column>
  </Row>
  <Hr
    :style="{
      marginTop: '16px',
      borderColor: 'rgb(209,213,219)',
      marginBottom: '16px',
    }"
  />
  <Row>
    <Column>First column</Column>
    <Column>Second column</Column>
  </Row>
</template>
