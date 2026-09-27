<script setup lang="ts">
import { Img, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Row>
      <Text
        :style="{
          margin: '0px',
          fontSize: '24px',
          lineHeight: '32px',
          fontWeight: 600,
          color: 'rgb(17,24,39)',
        }"
      >
        Modern Comfort
      </Text>
      <Text
        :style="{
          marginTop: '8px',
          fontSize: '16px',
          lineHeight: '24px',
          color: 'rgb(107,114,128)',
        }"
      >
        Experience contemporary bliss with our sleek and cozy furniture
        collection, designed for optimal comfort and style
      </Text>
    </Row>
    <table width="100%">
      <tbody>
        <tr :style="{ width: '100%', marginTop: '16px' }">
          <td
            align="center"
            :style="{
              width: '50%',
              paddingRight: '12px',
              verticalAlign: 'baseline',
            }"
          >
            <Img
              alt="heart icon"
              height="48"
              src="/static/heart-icon.png"
              width="48"
            />
            <Text
              :style="{
                margin: '0px',
                marginTop: '16px',
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }"
            >
              Timeless Beauty
            </Text>
            <Text
              :style="{
                marginBottom: '0px',
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Indulge in the enduring beauty of our furniture pieces, crafted
              with exquisite attention to detail and timeless design
            </Text>
          </td>
          <td
            align="center"
            :style="{
              width: '50%',
              paddingRight: '12px',
              verticalAlign: 'baseline',
            }"
          >
            <Img
              alt="rocket icon"
              height="48"
              src="/static/rocket-icon.png"
              width="48"
            />
            <Text
              :style="{
                margin: '0px',
                marginTop: '16px',
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }"
            >
              Effortless Function
            </Text>
            <Text
              :style="{
                marginBottom: '0px',
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Discover furniture that seamlessly combines form and function,
              making everyday living a breeze with its practicality
            </Text>
          </td>
        </tr>
        <tr :style="{ width: '100%', marginTop: '16px' }">
          <td
            align="center"
            :style="{
              width: '50%',
              paddingRight: '12px',
              verticalAlign: 'baseline',
            }"
          >
            <Img
              alt="megaphone icon"
              height="48"
              src="/static/megaphone-icon.png"
              width="48"
            />
            <Text
              :style="{
                margin: '0px',
                marginTop: '16px',
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }"
            >
              Customize Your Space
            </Text>
            <Text
              :style="{
                marginBottom: '0px',
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Personalize your living environment with our customizable
              furniture options, allowing you to tailor your space to perfection
            </Text>
          </td>
          <td
            align="center"
            :style="{
              width: '50%',
              paddingRight: '12px',
              verticalAlign: 'baseline',
            }"
          >
            <Img
              alt="cube icon"
              height="48"
              src="/static/cube-icon.png"
              width="48"
            />
            <Text
              :style="{
                margin: '0px',
                marginTop: '16px',
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: 600,
                color: 'rgb(17,24,39)',
              }"
            >
              Outdoor Serenity
            </Text>
            <Text
              :style="{
                marginBottom: '0px',
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Create a tranquil outdoor retreat with our premium outdoor
              furniture, offering both durability and serene relaxation
            </Text>
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
</template>
