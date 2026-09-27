<script setup lang="ts">
import { Button, Heading, Text } from 'vuemail';

// Notes for future exploration on finding a way to do this inside of
// Desktop Outlook:
// - https://backgrounds.cm/
// - use VML https://learn.microsoft.com/en-us/windows/win32/vml/msdn-online-vml-fill-element

const tableStyle = {
  height: '424px',
  marginTop: '16px',
  marginBottom: '16px',
  borderRadius: '12px',
  backgroundColor: 'rgb(37,99,235)',
  // This url must be in quotes for Yahoo
  backgroundImage: "url('/static/my-image.png')",
  backgroundSize: '100% 100%',
};
</script>

<template>
  <table
    align="center"
    :border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    :style="tableStyle"
    width="100%"
  >
    <tbody>
      <tr>
        <td align="center" :style="{ padding: '40px', textAlign: 'center' }">
          <Text
            :style="{
              margin: '0px',
              fontWeight: 600,
              color: 'rgb(229,231,235)',
            }"
          >
            New article
          </Text>
          <Heading
            as="h1"
            :style="{
              margin: '0px',
              marginTop: '4px',
              fontWeight: 700,
              color: 'rgb(255,255,255)',
            }"
          >
            Artful Accents
          </Heading>
          <Text
            :style="{
              margin: '0px',
              marginTop: '8px',
              fontSize: '16px',
              lineHeight: '24px',
              color: 'rgb(255,255,255)',
            }"
          >
            Uncover the power of accent furniture in transforming your space
            with subtle touches of style, personality, and functionality, as we
            explore the art of curating captivating accents.
          </Text>
          <Button
            href="https://vuemail.dev"
            :style="{
              marginTop: '24px',
              borderRadius: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgb(229,231,235)',
              backgroundColor: 'rgb(255,255,255)',
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontWeight: 600,
              color: 'rgb(17,24,39)',
            }"
          >Read more</Button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
