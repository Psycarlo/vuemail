<script setup lang="ts">
import { Column, Heading, Hr, Img, Link, Row, Section, Text } from 'vuemail';

const authors = [
  {
    name: 'Steve Jobs',
    title: 'Co-Founder & CEO',
    imgSrc: '/static/steve-jobs.jpg',
    showDivider: true,
  },
  {
    name: 'Steve Wozniak',
    title: 'Co-Founder & CTO',
    imgSrc: '/static/steve-wozniak.jpg',
    showDivider: false,
  },
];
</script>

<template>
  <Section>
    <Hr class="!border-gray-300 mt-[16px] mb-[0px]" />
    <template v-for="author in authors" :key="author.name">
      <Row align="left" width="288" class="pt-[16px] w-[288px]">
        <Column
          width="48"
          height="48"
          align="left"
          class="pt-[5px] h-[48px] w-[48px]"
        >
          <Img
            :alt="author.name"
            class="block rounded-full object-cover object-center"
            :height="48"
            :src="author.imgSrc"
            :width="48"
          />
        </Column>
        <Column width="100%" class="pl-[18px] w-full" align="left" valign="top">
          <Heading
            as="h3"
            class="m-0 font-medium text-[14px] text-gray-900 leading-[20px]"
          >
            {{ author.name }}
          </Heading>
          <Text
            class="m-0 font-medium text-[12px] text-gray-500 leading-[14px]"
          >
            {{ author.title }}
          </Text>
          <Row :width="undefined" class="pt-[8px]" align="left">
            <Column width="12" height="12">
              <Link class="h-[12px] w-[12px]" href="#">
                <Img
                  alt="X"
                  :height="12"
                  src="/static/x-icon.png"
                  :width="12"
                />
              </Link>
            </Column>
            <Column class="pl-[8px]" width="12" height="12">
              <Link class="h-[12px] w-[12px]" href="#">
                <Img
                  alt="LinkedIn"
                  :height="12"
                  src="/static/in-icon.png"
                  :width="12"
                />
              </Link>
            </Column>
          </Row>
        </Column>
      </Row>
      <Hr
        v-if="author.showDivider"
        class="mr-[16px] inline-block h-[58px] w-[1px] bg-gray-300 [border:none]"
        :style="{ float: 'left' }"
      />
    </template>
  </Section>
</template>
