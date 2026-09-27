<script setup lang="ts">
import { Column, Img, Link, Row, Section } from 'vuemail';
</script>

<template>
  <Section class="px-[32px] py-[40px]">
    <Row>
      <Column class="w-[80%]">
        <Img
          alt="Vuemail logo"
          width="42"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column>
            <Link href="#">
              <Img
                alt="X"
                class="mx-[4px]"
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
                class="mx-[4px]"
                height="36"
                src="/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Facebook"
                class="mx-[4px]"
                height="36"
                src="/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
