<script setup lang="ts">
import { Button, Img, Row, Section, Text } from '@vuemaildev/vuemail';
import ResponsiveColumn from '../_components/responsive-column.vue';
import ResponsiveRow from '../_components/responsive-row.vue';
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
        Timing Products
      </Text>
      <Text
        :style="{
          marginTop: '8px',
          fontSize: '16px',
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }"
      >
        Dieter Rams consistently implemented his design principles over the
        course of over three decades as the Braun design leader.
      </Text>
    </Row>
    <ResponsiveRow :style="{ marginTop: '16px' }">
      <ResponsiveColumn
        :style="{
          textAlign: 'left',
          paddingRight: '4px',
          paddingTop: '16px',
          paddingBottom: '16px',
        }"
      >
        <Img
          alt="Braun Analogue Clock"
          :height="180"
          src="/static/braun-analogue-clock.jpg"
          :style="{ width: '100%', borderRadius: '8px', objectFit: 'cover' }"
        />
        <Text
          :style="{
            margin: '0px',
            marginTop: '24px',
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Analogue Clock
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '16px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Thoughtful and simply designed.
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          $40.00
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
        >Buy</Button>
      </ResponsiveColumn>
      <ResponsiveColumn
        :style="{
          textAlign: 'left',
          paddingRight: '4px',
          paddingLeft: '4px',
          paddingTop: '16px',
          paddingBottom: '16px',
        }"
      >
        <Img
          alt="Braun Wall Clock"
          :height="180"
          src="/static/braun-wall-clock.jpg"
          :style="{ width: '100%', borderRadius: '8px', objectFit: 'cover' }"
        />
        <Text
          :style="{
            margin: '0px',
            marginTop: '24px',
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Wall Clock
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '16px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          The original easy to read dial layout.
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          $45.00
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
        >Buy</Button>
      </ResponsiveColumn>
      <ResponsiveColumn
        :style="{
          paddingTop: '16px',
          paddingBottom: '16px',
          paddingLeft: '4px',
          textAlign: 'left',
        }"
      >
        <Img
          alt="Braun Classic Watch"
          :height="180"
          src="/static/braun-classic-watch.jpg"
          :style="{ width: '100%', borderRadius: '8px', objectFit: 'cover' }"
        />
        <Text
          :style="{
            margin: '0px',
            marginTop: '24px',
            fontSize: '20px',
            lineHeight: '28px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Classic Watch
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '16px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Functional, classic, and built to last.
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '8px',
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
        >Buy</Button>
      </ResponsiveColumn>
    </ResponsiveRow>
  </Section>
</template>
