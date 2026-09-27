<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/vuemail/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';

interface PapermarkYearInReviewEmailProps {
  year?: number;
  minutesSpentOnDocs?: number;
  uploadedDocuments?: number;
  sharedLinks?: number;
  receivedViews?: number;
  topDocumentName?: string;
  topDocumentViews?: number;
  mostActiveMonth?: string;
  mostActiveMonthViews?: number;
  sharerPercentile?: number;
  viewingLocations: string[];
}

const {
  year,
  minutesSpentOnDocs,
  uploadedDocuments,
  sharedLinks,
  receivedViews,
  topDocumentName,
  topDocumentViews,
  mostActiveMonth,
  mostActiveMonthViews,
  sharerPercentile,
  viewingLocations,
} = defineProps<PapermarkYearInReviewEmailProps>();

defineOptions({
  PreviewProps: {
    year: 2024,
    minutesSpentOnDocs: 1234,
    uploadedDocuments: 25,
    sharedLinks: 50,
    receivedViews: 500,
    topDocumentName: 'Q4 Financial Report',
    topDocumentViews: 150,
    mostActiveMonth: 'September',
    mostActiveMonthViews: 200,
    sharerPercentile: 95,
    viewingLocations: ['United States', 'United Kingdom', 'Germany', 'Japan'],
  } satisfies PapermarkYearInReviewEmailProps,
});
</script>

