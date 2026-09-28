<script setup lang="ts">
import { Body } from '../../body';
import { Container } from '../../container';
import { Head } from '../../head';
import { Html } from '../../html';
import { Preview } from '../../preview';
import { Section } from '../../section';
import { Text } from '../../text';
import { Tailwind } from '../tailwind';
import CallToAction from './call-to-action.vue';
import Card from './card.vue';

defineProps<{ name: string; steps: string[] }>();

defineOptions({
  PreviewProps: { name: 'Ana', steps: ['Create an account'] },
});
</script>

<template>
  <Html>
    <Tailwind>
      <Head />
      <Preview>Welcome, {{ name }}</Preview>
      <Body class="bg-white font-sans">
        <Container class="mx-auto px-5 sm:px-10">
          <Text class="text-lg text-gray-900">Hi {{ name }},</Text>
          <Section class="py-4">
            <p v-for="step in steps" :key="step" class="m-0 text-sm">
              {{ step }}
            </p>
          </Section>
          <Card class="mt-2">Nested component</Card>
          <CallToAction>Get started</CallToAction>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
