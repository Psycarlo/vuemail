// The code of the example email the playground of the home page shows, one
// variant per tab. The email it renders is
// `app/components/home/playground/CodeExample.vue`.

export const playgroundTailwindCode = `<script setup lang="ts">
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Tailwind, Text } from '@vuemaildev/vuemail';

interface WelcomeEmailProps {
  username?: string;
  company?: string;
}

const { username = 'Nicole', company = 'Helix' } =
  defineProps<WelcomeEmailProps>();

const previewText = \`Welcome to \${company}, \${username}!\`;
</script>

<template>
  <Html>
    <Head />
    <Preview>{{ previewText }}</Preview>
    <Tailwind>
      <Body class="bg-black m-auto font-sans">
        <Container class="mb-10 mx-auto p-5 max-w-[465px]">
          <Section class="mt-10">
            <Img
              src="https://example.com/brand/example-logo.png"
              width="60"
              height="60"
              alt="Logo Example"
              class="my-0 mx-auto"
            />
          </Section>
          <Heading class="text-2xl text-white font-normal text-center p-0 my-8 mx-0">
            Welcome to <strong>{{ company }}</strong>, {{ username }}!
          </Heading>
          <Text class="text-start text-sm text-white">
            Hello {{ username }},
          </Text>
          <Text class="text-start text-sm text-white leading-relaxed">
            We're excited to have you onboard at <strong>{{ company }}</strong>.
            We hope you enjoy your journey with us. If you have any questions
            or need assistance, feel free to reach out.
          </Text>
          <Section class="text-center mt-[32px] mb-[32px]">
            <Button
              class="py-2.5 px-5 bg-white rounded-md text-black text-sm font-semibold no-underline text-center"
              href="https://example.com/get-started"
            >
              Get Started
            </Button>
          </Section>
          <Text class="text-start text-sm text-white">
            Cheers,
            <br />
            The {{ company }} Team
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>`;

export const playgroundCssCode = `<script setup lang="ts">
import { Body, Button, Container, Head, Heading, Html, Img, Preview, Section, Text } from '@vuemaildev/vuemail';

interface WelcomeEmailProps {
  username?: string;
  company?: string;
}

const { username = 'Nicole', company = 'Helix' } =
  defineProps<WelcomeEmailProps>();

const previewText = \`Welcome to \${company}, \${username}!\`;
const fontFamily =
  "ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";
</script>

<template>
  <Html>
    <Head />
    <Preview>{{ previewText }}</Preview>
    <Body :style="{ backgroundColor: 'black', margin: 'auto', fontFamily }">
      <Container :style="{ marginBottom: '40px', marginLeft: 'auto', marginRight: 'auto', padding: '20px', width: '465px' }">
        <Section :style="{ marginTop: '40px' }">
          <Img
            src="https://example.com/brand/example-logo.png"
            width="60"
            height="60"
            alt="Logo Example"
            :style="{ margin: '0', marginLeft: 'auto', marginRight: 'auto' }"
          />
        </Section>
        <Heading :style="{ fontSize: '24px', color: 'white', fontWeight: 'normal', textAlign: 'center', margin: '0', marginTop: '32px', marginLeft: '0', marginRight: '0' }">
          Welcome to <strong>{{ company }}</strong>, {{ username }}!
        </Heading>
        <Text :style="{ textAlign: 'start', fontSize: '14px', color: 'white' }">
          Hello {{ username }},
        </Text>
        <Text :style="{ textAlign: 'start', fontSize: '14px', color: 'white', lineHeight: '1.625' }">
          We're excited to have you onboard at <strong>{{ company }}</strong>.
          We hope you enjoy your journey with us. If you have any questions
          or need assistance, feel free to reach out.
        </Text>
        <Section :style="{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }">
          <Button
            :style="{ padding: '10px 20px', backgroundColor: 'white', borderRadius: '6px', color: 'black', fontSize: '14px', fontWeight: 'semibold', textDecoration: 'none', textAlign: 'center' }"
            href="https://example.com/get-started"
          >
            Get Started
          </Button>
        </Section>
        <Text :style="{ textAlign: 'start', fontSize: '14px', color: 'white' }">
          Cheers,
          <br />
          The {{ company }} Team
        </Text>
      </Container>
    </Body>
  </Html>
</template>`;
