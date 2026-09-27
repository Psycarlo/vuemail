<script setup lang="ts">
import { Column, Heading, Hr, Img, Link, Row, Section, Text } from 'vuemail';
</script>

<template>
  <Section>
    <Hr class="!border-gray-300 my-[16px]" />
    <Row :width="undefined">
      <Column
        width="48"
        height="48"
        class="pt-[5px] h-[48px] w-[48px]"
        align="left"
      >
        <Img
          alt="Steve Jobs"
          class="block h-[48px] w-[48px] rounded-full object-cover object-center"
          height="48"
          src="https://vuemail.dev/static/steve-jobs.jpg"
          width="48"
        />
      </Column>
      <Column width="120" class="pl-[18px] w-[120px]" align="left" valign="top">
        <Heading
          as="h3"
          class="m-[0px] font-medium text-[14px] text-gray-800 leading-[20px]"
        >
          Steve Jobs
        </Heading>
        <Text
          class="m-[0px] font-medium text-[12px] text-gray-500 leading-[14px]"
        >
          Co-Founder & CEO
        </Text>
        <Row :width="undefined" class="mt-[4px]" :align="undefined">
          <Column :width="undefined" valign="middle">
            <Link class="h-[12px] w-[12px]" href="#">
              <Img
                alt="X"
                src="https://vuemail.dev/static/x-icon.png"
                width="12"
                height="12"
                :style="{ height: '12px', width: '12px' }"
              />
            </Link>
          </Column>
          <Column :width="undefined" class="pl-[8px]" valign="middle">
            <Link class="h-[12px] w-[12px]" href="#">
              <Img
                alt="LinkedIn"
                src="https://vuemail.dev/static/in-icon.png"
                width="12"
                height="12"
                :style="{ height: '12px', width: '12px' }"
              />
            </Link>
          </Column>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
