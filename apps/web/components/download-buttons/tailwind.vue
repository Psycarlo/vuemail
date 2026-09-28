<script setup lang="ts">
import { Button, Column, Img, Row, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Row>
    <Column align="center">
      <Row>
        <Text class="font-bold text-[18px] text-indigo-500 leading-[28px]">
          Try now
        </Text>
        <Text class="text-gray-900">
          The app all cheese enthusiasts have been waiting for
        </Text>
      </Row>
      <Row>
        <td align="center">
          <table>
            <tbody>
              <tr>
                <td class="pr-[16px]">
                  <Button href="https://vuemail.dev">
                    <Img
                      alt="Get it on Google Play button"
                      :width="182.5"
                      :height="54"
                      src="/static/get-it-on-google-play.png"
                    />
                  </Button>
                </td>
                <td class="pl-[16px]">
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
