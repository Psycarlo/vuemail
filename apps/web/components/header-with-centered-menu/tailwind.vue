<script setup lang="ts">
import { Column, Img, Link, Row, Section } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="my-[40px] px-[32px] py-[40px]">
    <Row>
      <Column align="center">
        <Img
          alt="Vuemail logo"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
    </Row>
    <Row class="mt-[40px]">
      <Column align="center">
        <table>
          <tbody>
            <tr>
              <td class="px-[8px]">
                <Link
                  class="text-gray-600 [text-decoration:none]"
                  href="#"
                >About</Link>
              </td>
              <td class="px-[8px]">
                <Link
                  class="text-gray-600 [text-decoration:none]"
                  href="#"
                >Blog</Link>
              </td>
              <td class="px-[8px]">
                <Link
                  class="text-gray-600 [text-decoration:none]"
                  href="#"
                >Company</Link>
              </td>
              <td class="px-[8px]">
                <Link
                  class="text-gray-600 [text-decoration:none]"
                  href="#"
                >Features</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </Column>
    </Row>
  </Section>
</template>
