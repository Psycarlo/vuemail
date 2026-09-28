<script setup lang="ts">
import { Column, Img, Link, Row, Section } from '@vuemaildev/vuemail';
</script>

<template>
  <Section
    :style="{
      paddingTop: '40px',
      paddingBottom: '40px',
      paddingLeft: '32px',
      paddingRight: '32px',
    }"
  >
    <Row>
      <Column :style="{ width: '80%' }">
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
                height="36"
                src="/static/x-logo.png"
                :style="{ marginLeft: '4px', marginRight: '4px' }"
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
                :style="{ marginLeft: '4px', marginRight: '4px' }"
                width="36"
              />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="/static/facebook-logo.png"
                :style="{ marginLeft: '4px', marginRight: '4px' }"
                width="36"
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
