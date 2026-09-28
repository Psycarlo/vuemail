<script setup lang="ts">
import { Column, Img, Link, Row, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="text-center">
    <table class="w-full">
      <tbody>
        <tr class="w-full">
          <td align="center">
            <Img
              alt="Vuemail logo"
              height="42"
              src="/static/logo-without-background.png"
              width="42"
            />
          </td>
        </tr>
        <tr class="w-full">
          <td align="center">
            <Text
              class="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]"
            >
              Acme corporation
            </Text>
            <Text
              class="mt-[4px] mb-0 text-[16px] text-gray-500 leading-[24px]"
            >
              Think different
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Row class="table-cell h-[44px] w-[56px] align-bottom">
              <Column class="pr-[8px]">
                <Link href="#">
                  <Img
                    alt="Facebook"
                    height="36"
                    src="/static/facebook-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
              <Column class="pr-[8px]">
                <Link href="#">
                  <Img
                    alt="X"
                    height="36"
                    src="/static/x-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
              <Column>
                <Link href="#">
                  <Img
                    alt="Instagram"
                    height="36"
                    src="/static/instagram-logo.png"
                    width="36"
                  />
                </Link>
              </Column>
            </Row>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text
              class="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]"
            >
              123 Main Street Anytown, CA 12345
            </Text>
            <Text
              class="mt-[4px] mb-0 font-semibold text-[16px] text-gray-500 leading-[24px]"
            >
              mail@example.com +123456789
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>
