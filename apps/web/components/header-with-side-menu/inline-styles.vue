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
      marginTop: '40px',
      marginBottom: '40px',
    }"
  >
    <Row>
      <Column :style="{ width: '80%' }">
        <Img
          alt="Vuemail logo"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
      <Column align="right">
        <Row align="right">
          <Column :style="{ paddingLeft: '8px', paddingRight: '8px' }">
            <Link
              href="#"
              :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
            >About</Link>
          </Column>
          <Column :style="{ paddingLeft: '8px', paddingRight: '8px' }">
            <Link
              href="#"
              :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
            >Company</Link>
          </Column>
          <Column :style="{ paddingLeft: '8px', paddingRight: '8px' }">
            <Link
              href="#"
              :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
            >Blog</Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
