<script setup lang="ts">
import { Button, Column, Img, Row, Text } from 'vuemail';
</script>

<template>
  <Row>
    <Column align="center">
      <Row>
        <Text
          :style="{
            color: 'rgb(99,102,241)',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '28px',
          }"
        >
          Try now
        </Text>
        <Text :style="{ color: 'rgb(17,24,39)' }">
          The app all cheese enthusiasts have been waiting for
        </Text>
      </Row>
      <Row>
        <td align="center">
          <table>
            <tbody>
              <tr>
                <td :style="{ paddingRight: '16px' }">
                  <Button href="https://vuemail.dev">
                    <Img
                      alt="Get it on Google Play button"
                      :width="182.5"
                      :height="54"
                      src="/static/get-it-on-google-play.png"
                    />
                  </Button>
                </td>
                <td :style="{ paddingLeft: '16px' }">
                  <Button href="https://vuemail.dev">
                    <Img
                      alt="Download on the App Store button"
                      :width="164"
                      :height="54"
                      src="/static/download-on-the-app-store.png"
                    />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </Row>
    </Column>
  </Row>
</template>
