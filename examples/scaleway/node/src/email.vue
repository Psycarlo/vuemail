<script setup lang="ts">
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@vuemaildev/vuemail';

interface EmailProps {
  url: string;
  username: string;
  invitedByUsername: string;
  teamName: string;
  invitedByEmail: string;
}

const { invitedByUsername, username, teamName, invitedByEmail } =
  defineProps<EmailProps>();

const previewText = `Production INCIDENT ${invitedByUsername} on Scaleway`;
</script>

<template>
  <Html lang="en">
    <Head />
    <Body>
      <Preview>{{ previewText }}</Preview>
      <Container>
        <Section>
          <Img
            src="https://www-uploads.scaleway.com/Logos_Image_4ce23fe78a.webp"
            width="400"
            height="200"
            alt="Scaleway"
          />
        </Section>
        <Heading>
          Join <strong>{{ teamName }}</strong> on <strong>Scaleway</strong>
        </Heading>
        <Text>Hello {{ username }},</Text>
        <Text>
          <strong>{{ invitedByUsername }}</strong> (<Link :href="`mailto:${invitedByEmail}`">{{ invitedByEmail }}</Link>) has
          invited you to the <strong>{{ teamName }}</strong> team on
          <strong>Scaleway</strong>.
        </Text>
      </Container>
    </Body>
  </Html>
</template>
