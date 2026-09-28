<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';
import tailwindConfig from '../../tailwind.config';

interface PlaidVerifyIdentityEmailProps {
  validationCode?: string;
}

const { validationCode } = defineProps<PlaidVerifyIdentityEmailProps>();

defineOptions({
  PreviewProps: {
    validationCode: '144833',
  } satisfies PlaidVerifyIdentityEmailProps,
});

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="bg-white font-plaid">
        <Container
          class="bg-white border border-solid border-[#eee] rounded shadow-[rgba(20,50,70,.2)] shadow-md mt-5 max-w-[360px] mx-auto my-0 pt-[68px] px-0 pb-[130px]"
        >
          <Img
            :src="`${baseUrl}/static/plaid-logo.png`"
            width="212"
            height="88"
            alt="Plaid"
            class="mx-auto my-0"
          />
          <Text
            class="text-[#0a85ea] text-[11px] font-bold h-4 tracking-[0] leading-[16px] mt-4 mb-2 mx-2 uppercase text-center"
          >
            Verify Your Identity
          </Text>
          <Heading
            class="text-black font-medium font-[HelveticaNeue-Medium,Helvetica,Arial,sans-serif] inline-block text-[20px] leading-[24px] my-0 text-center"
          >
            Enter the following code to finish linking Venmo.
          </Heading>
          <Section
            class="bg-[rgba(0,0,0,.05)] rounded mx-auto font-[HelveticaNeue-Bold] mt-4 mb-3.5 align-middle w-[280px]"
          >
            <Text
              class="text-black text-[32px] font-bold tracking-[6px] leading-10 py-2 mx-auto my-0 block text-center"
            >
              {{ validationCode }}
            </Text>
          </Section>
          <Text
            class="text-[#444] text-[15px] leading-[23px] tracking-[0] py-0 px-10 m-0 text-center"
          >
            Not expecting this email?
          </Text>
          <Text
            class="text-[#444] text-[15px] leading-[23px] tracking-[0] py-0 px-10 m-0 text-center"
          >
            Contact
            <Link
              href="mailto:login@plaid.com"
              class="text-[#444] underline"
            >login@plaid.com</Link>
            if you did not request this code.
          </Text>
        </Container>
        <Text
          class="text-black text-xs font-extrabold tracking-[0] leading-[23px] m-0 mt-5 text-center uppercase"
        >
          Securely powered by Plaid.
        </Text>
      </Body>
    </Tailwind>
  </Html>
</template>
