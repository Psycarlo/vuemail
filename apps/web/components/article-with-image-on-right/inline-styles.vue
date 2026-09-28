<script setup lang="ts">
import { Img, Link, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section
    :style="{ marginTop: '16px', textAlign: 'center', marginBottom: '16px' }"
  >
    <Section
      :style="{
        display: 'inline-block',
        textAlign: 'left',
        width: '100%',
        maxWidth: '250px',
        verticalAlign: 'top',
      }"
    >
      <Text
        :style="{
          margin: '0px',
          fontSize: '16px',
          lineHeight: '24px',
          fontWeight: 600,
          color: 'rgb(79,70,229)',
        }"
      >
        What's new
      </Text>
      <Text
        :style="{
          margin: '0px',
          marginTop: '8px',
          fontSize: '20px',
          lineHeight: '28px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }"
      >
        Versatile Comfort
      </Text>
      <Text
        :style="{
          marginTop: '8px',
          fontSize: '16px',
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }"
      >
        Experience ultimate comfort and versatility with our furniture
        collection, designed to adapt to your ever-changing needs.
      </Text>
      <Link
        href="https://vuemail.dev"
        :style="{ color: 'rgb(79,70,229)', textDecorationLine: 'underline' }"
      >Read more</Link>
    </Section>
    <Section
      :style="{
        display: 'inline-block',
        marginTop: '8px',
        marginBottom: '8px',
        width: '100%',
        maxWidth: '220px',
        verticalAlign: 'top',
      }"
    >
      <Img
        alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
        :height="220"
        src="/static/versatile-comfort.jpg"
        :style="{ borderRadius: '8px', objectFit: 'cover' }"
        :width="220"
      />
    </Section>
  </Section>
</template>