<template>
  <Html>
    <Head />

    <Tailwind>
      <Body class="bg-white font-sans">
        <Preview>See your stats from 2024</Preview>
        <Container class="mx-auto w-full max-w-[600px] p-0">
          <Section class="p-8 text-center">
            <Text
              class="mx-0 mt-4 mb-8 p-0 text-center font-normal text-2xl"
            >
              <span class="font-bold tracking-tighter">Papermark</span>
            </Text>
            <Text class="font-normal text-sm uppercase tracking-wider">
              {{ year }} in review
            </Text>
            <Heading class="my-4 font-medium text-4xl leading-tight">
              Your Year with Papermark
            </Heading>
            <Text class="mb-8 text-lg leading-8">
              What a year it&apos;s been! Let&apos;s take a look at how
              you&apos;ve used Papermark to share your important documents.
            </Text>
            <Link
              href="https://www.papermark.com"
              class="inline-flex items-center rounded-full bg-gray-900 px-12 py-4 text-center font-bold text-sm text-white no-underline"
            >
              Share your stats
            </Link>
          </Section>

          <Section
            class="my-6 rounded-2xl bg-[#fb7a00]/10 bg-[radial-gradient(circle_at_bottom_right,#fb7a00_0%,transparent_60%)] p-8 text-center"
          >
            <Heading class="m-0 font-medium text-3xl text-[#a63b00]">
              Viewers spent
            </Heading>
            <Text class="my-4 font-bold text-7xl text-gray-900 leading-none">
              {{ minutesSpentOnDocs }}
            </Text>
            <Text class="mb-4 font-medium text-3xl text-gray-900">
              minutes on your documents
            </Text>
            <Text class="text-gray-900 text-sm leading-5">
              That&apos;s a lot of engagement! Your documents are resonating
              with your visitors.
            </Text>

            <Hr class="mt-6" :style="{ borderColor: '#fb7a00' }" />
            <Heading
              class="pt-5 font-medium text-gray-900 text-xs uppercase tracking-wider"
            >
              Your activity
            </Heading>
            <Row class="mt-5">
              <Column class="w-1/3 text-center">
                <Text class="font-medium text-[#a63b00] text-sm">
                  You uploaded
                </Text>
                <Text class="my-1 font-bold text-4xl text-gray-900">
                  {{ uploadedDocuments }}
                </Text>
                <Text class="text-2xl text-gray-900">documents</Text>
              </Column>
              <Column class="w-1/3 text-center">
                <Text class="font-medium text-[#a63b00] text-sm">
                  You shared
                </Text>
                <Text class="my-1 font-bold text-4xl text-gray-900">
                  {{ sharedLinks }}
                </Text>
                <Text class="text-2xl text-gray-900">links</Text>
              </Column>
              <Column class="w-1/3 text-center">
                <Text class="font-medium text-[#a63b00] text-sm">
                  You received
                </Text>
                <Text class="my-1 font-bold text-4xl text-gray-900">
                  {{ receivedViews }}
                </Text>
                <Text class="text-2xl text-gray-900">views</Text>
              </Column>
            </Row>
          </Section>

          <Section
            class="my-6 rounded-2xl bg-[#4b5563]/10 bg-[radial-gradient(circle_at_bottom_right,#4b5563_0%,transparent_60%)] p-8 text-center"
          >
            <Heading class="m-0 font-medium text-3xl text-gray-800">
              Your top document
            </Heading>
            <Text class="my-4 font-bold text-2xl text-gray-900 leading-none">
              &quot;{{ topDocumentName }}&quot;
            </Text>
            <Text class="mb-4 font-medium text-5xl text-gray-900">
              {{ topDocumentViews }} views
            </Text>
            <Text class="text-gray-900 text-sm leading-5">
              This document really caught your visitor&apos;s attention!
            </Text>
          </Section>

          <Section
            class="my-6 rounded-2xl bg-[#e4c5a0]/10 bg-[radial-gradient(circle_at_bottom_right,#e4c5a0_0%,transparent_60%)] p-8 text-center"
          >
            <Heading class="m-0 font-medium text-3xl text-[#9c7b4a]">
              Your most active month
            </Heading>
            <Text class="my-4 font-bold text-5xl text-gray-900 leading-none">
              {{ mostActiveMonth }}
            </Text>
            <Text class="mb-4 font-medium text-3xl text-gray-900">
              with {{ mostActiveMonthViews }} views
            </Text>
            <Text class="text-gray-900 text-sm leading-5">
              {{ mostActiveMonth }} was your busiest month. What did you share
              that got so much attention?
            </Text>

            <Hr class="mt-6" :style="{ borderColor: '#e4c5a0' }" />
            <Heading
              class="pt-5 font-medium text-gray-900 text-xs uppercase tracking-wider"
            >
              You&apos;re in the top
            </Heading>
            <Text class="my-4 font-bold text-7xl text-gray-900 leading-none">
              {{ sharerPercentile }}%
            </Text>
            <Text class="mb-4 font-medium text-gray-900 text-xl">
              of sharers on Papermark
            </Text>
            <Text class="text-gray-900 text-sm leading-5">
              You&apos;re one of our most active users. Thank you for sharing
              with Papermark!
            </Text>
          </Section>

          <Section
            class="my-6 rounded-2xl bg-[#10b981]/10 bg-[radial-gradient(circle_at_bottom_right,#10b981_0%,transparent_60%)] p-8 text-center"
          >
            <Heading class="m-0 font-medium text-3xl text-[#065f46]">
              Your documents were viewed from
            </Heading>
            <Row class="mt-4">
              <Column>
                <Text
                  v-for="(location, index) in viewingLocations"
                  :key="index"
                  class="rounded-full bg-[#10b981] px-3 py-1 font-medium text-sm text-white"
                  :style="{
                    margin: '4px 4px',
                    display: 'inline-block',
                  }"
                >
                  {{ location }}
                </Text>
              </Column>
            </Row>
            <Text class="mt-4 text-[#065f46] text-sm leading-5">
              Your documents get attention from all over the world!
            </Text>
          </Section>

          <Section class="pb-6 text-center">
            <Text class="text-gray-900 text-xl leading-8">
              We&apos;re excited to support you next year! <br />
              Happy Holidays from the Papermark team :)
            </Text>
            <Link
              href="https://www.papermark.com"
              class="mt-4 inline-flex items-center rounded-full bg-gray-900 px-12 py-4 text-center font-bold text-sm text-white no-underline"
            >Share your stats</Link>
            <Link
              href="https://www.papermark.com"
              class="mt-4 block items-center text-center font-bold text-gray-900 text-sm no-underline"
            >Go to your dashboard</Link>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
