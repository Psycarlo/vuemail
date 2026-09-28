<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import { h, type VNode } from 'vue';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';

interface NetlifyWelcomeEmailProps {
  steps: {
    id: number;
    Description: VNode;
  }[];
  links: {
    title: string;
    href: string;
  }[];
}

const { steps, links } = defineProps<NetlifyWelcomeEmailProps>();

defineOptions({
  PreviewProps: {
    steps: [
      {
        id: 1,
        Description: h('li', { class: 'mb-20', key: 1 }, [
          h('strong', 'Deploy your first project.'),
          ' ',
          h(Link, null, () => 'Connect to Git, choose a template'),
          ", or manually deploy a project you've been working on locally.",
        ]),
      },
      {
        id: 2,
        Description: h('li', { class: 'mb-20', key: 2 }, [
          h('strong', 'Check your deploy logs.'),
          " Find out what's included in your build and watch for errors or failed deploys. ",
          h(Link, null, () => 'Learn how to read your deploy logs'),
          '.',
        ]),
      },
      {
        id: 3,
        Description: h('li', { class: 'mb-20', key: 3 }, [
          h('strong', 'Choose an integration.'),
          ' Quickly discover, connect, and configure the right tools for your project with 150+ integrations to choose from. ',
          h(Link, null, () => 'Explore the Integrations Hub'),
          '.',
        ]),
      },
      {
        id: 4,
        Description: h('li', { class: 'mb-20', key: 4 }, [
          h('strong', 'Set up a custom domain.'),
          ' You can register a new domain and buy it through Netlify or assign a domain you already own to your site. ',
          h(Link, null, () => 'Add a custom domain'),
          '.',
        ]),
      },
    ],
    links: [
      {
        title: 'Visit the forums',
        href: 'https://www.netlify.com',
      },
      { title: 'Read the docs', href: 'https://www.netlify.com' },
      { title: 'Contact an expert', href: 'https://www.netlify.com' },
    ],
  } satisfies NetlifyWelcomeEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind
      :config="{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: '#2250f4',
              offwhite: '#fafbfb',
            },
            spacing: {
              0: '0px',
              20: '20px',
              45: '45px',
            },
          },
        },
      }"
    >
      <Body class="bg-offwhite font-sans text-base">
        <Preview>Netlify Welcome</Preview>
        <Img
          :src="`${baseUrl}/static/netlify-logo.png`"
          width="184"
          height="75"
          alt="Netlify"
          class="mx-auto my-20"
        />
        <Container class="bg-white p-45">
          <Heading class="my-0 text-center leading-8">
            Welcome to Netlify
          </Heading>

          <Section>
            <Row>
              <Text class="text-base">
                Congratulations! You're joining over 3 million developers
                around the world who use Netlify to build and ship sites,
                stores, and apps.
              </Text>

              <Text class="text-base">Here's how to get started:</Text>
            </Row>
          </Section>

          <ul>
            <component
              :is="Description"
              v-for="{ id, Description } in steps"
              :key="id"
            />
          </ul>

          <Section class="text-center">
            <Button class="rounded-lg bg-brand px-[18px] py-3 text-white">
              Go to your dashboard
            </Button>
          </Section>

          <Section class="mt-45">
            <Row>
              <Column v-for="link in links" :key="link.title">
                <Link
                  class="font-bold text-black underline"
                  :href="link.href"
                >{{ link.title }}</Link> <span class="text-green-500">→</span>
              </Column>
            </Row>
          </Section>
        </Container>

        <Container class="mt-20">
          <Section>
            <Row>
              <Column class="px-20 text-right">
                <Link>Unsubscribe</Link>
              </Column>
              <Column class="text-left">
                <Link>Manage Preferences</Link>
              </Column>
            </Row>
          </Section>
          <Text class="mb-45 text-center text-gray-400">
            Netlify, 44 Montgomery Street, Suite 300 San Francisco, CA
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
