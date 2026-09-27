<script setup lang="ts">
import { Column, Img, Link, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Section>
      <Row>
        <Text
          :style="{
            margin: '0px',
            fontSize: '16px',
            lineHeight: '24px',
            fontWeight: 600,
            color: 'rgb(79,70,229)',
          }"
        >
          Collections
        </Text>
        <Text
          :style="{
            margin: '0px',
            marginTop: '8px',
            fontSize: '24px',
            lineHeight: '32px',
            fontWeight: 600,
            color: 'rgb(17,24,39)',
          }"
        >
          Bundle & Save
        </Text>
        <Text
          :style="{
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Award-winning grinders and burrs for brewing like a barista at home.
        </Text>
      </Row>
    </Section>
    <Section :style="{ marginTop: '16px' }">
      <Row :style="{ marginTop: '16px' }">
        <Column :style="{ width: '50%', paddingRight: '8px' }">
          <Row :style="{ paddingBottom: '8px' }">
            <td>
              <Link href="#">
                <Img
                  alt="Grinder Collection"
                  :height="152"
                  src="/static/grinder-collection.jpg"
                  :style="{
                    width: '100%',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }"
                />
              </Link>
            </td>
          </Row>
          <Row :style="{ paddingTop: '8px' }">
            <td>
              <Link href="#">
                <Img
                  alt="Bundle Collection"
                  :height="152"
                  src="/static/bundle-collection.jpg"
                  :style="{
                    width: '100%',
                    borderRadius: '12px',
                    objectFit: 'cover',
                  }"
                />
              </Link>
            </td>
          </Row>
        </Column>
        <Column
          :style="{
            width: '50%',
            paddingLeft: '8px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }"
        >
          <Link href="#">
            <Img
              alt="Clara French Press"
              :height="152 + 152 + 8 + 8"
              src="/static/clara-french-press.jpg"
              :style="{
                width: '100%',
                borderRadius: '12px',
                objectFit: 'cover',
              }"
            />
          </Link>
        </Column>
      </Row>
    </Section>
  </Section>
</template>
