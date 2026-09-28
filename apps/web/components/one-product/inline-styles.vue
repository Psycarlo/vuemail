<script setup lang="ts">
import { Button, Heading, Img, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Img
      alt="Braun Collection"
      :height="320"
      src="/static/braun-collection.jpg"
      :style="{ width: '100%', borderRadius: '12px', objectFit: 'cover' }"
    />
    <Section :style="{ marginTop: '32px', textAlign: 'center' }">
      <Text
        :style="{
          marginTop: '16px',
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: 600,
          color: 'rgb(79,70,229)',
        }"
      >
        Classic Watches
      </Text>
      <Heading
        as="h1"
        :style="{
          fontSize: '36px',
          lineHeight: '40px',
          fontWeight: 600,
          letterSpacing: '0.4px',
          color: 'rgb(17,24,39)',
        }"
      >
        Elegant Comfort
      </Heading>
      <Text
        :style="{
          marginTop: '8px',
          fontSize: '16px',
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }"
      >
        Dieter Rams’ work has an outstanding quality which distinguishes it from
        the vast majority of industrial design of the entire 20th Century.
      </Text>
      <Text
        :style="{
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }"
      >
        $210.00
      </Text>
      <Button
        href="https://vuemail.dev"
        :style="{
          marginTop: '16px',
          borderRadius: '8px',
          backgroundColor: 'rgb(79,70,229)',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '12px',
          paddingBottom: '12px',
          fontWeight: 600,
          color: 'rgb(255,255,255)',
        }"
      >Buy now</Button>
    </Section>
  </Section>
</template>
