<script lang="ts">
// defineOptions() is hoisted out of <script setup>, so what the
// PreviewProps use is declared here
interface VercelInviteUserEmailProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';
</script>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'vuemail';

const {
  username,
  userImage,
  invitedByUsername,
  invitedByEmail,
  teamName,
  teamImage,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
} = defineProps<VercelInviteUserEmailProps>();

defineOptions({
  PreviewProps: {
    username: 'alanturing',
    userImage: `${baseUrl}/static/vercel-user.png`,
    invitedByUsername: 'Alan',
    invitedByEmail: 'alan.turing@example.com',
    teamName: 'Enigma',
    teamImage: `${baseUrl}/static/vercel-team.png`,
    inviteLink: 'https://vercel.com/teams/invite/foo',
    inviteFromIp: '204.13.186.218',
    inviteFromLocation: 'São Paulo, Brazil',
  } satisfies VercelInviteUserEmailProps,
});

const previewText = computed(() => `Join ${invitedByUsername} on Vercel`);
</script>

<template>
  <Html>
    <Head />
    <Tailwind>
      <Body class="mx-auto my-auto bg-white px-2 font-sans">
        <Preview>{{ previewText }}</Preview>
        <Container
          class="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]"
        >
          <Section class="mt-[32px]">
            <Img
              :src="`${baseUrl}/static/vercel-logo.png`"
              width="40"
              height="37"
              alt="Vercel"
              class="mx-auto my-0"
            />
          </Section>
          <Heading
            class="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black"
          >
            Join <strong>{{ teamName }}</strong> on <strong>Vercel</strong>
          </Heading>
          <Text class="text-[14px] text-black leading-[24px]">
            Hello {{ username }},
          </Text>
          <Text class="text-[14px] text-black leading-[24px]">
            <strong>{{ invitedByUsername }}</strong> (<Link
              :href="`mailto:${invitedByEmail}`"
              class="text-blue-600 no-underline"
              >{{ invitedByEmail }}</Link
            >) has invited you to the <strong>{{ teamName }}</strong> team on
            <strong>Vercel</strong>.
          </Text>
          <Section>
            <Row>
              <Column align="right">
                <Img
                  class="rounded-full"
                  :src="userImage"
                  width="64"
                  height="64"
                />
              </Column>
              <Column align="center">
                <Img
                  :src="`${baseUrl}/static/vercel-arrow.png`"
                  width="12"
                  height="9"
                  alt="invited you to"
                />
              </Column>
              <Column align="left">
                <Img
                  class="rounded-full"
                  :src="teamImage"
                  width="64"
                  height="64"
                />
              </Column>
            </Row>
          </Section>
          <Section class="mt-[32px] mb-[32px] text-center">
            <Button
              class="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
              :href="inviteLink"
            >
              Join the team
            </Button>
          </Section>
          <Text class="text-[14px] text-black leading-[24px]">
            or copy and paste this URL into your browser:
            <Link :href="inviteLink" class="text-blue-600 no-underline">{{
              inviteLink
            }}</Link>
          </Text>
          <Hr
            class="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid"
          />
          <Text class="text-[#666666] text-[12px] leading-[24px]">
            This invitation was intended for
            <span class="text-black">{{ username }}</span>. This invite was
            sent from <span class="text-black">{{ inviteFromIp }}</span>
            located in
            <span class="text-black">{{ inviteFromLocation }}</span>. If you
            were not expecting this invitation, you can ignore this email. If
            you are concerned about your account's safety, please reply to
            this email to get in touch with us.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
