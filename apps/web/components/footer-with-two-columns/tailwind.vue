<script setup lang="ts">
import { Column, Img, Link, Row, Section, Text } from '@vuemaildev/vuemail';
</script>

<template>
  <Section>
    <Row>
      <Column :colspan="4">
        <Img
          alt="Vuemail logo"
          height="42"
          src="/static/logo-without-background.png"
        />
        <Text
          class="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]"
        >
          Acme corporation
        </Text>
        <Text
          class="mt-[4px] mb-[0px] text-[16px] text-gray-500 leading-[24px]"
        >
          Think different
        </Text>
      </Column>
      <Column align="left" class="table-cell align-bottom">
        <Row class="table-cell h-[44px] w-[56px] align-bottom">
          <Column class="pr-[8px]">
            <Link href="#">
              <Img
                alt="Facebook"
                height="36"
                src="/static/facebook-logo.png"
                width="36"
              />
            </Link>
          </Column>
          <Column class="pr-[8px]">
            <Link href="#">
              <Img alt="X" height="36" src="/static/x-logo.png" width="36" />
            </Link>
          </Column>
          <Column>
            <Link href="#">
              <Img
                alt="Instagram"
                height="36"
                src="/static/instagram-logo.png"
                width="36"
              />
            </Link>
          </Column>
        </Row>
        <Row>
          <Text
            class="my-[8px] font-semibold text-[16px] text-gray-500 leading-[24px]"
          >
            123 Main Street Anytown, CA 12345
          </Text>
          <Text
            class="mt-[4px] mb-[0px] font-semibold text-[16px] text-gray-500 leading-[24px]"
          >
            mail@example.com +123456789
          </Text>
        </Row>
      </Column>
    </Row>
  </Section>
</template>
