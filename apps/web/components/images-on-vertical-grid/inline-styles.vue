<script setup lang="ts">
import { Column, Img, Link, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Section>
      <Row>
        <Text
          :style="{
            margin: '0px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(79,70,229)',
          }"
        >
          Drinkware
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '8px',
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Ceramic Mugs
        </Text>
        <Text
          :style="{
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Picasso your pour with a sleek ceramic cup designed for beautiful
          espresso drinks. Engineered for the outdoors and designed to enhance
          the taste of your libation of choice.
        </Text>
      </Row>
    </Section>
    <Section :style="{ marginTop: '16px' }">
      <Link href="#">
        <Img
          alt="Mugs Collection"
          :height="288"
          src="/static/mugs-collection.jpg"
          :style="{ borderRadius: '12px', objectFit: 'cover' }"
          width="100%"
        />
      </Link>
      <Row :style="{ marginTop: '16px' }">
        <Column :style="{ width: '50%', paddingRight: '8px' }">
          <Link href="#">
            <Img
              alt="Monty Art Cup - 1"
              :height="288"
              src="/static/monty-art-cup-1.jpg"
              :style="{ borderRadius: '12px', objectFit: 'cover' }"
              width="100%"
            />
          </Link>
        </Column>
        <Column :style="{ width: '50%', paddingLeft: '8px' }">
          <Link href="#">
            <Img
              alt="Monty Art Cup - 2"
              :height="288"
              src="/static/monty-art-cup-2.jpg"
              :style="{ borderRadius: '12px', objectFit: 'cover' }"
              width="100%"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
</template>
