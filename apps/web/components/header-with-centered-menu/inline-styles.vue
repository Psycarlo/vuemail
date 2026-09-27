<script setup lang="ts">
import { Column, Img, Link, Row, Section } from 'vuemail';
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
      <Column align="center">
        <Img
          alt="Vuemail logo"
          height="42"
          src="/static/logo-without-background.png"
        />
      </Column>
    </Row>
    <Row :style="{ marginTop: '40px' }">
      <Column align="center">
        <table>
          <tbody>
            <tr>
              <td :style="{ paddingRight: '8px', paddingLeft: '8px' }">
                <Link
                  href="#"
                  :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
                >About</Link>
              </td>
              <td :style="{ paddingRight: '8px', paddingLeft: '8px' }">
                <Link
                  href="#"
                  :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
                >Blog</Link>
              </td>
              <td :style="{ paddingRight: '8px', paddingLeft: '8px' }">
                <Link
                  href="#"
                  :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
                >Company</Link>
              </td>
              <td :style="{ paddingRight: '8px', paddingLeft: '8px' }">
                <Link
                  href="#"
                  :style="{ color: 'rgb(75,85,99)', textDecoration: 'none' }"
                >Features</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </Column>
    </Row>
  </Section>
</template>
