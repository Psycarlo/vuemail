<script setup lang="ts">
import { Column, Img, Link, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section>
    <Row>
      <Column :colspan="4">
        <Img
          alt="Vuemail logo"
          height="42"
          src="/static/logo-without-background.png"
        />
        <Text
          :style="{
            marginTop: '8px',
            marginBottom: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Acme corporation
        </Text>
        <Text
          :style="{
            marginTop: '4px',
            marginBottom: '0px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Think different
        </Text>
      </Column>
      <Column
        align="left"
        :style="{ display: 'table-cell', verticalAlign: 'bottom' }"
      >
        <Row
          :style="{
            display: 'table-cell',
            height: '44px',
            width: '56px',
            verticalAlign: 'bottom',
          }"
        >
          <Column :style="{ paddingRight: '8px' }">
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column :style="{ paddingRight: '8px' }">
            <Link href="#">
              <Img alt="X" height="36" src="/static/x-logo.png" width="36" />
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
        <Row>
          <Text
            :style="{
              marginTop: '8px',
              marginBottom: '8px',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 600,
              color: 'rgb(107,114,128)',
            }"
          >
            123 Main Street Anytown, CA 12345
          </Text>
          <Text
            :style="{
              marginTop: '4px',
              marginBottom: '0px',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 600,
              color: 'rgb(107,114,128)',
            }"
          >
            mail@example.com +123456789
          </Text>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
