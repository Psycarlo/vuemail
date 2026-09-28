<script setup lang="ts">
import { Button, Img, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <table :style="{ width: '100%' }">
      <tbody :style="{ width: '100%' }">
        <tr :style="{ width: '100%' }">
          <td
            :style="{
              width: '50%',
              paddingRight: '32px',
              boxSizing: 'border-box',
            }"
          >
            <Img
              alt="Braun Vintage"
              :height="220"
              src="/static/braun-vintage.jpg"
              :style="{
                borderRadius: '8px',
                width: '100%',
                objectFit: 'cover',
              }"
            />
          </td>
          <td :style="{ width: '50%', verticalAlign: 'baseline' }">
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
              Great Timepiece
            </Text>
            <Text
              :style="{
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Renowned for their minimalist design and high functionality,
              celebrating the principles of simplicity and clarity.
            </Text>
            <Text
              :style="{
                marginTop: '8px',
                fontSize: '18px',
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }"
            >
              $120.00
            </Text>
            <Button
              href="https://vuemail.dev"
              :style="{
                width: '75%',
                borderRadius: '8px',
                backgroundColor: 'rgb(79,70,229)',
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '16px',
                paddingRight: '16px',
                textAlign: 'center',
                fontWeight: 600,
                color: 'rgb(255,255,255)',
              }"
            >Buy</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>
