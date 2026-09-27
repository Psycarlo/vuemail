<script setup lang="ts">
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from 'vuemail';
</script>

<template>
  <Html>
    <Head />
    <Body>
      <Preview>
        How satisfied were you overall with the initial conversation about your
        claim?
      </Preview>
      <Container
        class="mx-auto max-w-[600px] rounded-[8px] bg-white px-[42px] py-[24px]"
      >
        <Heading class="mb-[16px] text-[24px] leading-[32px]">
          How satisfied were you overall with the initial conversation about
          your claim?
        </Heading>
        <Text class="mb-[42px] text-gray-500 text-[14px] leading-[24px]">
          Your feedback is important to us and it will be used to better serve
          our customers.
        </Text>
        <Section class="max-w-[300px]">
          <Row>
            <Column class="w-[100px] text-center">
              <Text
                class="ml-[12px] text-left text-[rgb(68,68,68)] text-[12px] leading-none"
              >
                Dissatisfied
              </Text>
            </Column>
            <Column class="w-[100px] text-center">
              <Text
                class="mr-[12px] text-right text-[rgb(68,68,68)] text-[12px] leading-none"
              >
                Satisfied
              </Text>
            </Column>
          </Row>
        </Section>
        <Section class="mt-[12px] mb-[24px]" align="center">
          <Row :width="undefined">
            <Column
              v-for="rating in 5"
              :key="rating"
              width="51"
              height="43"
              class="w-[51px] h-[43px] px-[4px]"
              align="center"
              valign="middle"
            >
              <Button
                :href="`?rating=${rating}`"
                class="box-border w-[43px] h-[43px] rounded-[6px] bg-indigo-600 p-[12px] m-0 text-center font-semibold text-[16px] text-white leading-none"
              >{{ rating }}</Button>
            </Column>
          </Row>
        </Section>
        <Section>
          <Hr />
          <Text
            class="mt-[30px] text-center font-medium text-gray-500 text-[12px] leading-[16px]"
          >
            Customer Experience Research Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
