<script setup lang="ts">
import { Button, Column, Heading, Img, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section
    :style="{ paddingTop: '16px', paddingBottom: '16px', textAlign: 'center' }"
  >
    <Heading
      as="h1"
      :style="{
        fontSize: '30px',
        lineHeight: '36px',
        marginBottom: '0px',
        fontWeight: 600,
      }"
    >
      You left something in your cart
    </Heading>
    <Section
      :style="{
        padding: '16px',
        paddingTop: '0px',
        marginTop: '16px',
        marginBottom: '16px',
        borderRadius: '8px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgb(229,231,235)',
      }"
    >
      <table :style="{ marginBottom: '16px' }" width="100%">
        <tbody>
          <tr>
            <th
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              &nbsp;
            </th>
            <th
              align="left"
              :colspan="6"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                color: 'rgb(107,114,128)',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text :style="{ fontWeight: 600 }">Product</Text>
            </th>
            <th
              align="center"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                color: 'rgb(107,114,128)',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text :style="{ fontWeight: 600 }">Quantity</Text>
            </th>
            <th
              align="center"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                color: 'rgb(107,114,128)',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text :style="{ fontWeight: 600 }">Price</Text>
            </th>
          </tr>
          <tr>
            <td
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Img
                alt="Braun Classic Watch"
                :height="110"
                src="/static/braun-classic-watch.jpg"
                :style="{ objectFit: 'cover', borderRadius: '8px' }"
              />
            </td>
            <td
              align="left"
              :colspan="6"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text>Classic Watch</Text>
            </td>
            <td
              align="center"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text>1</Text>
            </td>
            <td
              align="center"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text>$210.00</Text>
            </td>
          </tr>
          <tr>
            <td
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Img
                alt="Braun Analogue Clock"
                :height="110"
                src="/static/braun-analogue-clock.jpg"
                :style="{ objectFit: 'cover', borderRadius: '8px' }"
              />
            </td>
            <td
              align="left"
              :colspan="6"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text>Analogue Clock</Text>
            </td>
            <td
              align="center"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text>1</Text>
            </td>
            <td
              align="center"
              :style="{
                paddingTop: '8px',
                paddingBottom: '8px',
                borderWidth: '0px',
                borderBottomWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgb(229,231,235)',
              }"
            >
              <Text>$40.00</Text>
            </td>
          </tr>
        </tbody>
      </table>
      <Row>
        <Column align="center">
          <Button
            href="https://vuemail.dev"
            :style="{
              width: '100%',
              boxSizing: 'border-box',
              paddingLeft: '12px',
              paddingRight: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: 'rgb(79,70,229)',
              paddingTop: '12px',
              paddingBottom: '12px',
              fontWeight: 600,
              color: 'rgb(255,255,255)',
            }"
          >Checkout</Button>
        </Column>
      </Row>
    </Section>
  </Section>
</template>
