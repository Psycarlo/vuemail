import { describe, expect, test } from 'vitest';
import { wrapWithTailwind } from './wrap-with-tailwind';

const code = `<script setup lang="ts">
import { Img, Link, Section, Text } from 'vuemail';
</script>

<template>
  <Section class="my-[16px] text-center">
    <Section class="inline-block w-full max-w-[250px] text-left align-top">
      <Text class="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
        What's new
      </Text>
      <Text class="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]">
        Versatile Comfort
      </Text>

      <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
        Experience ultimate comfort and versatility with our furniture
        collection, designed to adapt to your ever-changing needs.
      </Text>
      <Link class="text-indigo-600 underline" href="https://vuemail.dev">
        Read more
      </Link>
    </Section>
    <Section class="my-[8px] inline-block w-full max-w-[220px] align-top">
      <template v-if="true">
        <Img
          alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
          class="rounded-[8px] object-cover"
          height="220"
          src="/static/versatile-comfort.jpg"
          width="220"
        />
      </template>
    </Section>
  </Section>
</template>
`;

test('wrapWithTailwind()', () => {
  expect(wrapWithTailwind(code)).toMatchInlineSnapshot(`
    "<script setup lang="ts">
    import { Img, Link, Section, Tailwind, Text } from 'vuemail';
    </script>

    <template>
      <Tailwind>
        <Section class="my-[16px] text-center">
          <Section class="inline-block w-full max-w-[250px] text-left align-top">
            <Text class="m-0 font-semibold text-[16px] text-indigo-600 leading-[24px]">
              What's new
            </Text>
            <Text class="m-0 mt-[8px] font-semibold text-[20px] text-gray-900 leading-[28px]">
              Versatile Comfort
            </Text>

            <Text class="mt-[8px] text-[16px] text-gray-500 leading-[24px]">
              Experience ultimate comfort and versatility with our furniture
              collection, designed to adapt to your ever-changing needs.
            </Text>
            <Link class="text-indigo-600 underline" href="https://vuemail.dev">
              Read more
            </Link>
          </Section>
          <Section class="my-[8px] inline-block w-full max-w-[220px] align-top">
            <template v-if="true">
              <Img
                alt="An aesthetic picture taken of an Iphone, flowers, glasses and a card that reads 'Gucci, bloom' coming out of a leathered bag with a ziper"
                class="rounded-[8px] object-cover"
                height="220"
                src="/static/versatile-comfort.jpg"
                width="220"
              />
            </template>
          </Section>
        </Section>
      </Tailwind>
    </template>
    "
  `);
});

describe('wrapWithTailwind() imports', () => {
  const template = `<template>
  <Button href="https://vuemail.dev">Go</Button>
</template>
`;

  test('breaks the import in lines when it gets too long', () => {
    const wrapped = wrapWithTailwind(`<script setup lang="ts">
import { Body, Column, Container, Heading, Img, Row, Section, Text } from 'vuemail';
</script>

${template}`);

    expect(wrapped).toContain(`import {
  Body,
  Column,
  Container,
  Heading,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';`);
  });

  test('adds Tailwind to an import already broken in lines', () => {
    const wrapped = wrapWithTailwind(`<script setup lang="ts">
import {
  Button,
  Section,
} from 'vuemail';
</script>

${template}`);

    expect(wrapped).toContain(
      "import { Button, Section, Tailwind } from 'vuemail';",
    );
  });

  test('imports Tailwind when nothing is imported from Vuemail', () => {
    const wrapped = wrapWithTailwind(`<script setup lang="ts">
const href = 'https://vuemail.dev';
</script>

${template}`);

    expect(
      wrapped.startsWith(`<script setup lang="ts">
import { Tailwind } from 'vuemail';
const href = 'https://vuemail.dev';
</script>`),
    ).toBe(true);
  });

  test('adds a script to components without one', () => {
    expect(wrapWithTailwind(template)).toBe(`<script setup lang="ts">
import { Tailwind } from 'vuemail';
</script>

<template>
  <Tailwind>
    <Button href="https://vuemail.dev">Go</Button>
  </Tailwind>
</template>
`);
  });

  test('keeps an import of Tailwind that is already there', () => {
    const wrapped = wrapWithTailwind(`<script setup lang="ts">
import { Button, Tailwind } from 'vuemail';
</script>

${template}`);

    expect(wrapped).toContain("import { Button, Tailwind } from 'vuemail';");
    expect(wrapped.match(/Tailwind,|Tailwind }/g)).toHaveLength(1);
  });
});
