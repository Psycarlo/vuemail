<script setup lang="ts">
import { Button, Heading, Img, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Img
      alt="Herman Miller Chair"
      height="320"
      src="/static/herman-miller-chair.jpg"
      :style="{ width: '100%', borderRadius: '12px', objectFit: 'cover' }"
    />
    <Section :style="{ marginTop: '32px', textAlign: 'center' }">
      <Text
        :style="{
          marginTop: '16px',
          marginBottom: '16px',
          fontSize: '18px',
          lineHeight: '28px',
          fontWeight: 600,
          color: 'rgb(79,70,229)',
        }"
      >
        Our new article
      </Text>
      <Heading
        as="h1"
        :style="{
          margin: '0px',
          marginTop: '8px',
          fontSize: '36px',
          lineHeight: '36px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }"
      >
        Designing with Furniture
      </Heading>
      <Text
        :style="{
          fontSize: '16px',
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }"
      >
        Unleash your inner designer as we explore how furniture plays a vital
        role in creating stunning interiors, offering insights into choosing the
        right pieces, arranging them harmoniously, and infusing your space with
        personality.
      </Text>
      <Button
        href="https://vuemail.dev"
        :style="{
          marginTop: '16px',
          borderRadius: '8px',
          backgroundColor: 'rgb(79,70,229)',
          paddingLeft: '40px',
          paddingRight: '40px',
          paddingTop: '12px',
          paddingBottom: '12px',
          fontWeight: 600,
          color: 'rgb(255,255,255)',
        }"
      >Read more</Button>
    </Section>
  </Section>
</template>
