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
} from '@vuemaildev/vuemail';

const ratings = [
  { rating: 5, count: 1019 },
  { rating: 4, count: 162 },
  { rating: 3, count: 97 },
  { rating: 2, count: 199 },
  { rating: 1, count: 147 },
];
</script>

<template>
  <Html>
    <Head />
    <Body>
      <Preview>Customer Reviews</Preview>
      <Container
        class="mx-auto max-w-[400px] rounded-[8px] bg-white px-[42px] py-[24px]"
      >
        <Section>
          <Heading as="h1" class="text-[24px] leading-[32px]">
            Customer Reviews
          </Heading>
          <div class="mt-[12px] flex flex-col">
            <Text class="hidden">4 out of 5 stars</Text>
          </div>
          <Section class="my-[24px]">
            <Heading as="h2" class="hidden">Review data</Heading>
            <dl class="m-0">
              <Row
                v-for="{ count, rating } in ratings"
                :key="rating"
                class="text-[14px] leading-[20px]"
                align="center"
              >
                <Column align="center" valign="middle">
                  <Row>
                    <Column>
                      <dt>
                        <Row>
                          <Column :width="undefined">
                            <Text class="w-[12px] font-medium text-gray-500">
                              {{ rating }}<span class="hidden"> star reviews</span>
                            </Text>
                          </Column>
                          <Column
                            width="264"
                            height="12"
                            class="w-[264px] h-[12px] pl-[12px]"
                            aria-hidden="true"
                            valign="middle"
                          >
                            <Row
                              width="264"
                              class="w-[264px] h-[12px] bg-gray-100 border-gray-200 border border-solid rounded-[6px]"
                            >
                              <Column
                                height="12"
                                class="h-[12px] bg-indigo-600 rounded-[6px]"
                                :width="(count / 1624) * 264"
                                :style="{ width: `${(count / 1624) * 264}px` }"
                              />
                              <Column
                                :width="(1 - count / 1624) * 264"
                                :style="{
                                  width: `${(1 - count / 1624) * 264}px`,
                                }"
                              />
                            </Row>
                          </Column>
                        </Row>
                      </dt>
                    </Column>
                    <Column width="100%" class="w-full">
                      <dd
                        class="ml-[12px] text-right font-medium text-gray-500 text-[12px] [font-variant-numeric:tabular-nums] leading-none"
                      >
                        {{ Math.round((count / 1624) * 100) }}%
                      </dd>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </dl>
            <Text
              class="mt-[14px] text-center text-gray-500 text-[12px] leading-[24px]"
            >
              Based on <span class="font-semibold">1624</span> Reviews
            </Text>
          </Section>
          <Hr />
          <Section class="mt-[30px]">
            <Heading
              as="h3"
              class="mb-[12px] font-medium text-gray-900 text-[18px] leading-[24px]"
            >
              Share your thoughts
            </Heading>
            <Text class="m-0 text-gray-500 text-[14px] leading-[20px]">
              If you’ve used this product, share your thoughts with other
              customers
            </Text>
            <Button
              href="#"
              class="mt-[26px] mb-[24px] inline-block w-full rounded-[8px] bg-indigo-600 p-[12px] text-center box-border font-semibold text-white"
            >Write a review</Button>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
