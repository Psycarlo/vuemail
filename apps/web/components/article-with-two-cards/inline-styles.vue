<script setup lang="ts">
import { Column, Img, Row, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Row>
      <Text
        :style="{
          margin: '0px',
          fontSize: '20px',
          lineHeight: '28px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }"
      >
        Elevate Outdoor Living
      </Text>
      <Text
        :style="{
          marginTop: '8px',
          fontSize: '16px',
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }"
      >
        Take your outdoor space to new heights with our premium outdoor
        furniture, designed to elevate your alfresco experience.
      </Text>
    </Row>
    <Row :style="{ marginTop: '16px' }">
      <Column
        :colspan="1"
        :style="{
          width: '50%',
          verticalAlign: 'baseline',
          paddingRight: '8px',
          boxSizing: 'border-box',
        }"
      >
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          height="180"
          src="/static/outdoor-living.jpg"
          :style="{ width: '100%', borderRadius: '8px', objectFit: 'cover' }"
        />
        <Text
          :style="{
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
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Multifunctional Marvels
        </Text>
        <Text
          :style="{
            marginBottom: '0px',
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Discover the innovative world of multifunctional furniture, where
          style meets practicality, offering creative solutions for maximizing
          space and enhancing functionality in your home
        </Text>
      </Column>
      <Column
        :colspan="1"
        :style="{
          width: '50%',
          verticalAlign: 'baseline',
          paddingLeft: '8px',
          boxSizing: 'border-box',
        }"
      >
        <Img
          alt="A picture of a pink background with varios items laid out. Shoes, lipstick, sunglasses, some leafs and part of a purse."
          height="180"
          src="/static/outdoor-living.jpg"
          :style="{ width: '100%', borderRadius: '8px', objectFit: 'cover' }"
        />
        <Text
          :style="{
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
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Timeless Classics
        </Text>
        <Text
          :style="{
            marginBottom: '0px',
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Step into the world of timeless classics as we explore iconic
          furniture pieces that have stood the test of time, adding enduring
          elegance and sophistication to any interior
        </Text>
      </Column>
    </Row>
  </Section>
</template>
