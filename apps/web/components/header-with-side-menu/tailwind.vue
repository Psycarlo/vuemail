<script setup lang="ts">
import { Column, Img, Link, Row, Section } from '@vuemaildev/vuemail';
</script>

<template>
  <Section class="my-[40px] px-[32px] py-[40px]">
    <Row>
      <Column class="w-[80%]">
        <Img
          alt="Vuemail logo"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column class="px-[8px]">
            <Link
              class="text-gray-600 [text-decoration:none]"
              href="#"
            >About</Link>
          </Column>
          <Column class="px-[8px]">
            <Link
              class="text-gray-600 [text-decoration:none]"
              href="#"
            >Company</Link>
          </Column>
          <Column class="px-[8px]">
            <Link
              class="text-gray-600 [text-decoration:none]"
              href="#"
            >Blog</Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
