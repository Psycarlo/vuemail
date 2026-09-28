<script setup lang="ts">
import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from '@vuemaildev/vuemail';
</script>

<template>
  <Section
    :style="{ textAlign: 'center', paddingTop: '16px', paddingBottom: '16px' }"
  >
    <Text
      :style="{
        marginTop: '8px',
        marginBottom: '8px',
        fontSize: '18px',
        lineHeight: '28px',
        fontWeight: 600,
        color: 'rgb(79,70,229)',
      }"
    >
      Your opinion matters
    </Text>
    <Heading
      as="h1"
      :style="{
        margin: '0px',
        marginTop: '8px',
        fontSize: '30px',
        lineHeight: '36px',
        fontWeight: 600,
        color: 'rgb(17,24,39)',
      }"
    >
      We want to hear you
    </Heading>
    <Text
      :style="{ fontSize: '16px', lineHeight: '24px', color: 'rgb(55,65,81)' }"
    >
      How would you rate your experience using our product in a scale from 1 to
      5?
    </Text>
    <Row>
      <Column align="center">
        <table>
          <tbody>
            <tr>
              <td
                v-for="number in 5"
                :key="number"
                align="center"
                :style="{ padding: '4px' }"
              >
                <!-- Replace with the proper URL that saves the selected number -->
                <Button
                  href="https://vuemail.dev"
                  :style="{
                    height: '20px',
                    width: '20px',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgb(79,70,229)',
                    padding: '8px',
                    fontWeight: 600,
                    color: 'rgb(79,70,229)',
                  }"
                >{{ number }}</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </Column>
    </Row>
  </Section>
</template>
