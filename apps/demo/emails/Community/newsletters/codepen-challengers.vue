<script setup lang="ts">
// Get the full source code, including the theme and Tailwind config:
// https://github.com/psycarlo/vuemail/tree/main/apps/demo/emails

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
      <Body class="font-codepen bg-[#505050] m-0">
        <Preview>#CodePenChallenge: Cubes</Preview>
        <Section class="w-full bg-[#191919] m-0 mx-auto pb-[30px]">
          <Img
            class="mx-auto max-w-full"
            :src="`${baseUrl}/static/codepen-challengers.png`"
            :width="600"
            alt="codepen"
          />
        </Section>
        <Container class="mx-auto w-[648px] max-w-full">
          <Text
            class="bg-[#505050] text-center py-[10px] text-[13px] m-0 mb-4"
          >
            <Link class="text-white">View this Challenge on CodePen</Link>
          </Text>

          <Heading
            class="bg-[#f0d361] p-[30px] text-[#191919] font-normal mb-0"
          >
            <strong>This week:</strong> #CodePenChallenge:
            <Text class="text-[32px] mt-1 mb-0">Cubes</Text>
          </Heading>

          <Section class="m-0 bg-white py-0 px-6">
            <Text class="text-base">The Shape challenge continues!</Text>

            <Text class="text-base">
              Last week, we kicked things off with round shapes. We "rounded" up
              the Pens from week one in our
              <Link class="text-[#15c]">#CodePenChallenge: Round</Link>
              collection.
            </Text>

            <Text class="text-base">This week, we move on to cubes 🧊</Text>

            <Text class="text-base">
              Creating cubes in the browser is all about mastery of illusion.
              Take control of perspective and shadows and you can make the magic
              of 3D on a flat screen 🧙
            </Text>

            <Text class="text-base">
              This week is a fun chance to work on your CSS shape-building
              skills, or dig into a 3D JavaScript library like Three.js.
            </Text>

            <Text class="text-base">
              This week's starter template features an ice cube emoji to help
              inspire a "cool" idea for your Pen. As always, the template is
              just a jumping off point. Feel free to incorporate the 🧊 in your
              creation, add more elements, or freeze it out completely and start
              over from scratch!
            </Text>

            <Text
              class="text-base border-[6px] border-solid border-[#ebd473] p-5 m-0 mb-10"
            >
              💪 <strong>Your Challenge:</strong> <Link
                class="text-[#15c]"
              >create a Pen that includes cube shapes.</Link>
            </Text>

            <Img
              class="max-w-full"
              :src="`${baseUrl}/static/codepen-cube.png`"
              :width="600"
              alt="codepen"
            />

            <Section
              class="mt-10 mb-6 text-center bg-[#0b112a] text-white pt-[35px] pb-[30px] px-5 border-[6px] border-solid border-[#2138c6]"
            >
              <Img
                class="mx-auto mb-[30px]"
                :src="`${baseUrl}/static/codepen-pro.png`"
                :width="250"
                alt="codepen"
              />

              <Text>
                CodePen PRO combines a bunch of features that can help any
                front-end designer or developer at any experience level.
              </Text>

              <Button
                class="bg-[#2138c6] text-white border-0 text-[15px] leading-[18px] rounded p-3"
              >
                <strong>Learn More</strong>
              </Button>
            </Section>
          </Section>

          <Text class="bg-[#f5d247] p-[30px] text-lg leading-[1.5]">
            <strong>To participate:</strong> <Link class="text-[#15c]">Create a Pen →</Link> and tag it
            <Link class="text-[#15c]">
              <strong>codepenchallenge</strong>
            </Link>
            and<Link class="text-[#15c]">{{ ' ' }}<strong>cpc-cubes</strong></Link>.
            We'll be watching and gathering the Pens into a Collection, and
            sharing on <Link class="text-[#15c]">Twitter</Link> and
            <Link class="text-[#15c]">Instagram</Link> (Use the
            #CodePenChallenge tag on Twitter and Instagram as well).
          </Text>

          <Section class="m-0 bg-white px-6">
            <Row>
              <Column class="w-1/2 pr-[10px] align-top">
                <Text class="font-black text-lg leading-[1.1]">IDEAS!</Text>

                <Section
                  class="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#fff4c8] border border-solid border-[#f4d247]"
                >
                  🌟
                  <Text class="text-[13px] text-left">
                    This week we move from 2 dimensions to three! Maybe you
                    could exercise your
                    <Link class="text-[#15c]">perspective</Link> in CSS to
                    create a 3D cube. Or, you can try out creating 3D shapes in
                    JavaScript, using <Link class="text-[#15c]">WebGL</Link>
                    or building a
                    <Link class="text-[#15c]">Three.js scene</Link>.
                  </Text>
                </Section>

                <Section
                  class="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#fff4c8] border border-solid border-[#f4d247]"
                >
                  🌟
                  <Text class="text-[13px] text-left">
                    There's more to cubes than just six square sides. There are
                    variations on the cube that could be fun to play with this
                    week: <Link class="text-[#15c]">cuboid shapes</Link> are
                    hexahedrons with faces that aren't always squares. And if
                    you want to really push the boundaries of shape, consider
                    the 4 dimensional
                    <Link class="text-[#15c]">tesseract!</Link>
                  </Text>
                </Section>

                <Section
                  class="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#fff4c8] border border-solid border-[#f4d247]"
                >
                  🌟
                  <Text class="text-[13px] text-left">
                    Here's a mind-bending idea that can combine the round shapes
                    from week one with this week's cube theme:
                    <Link class="text-[#15c]">Spherical Cubes</Link> 😳
                    Solving longstanding mathematical mysteries is probably
                    outside the scope of a CodePen challenge, but you could use
                    front-end tools to explore fitting spheres into cubes, or
                    vice-versa.
                  </Text>
                </Section>
              </Column>
              <Column class="w-1/2 pl-[10px] align-top">
                <Text class="font-black text-lg leading-[1.1]">
                  RESOURCES!
                </Text>

                <Section
                  class="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]"
                >
                  📖
                  <Text class="text-[13px] text-left">
                    Learn all about
                    <Link class="text-[#15c]">How CSS Perspective Works</Link>
                    and how to build a 3D CSS cube from scratch in Amit Sheen's
                    in-depth tutorial for CSS-Tricks. Or, check out stunning
                    examples of WebGL cubes from Matthias Hurrle:
                    <Link class="text-[#15c]">Just Ice</Link> and
                    <Link class="text-[#15c]">Posing</Link>.
                  </Text>
                </Section>

                <Section
                  class="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]"
                >
                  📖
                  <Text class="text-[13px] text-left">
                    Want to go beyond the square cube? Draw inspiration from
                    EntropyReversed's
                    <Link class="text-[#15c]">Pulsating Tesseract</Link>,
                    Josetxu's
                    <Link class="text-[#15c]">Rainbow Cuboid Loader</Link>,
                    or Ana Tudor's
                    <Link class="text-[#15c]">Pure CSS cuboid jellyfish</Link>.
                  </Text>
                </Section>

                <Section
                  class="p-5 m-0 mb-5 rounded-[10px] text-[36px] text-center bg-[#d9f6ff] border border-solid border-[#92bfd0]"
                >
                  📖
                  <Text class="text-[13px] text-left">
                    Did that spherical cubes concept pique your interest?
                    Explore Ryan Mulligan's
                    <Link class="text-[#15c]">Cube Sphere</Link>, Munir
                    Safi's
                    <Link class="text-[#15c]">3D Sphere to Cube Animation With Virtual Trackball</Link>
                    and Ana Tudor's
                    <Link class="text-[#15c]">Infinitely unpack prism</Link>
                    for more mindbending cube concepts that test the boundaries
                    of how shapes interact with each other.
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          <Section class="mt-[40px] mb-[120px] text-center">
            <Button
              class="text-[26px] text-[#15c] bg-[#222] rounded font-bold py-[15px] px-[30px]"
            >
              Go to Challenge Page
            </Button>
          </Section>

          <Section class="bg-white text-[#505050] px-6 mb-12">
            <Text class="text-[13px]">
              You can adjust your
              <Link class="underline text-[#505050]">email preferences</Link>
              any time, or
              <Link class="underline text-[#505050]">instantly opt out</Link>
              of emails of this kind. Need help with anything? Hit up
              <Link class="underline text-[#505050]">support</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
