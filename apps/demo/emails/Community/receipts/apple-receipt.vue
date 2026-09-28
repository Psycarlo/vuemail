<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@vuemaildev/vuemail';
import tailwindConfig from '../../tailwind.config';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<template>
  <Html>
    <Head />
    <Tailwind :config="tailwindConfig">
      <Body class="font-apple bg-white">
        <Preview>Apple Receipt</Preview>
        <Container class="mx-auto px-0 pt-5 pb-12 w-[660px] max-w-full">
          <Section>
            <Row>
              <Column>
                <Img
                  :src="`${baseUrl}/static/apple-logo.png`"
                  width="42"
                  height="42"
                  alt="Apple Logo"
                />
              </Column>

              <Column align="right" class="table-cell">
                <Text
                  class="text-[32px] font-light text-[#888888] my-4 leading-6"
                >
                  Receipt
                </Text>
              </Column>
            </Row>
          </Section>
          <Section>
            <Text
              class="text-center m-0 mt-9 mb-10 text-[14px] leading-[24px] font-medium text-[#111111]"
            >
              Save 3% on all your Apple purchases with Apple Card.<sup class="font-light">1</sup> <Link
                href="https://www.apple.com/apple-card/"
              >Apply and use in minutes</Link><sup class="font-light">2</sup>
            </Text>
          </Section>
          <Section
            class="border-collapse border-spacing-0 text-[rgb(51,51,51)] bg-[rgb(250,250,250)] rounded-[3px] text-[12px]"
          >
            <Row class="min-h-[46px]">
              <Column :colspan="2">
                <Section>
                  <Row>
                    <Column
                      class="pl-5 border-solid border-white border-0 border-r border-b min-h-[44px]"
                    >
                      <Text
                        class="m-0 p-0 text-[rgb(102,102,102)] text-[10px] leading-[1.4]"
                      >
                        APPLE ID
                      </Text>
                      <Link
                        class="m-0 p-0 text-[#15c] underline text-[12px] leading-[1.4]"
                      >alan.turing@gmail.com</Link>
                    </Column>
                  </Row>

                  <Row>
                    <Column
                      class="pl-5 border-solid border-white border-0 border-r border-b min-h-[44px]"
                    >
                      <Text
                        class="m-0 p-0 text-[rgb(102,102,102)] text-[10px] leading-[1.4]"
                      >
                        INVOICE DATE
                      </Text>
                      <Text class="m-0 p-0 text-[12px] leading-[1.4]">
                        18 Jan 2023
                      </Text>
                    </Column>
                  </Row>

                  <Row>
                    <Column
                      class="pl-5 border-solid border-white border-0 border-r border-b min-h-[44px]"
                    >
                      <Text
                        class="m-0 p-0 text-[rgb(102,102,102)] text-[10px] leading-[1.4]"
                      >
                        ORDER ID
                      </Text>
                      <Link
                        class="m-0 p-0 text-[#15c] underline text-[12px] leading-[1.4]"
                      >ML4F5L8522</Link>
                    </Column>
                    <Column
                      class="pl-5 border-solid border-white border-0 border-r border-b min-h-[44px]"
                    >
                      <Text
                        class="m-0 p-0 text-[rgb(102,102,102)] text-[10px] leading-[1.4]"
                      >
                        DOCUMENT NO.
                      </Text>
                      <Text class="m-0 p-0 text-[12px] leading-[1.4]">
                        186623754793
                      </Text>
                    </Column>
                  </Row>
                </Section>
              </Column>
              <Column
                class="pl-5 border-solid border-white border-0 border-r border-b min-h-[44px]"
                :colspan="2"
              >
                <Text
                  class="m-0 p-0 text-[rgb(102,102,102)] text-[10px] leading-[1.4]"
                >
                  BILLED TO
                </Text>
                <Text class="m-0 p-0 text-[12px] leading-[1.4]">
                  Visa .... 7461 (Apple Pay)
                </Text>
                <Text class="m-0 p-0 text-[12px] leading-[1.4]">
                  Alan Turing
                </Text>
                <Text class="m-0 p-0 text-[12px] leading-[1.4]">
                  2125 Chestnut St
                </Text>
                <Text class="m-0 p-0 text-[12px] leading-[1.4]">
                  San Francisco, CA 94123
                </Text>
                <Text class="m-0 p-0 text-[12px] leading-[1.4]">USA</Text>
              </Column>
            </Row>
          </Section>
          <Section
            class="border-collapse border-spacing-0 text-[rgb(51,51,51)] bg-[rgb(250,250,250)] rounded-[3px] text-[12px] mt-[30px] mb-[15px] min-h-[24px]"
          >
            <Text
              class="bg-[#fafafa] pl-[10px] text-sm leading-[24px] font-medium m-0"
            >
              App Store
            </Text>
          </Section>
          <Section>
            <Row>
              <Column class="w-16">
                <Img
                  :src="`${baseUrl}/static/apple-hbo-max-icon.jpeg`"
                  width="64"
                  height="64"
                  alt="HBO Max"
                  class="ml-5 rounded-[14px] border border-solid border-[rgb(242,242,242)]"
                />
              </Column>
              <Column class="pl-[22px]">
                <Text class="text-xs font-semibold m-0 p-0 leading-[1.4]">
                  HBO Max: Stream TV &amp; Movies
                </Text>
                <Text
                  class="text-xs text-[rgb(102,102,102)] m-0 p-0 leading-[1.4]"
                >
                  HBO Max Ad-Free (Monthly)
                </Text>
                <Text
                  class="text-xs text-[rgb(102,102,102)] m-0 p-0 leading-[1.4]"
                >
                  Renews Aug 20, 2023
                </Text>
                <Link
                  href="https://www.apple.com/"
                  class="text-[12px] text-[rgb(0,112,201)] no-underline"
                >Write a Review</Link>
                <span class="mx-1 text-[rgb(51,51,51)] font-extralight">|</span>
                <Link
                  href="https://www.apple.com/"
                  class="text-[12px] text-[rgb(0,112,201)] no-underline"
                >Report a Problem</Link>
              </Column>

              <Column
                class="table-cell pr-5 w-[100px] align-top"
                align="right"
              >
                <Text class="text-[12px] leading-[24px] font-semibold m-0">
                  $14.99
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr class="mt-[30px] mb-0" />
          <Section align="right">
            <Row>
              <Column class="table-cell" align="right">
                <Text
                  class="m-0 text-[rgb(102,102,102)] text-[10px] font-semibold p-0 pr-[30px] text-right"
                >
                  TOTAL
                </Text>
              </Column>
              <Column
                class="min-h-12 pt-12 [border-left:1px_solid_rgb(238,238,238)]"
              />
              <Column class="table-cell w-[90px]">
                <Text
                  class="text-base font-semibold whitespace-nowrap m-0 mr-5 text-right"
                >
                  $14.99
                </Text>
              </Column>
            </Row>
          </Section>
          <Hr class="mb-[75px]" />
          <Section>
            <Row>
              <Column align="center" class="block">
                <Img
                  :src="`${baseUrl}/static/apple-card-icon.png`"
                  width="60"
                  height="17"
                  alt="Apple Card"
                />
              </Column>
            </Row>
          </Section>
          <Section>
            <Row>
              <Column align="center" class="block mt-[15px]">
                <Text class="text-[24px] leading-none font-medium">
                  Save 3% on all your Apple purchases.
                </Text>
              </Column>
            </Row>
          </Section>
          <Section>
            <Row>
              <Column align="center" class="table-cell mt-[10px]">
                <Link
                  href="https://www.apple.com/"
                  class="text-[rgb(0,126,255)] no-underline"
                >
                  <Img
                    :src="`${baseUrl}/static/apple-wallet.png`"
                    width="28"
                    height="28"
                    alt="Apple Wallet"
                    class="[display:inherit] pr-2 align-middle"
                  />
                  <span class="text-[14px] font-normal no-underline">Apply and use in minutes</span>
                </Link>
              </Column>
            </Row>
          </Section>
          <Hr class="my-[65px] mb-5" />
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] m-0 mb-4"
          >
            1. 3% savings is earned as Daily Cash and is transferred to your
            Apple Cash card when transactions post to your Apple Card account.
            If you do not have an Apple Cash card, Daily Cash can be applied by
            you as a credit on your statement balance. 3% is the total amount of
            Daily Cash earned for these purchases. See the Apple Card Customer
            Agreement for more details on Daily Cash and qualifying
            transactions.
          </Text>
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] m-0 mb-4"
          >
            2. Subject to credit approval.
          </Text>
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] m-0 mb-4"
          >
            To access and use all the features of Apple Card, you must add Apple
            Card to Wallet on an iPhone or iPad with iOS or iPadOS 13.2 or
            later. Update to the latest version of iOS or iPadOS by going to
            Settings &gt; General &gt; Software Update. Tap Download and
            Install.
          </Text>
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] m-0 mb-4"
          >
            Available for qualifying applicants in the United States.
          </Text>
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] m-0 mb-4"
          >
            Apple Card is issued by Goldman Sachs Bank USA, Salt Lake City
            Branch.
          </Text>
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] m-0 mb-4"
          >
            If you reside in the US territories, please call Goldman Sachs at
            877-255-5923 with questions about Apple Card.
          </Text>
          <Text
            class="text-[12px] leading-[normal] text-[rgb(102,102,102)] my-5 text-center"
          >
            Privacy: We use a<Link
              href="https://www.apple.com/"
              class="text-[rgb(0,115,255)]"
            > Subscriber ID </Link>to provide reports to developers.
          </Text>
          <Text
            class="text-[12px] text-[rgb(102,102,102)] my-5 leading-[normal] text-center"
          >
            Get help with subscriptions and purchases.<Link
              href="https://www.apple.com/"
              class="text-[rgb(0,115,255)]"
            >Visit Apple Support.</Link>
          </Text>
          <Text
            class="text-xs text-[rgb(102,102,102)] my-5 leading-[normal] text-center"
          >
            Learn how to
            <Link href="https://www.apple.com/">manage your password preferences</Link>
            for iTunes, Apple Books, and App Store purchases.
          </Text>

          <Text
            class="text-xs text-[rgb(102,102,102)] my-5 leading-[normal] text-center"
          >
            You have the option to stop receiving email receipts for your
            subscription renewals. If you have opted out, you can still view
            your receipts in your account under Purchase History. To manage
            receipts or to opt in again, go to
            <Link href="https://www.apple.com/">Account Settings.</Link>
          </Text>
          <Section>
            <Row>
              <Column align="center" class="block mt-10">
                <Img
                  :src="`${baseUrl}/static/apple-logo.png`"
                  width="26"
                  height="26"
                  alt="Apple Card"
                />
              </Column>
            </Row>
          </Section>
          <Text
            class="m-0 mt-2 text-center text-[12px] leading-[24px] text-[rgb(102,102,102)]"
          >
            <Link href="https://www.apple.com/">Account Settings</Link> •
            <Link href="https://www.apple.com/">Terms of Sale</Link> •
            <Link href="https://www.apple.com/legal/privacy/">Privacy Policy </Link>
          </Text>
          <Text
            class="m-0 mt-[25px] text-center text-[12px] leading-[24px] text-[rgb(102,102,102)]"
          >
            Copyright © 2023 Apple Inc. <br />
            <Link href="https://www.apple.com/legal/">All rights reserved</Link>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
