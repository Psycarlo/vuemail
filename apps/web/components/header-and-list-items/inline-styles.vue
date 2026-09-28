<script setup lang="ts">
import { Column, Hr, Img, Row, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section :style="{ marginTop: '16px', marginBottom: '16px' }">
    <Section>
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
          Functional Style
        </Text>
        <Text
          :style="{
            marginTop: '8px',
            fontSize: '16px',
            lineHeight: '24px',
            color: 'rgb(107,114,128)',
          }"
        >
          Combine practicality and style effortlessly with our furniture,
          offering functional designs that enhance your living space.
        </Text>
      </Row>
    </Section>
    <Section>
      <Hr
        :style="{
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: '32px',
          marginBottom: '32px',
          width: '100%',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgb(209,213,219) !important',
        }"
      />
      <Section>
        <Row>
          <Column :style="{ verticalAlign: 'baseline' }">
            <Img
              alt="heart icon"
              height="48"
              src="/static/heart-icon.png"
              width="48"
            />
          </Column>
          <Column :style="{ width: '85%' }">
            <Text
              :style="{
                margin: '0px',
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '28px',
                color: 'rgb(17,24,39)',
              }"
            >
              Versatile Comfort
            </Text>
            <Text
              :style="{
                margin: '0px',
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Experience ultimate comfort and versatility with our furniture
              collection, designed to adapt to your ever-changing needs.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr
        :style="{
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: '32px',
          marginBottom: '32px',
          width: '100%',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgb(209,213,219) !important',
        }"
      />
      <Section>
        <Row>
          <Column :style="{ verticalAlign: 'baseline' }">
            <Img
              alt="rocket icon"
              height="48"
              src="/static/rocket-icon.png"
              width="48"
            />
          </Column>
          <Column :style="{ width: '85%' }">
            <Text
              :style="{
                margin: '0px',
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: '28px',
                color: 'rgb(17,24,39)',
              }"
            >
              Luxurious Retreat
            </Text>
            <Text
              :style="{
                margin: '0px',
                marginTop: '8px',
                fontSize: '16px',
                lineHeight: '24px',
                color: 'rgb(107,114,128)',
              }"
            >
              Transform your space into a haven of relaxation with our indulgent
              furniture collection.
            </Text>
          </Column>
        </Row>
      </Section>
      <Hr
        :style="{
          marginLeft: '0px',
          marginRight: '0px',
          marginTop: '32px',
          marginBottom: '32px',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgb(209,213,219) !important',
        }"
      />
    </Section>
  </Section>
</template>
