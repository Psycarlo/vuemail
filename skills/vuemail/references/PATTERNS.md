# Common Email Patterns

Real-world examples of common email templates using Vuemail with Tailwind CSS styling. Each example is a complete single file component for the `emails` folder.

## Table of Contents

- [Password Reset Email](#password-reset-email)
- [Order Confirmation with Product List](#order-confirmation-with-product-list)
- [Notification Email with Code Block](#notification-email-with-code-block)
- [Multi-Column Newsletter](#multi-column-newsletter)
- [Team Invitation Email](#team-invitation-email)

## Password Reset Email

```vue
<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
  pixelBasedPreset,
} from 'vuemail';

interface PasswordResetProps {
  resetUrl: string;
  email: string;
  expiryHours?: number;
}

const { resetUrl, email, expiryHours = 1 } = defineProps<PasswordResetProps>();

defineOptions({
  PreviewProps: {
    resetUrl: 'https://example.com/reset/abc123',
    email: 'user@example.com',
    expiryHours: 1,
  } satisfies PasswordResetProps,
});
</script>

<template>
  <Html lang="en">
    <Tailwind :config="{ presets: [pixelBasedPreset] }">
      <Head />
      <Body class="bg-gray-100 font-sans">
        <Preview>Reset your password - Action required</Preview>
        <Container class="mx-auto py-10 px-5 max-w-xl bg-white">
          <Heading class="text-2xl font-bold text-gray-800 mb-5">
            Reset Your Password
          </Heading>
          <Text class="text-base leading-7 text-gray-800 my-4">
            A password reset was requested for your account: <strong>{{ email }}</strong>
          </Text>
          <Text class="text-base leading-7 text-gray-800 my-4">
            Click the button below to reset your password. This link expires in
            {{ expiryHours }} hour{{ expiryHours > 1 ? 's' : '' }}.
          </Text>
          <Button
            :href="resetUrl"
            class="bg-red-600 text-white px-7 py-3.5 rounded block text-center font-bold my-6 no-underline box-border"
          >
            Reset Password
          </Button>
          <Hr class="border-solid border-gray-200 my-6" />
          <Text class="text-sm text-gray-500 leading-5 my-2">
            If you didn't request this, please ignore this email. Your password will remain unchanged.
          </Text>
          <Text class="text-sm text-gray-500 leading-5 my-2">
            For security, this link will only work once.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

## Order Confirmation with Product List

```vue
<script setup lang="ts">
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from 'vuemail';

interface Product {
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku?: string;
}

interface OrderConfirmationProps {
  orderNumber: string;
  orderDate: Date;
  items: Product[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

const {
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
} = defineProps<OrderConfirmationProps>();

defineOptions({
  PreviewProps: {
    orderNumber: '10234',
    orderDate: new Date(),
    items: [
      {
        name: 'Vintage Macintosh',
        price: 499.0,
        quantity: 1,
        image: 'https://via.placeholder.com/80',
        sku: 'MAC-001',
      },
      {
        name: 'Mechanical Keyboard',
        price: 149.99,
        quantity: 2,
        image: 'https://via.placeholder.com/80',
        sku: 'KEY-042',
      },
    ],
    subtotal: 798.98,
    shipping: 15.0,
    tax: 69.42,
    total: 883.4,
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'USA',
    },
  } satisfies OrderConfirmationProps,
});
</script>

<template>
  <Html lang="en">
    <Tailwind :config="{ presets: [pixelBasedPreset] }">
      <Head />
      <Body class="bg-gray-100 font-sans">
        <Preview>Order #{{ orderNumber }} confirmed - Thank you for your purchase!</Preview>
        <Container class="mx-auto py-10 px-5 max-w-xl">
          <Heading class="text-3xl font-bold text-gray-800 mb-2">
            Order Confirmed
          </Heading>
          <Text class="text-base text-gray-500 mb-6">Thank you for your order!</Text>

          <Section class="bg-gray-50 p-4 rounded mb-6">
            <Row>
              <Column>
                <Text class="text-xs text-gray-500 uppercase mb-1">Order Number</Text>
                <Text class="text-base font-bold text-gray-800 m-0">#{{ orderNumber }}</Text>
              </Column>
              <Column>
                <Text class="text-xs text-gray-500 uppercase mb-1">Order Date</Text>
                <Text class="text-base font-bold text-gray-800 m-0">
                  {{ new Date(orderDate).toLocaleDateString() }}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr class="border-solid border-gray-200 my-6" />

          <Heading as="h2" class="text-xl font-bold text-gray-800 my-4">
            Order Items
          </Heading>

          <Section v-for="(item, index) in items" :key="index" class="mb-4">
            <Row>
              <Column class="w-20 align-top">
                <Img
                  :src="item.image"
                  :alt="item.name"
                  width="80"
                  height="80"
                  class="rounded border border-solid border-gray-200"
                />
              </Column>
              <Column class="align-top pl-4">
                <Text class="text-base font-bold text-gray-800 m-0 mb-1">{{ item.name }}</Text>
                <Text v-if="item.sku" class="text-sm text-gray-400 m-0 mb-2">SKU: {{ item.sku }}</Text>
                <Text class="text-sm text-gray-500 m-0">
                  Quantity: {{ item.quantity }} × ${{ item.price.toFixed(2) }}
                </Text>
              </Column>
              <Column class="w-24 text-right align-top">
                <Text class="text-base font-bold text-gray-800 m-0">
                  ${{ (item.quantity * item.price).toFixed(2) }}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr class="border-solid border-gray-200 my-6" />

          <Section class="mt-6">
            <Row>
              <Column><Text class="text-sm text-gray-500 my-2">Subtotal</Text></Column>
              <Column class="text-right">
                <Text class="text-sm text-gray-800 my-2">${{ subtotal.toFixed(2) }}</Text>
              </Column>
            </Row>
            <Row>
              <Column><Text class="text-sm text-gray-500 my-2">Shipping</Text></Column>
              <Column class="text-right">
                <Text class="text-sm text-gray-800 my-2">${{ shipping.toFixed(2) }}</Text>
              </Column>
            </Row>
            <Row>
              <Column><Text class="text-sm text-gray-500 my-2">Tax</Text></Column>
              <Column class="text-right">
                <Text class="text-sm text-gray-800 my-2">${{ tax.toFixed(2) }}</Text>
              </Column>
            </Row>
            <Hr class="border-solid border-gray-200 my-3" />
            <Row>
              <Column><Text class="text-lg font-bold text-gray-800 my-2">Total</Text></Column>
              <Column class="text-right">
                <Text class="text-lg font-bold text-gray-800 my-2">${{ total.toFixed(2) }}</Text>
              </Column>
            </Row>
          </Section>

          <Hr class="border-solid border-gray-200 my-6" />

          <Heading as="h2" class="text-xl font-bold text-gray-800 my-4">
            Shipping Address
          </Heading>
          <Section class="bg-gray-50 p-4 rounded">
            <Text class="text-sm text-gray-800 my-1">{{ shippingAddress.name }}</Text>
            <Text class="text-sm text-gray-800 my-1">{{ shippingAddress.street }}</Text>
            <Text class="text-sm text-gray-800 my-1">
              {{ shippingAddress.city }}, {{ shippingAddress.state }} {{ shippingAddress.zip }}
            </Text>
            <Text class="text-sm text-gray-800 my-1">{{ shippingAddress.country }}</Text>
          </Section>

          <Text class="text-sm text-gray-500 mt-8">
            Questions about your order? Reply to this email and we'll help you out.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

`new Date(orderDate)` also formats the date when the preview app turns it into a string, which happens once you edit the props there.

## Notification Email with Code Block

```vue
<script setup lang="ts">
import { computed } from 'vue';
import {
  Body,
  CodeBlock,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  dracula,
  pixelBasedPreset,
} from 'vuemail';

interface NotificationProps {
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  logData?: string;
  actionUrl?: string;
  actionLabel?: string;
}

const {
  title,
  message,
  severity,
  timestamp,
  logData,
  actionUrl,
  actionLabel = 'View Details',
} = defineProps<NotificationProps>();

defineOptions({
  PreviewProps: {
    title: 'Deployment Failed',
    message:
      'The deployment to production environment has failed. Please review the logs and take corrective action.',
    severity: 'error',
    timestamp: new Date(),
    logData: `{
  "error": "Build failed",
  "exit_code": 1,
  "duration": "2m 34s",
  "commit": "abc123def"
}`,
    actionUrl: 'https://example.com/deployments/123',
    actionLabel: 'View Deployment',
  } satisfies NotificationProps,
});

const severityColors = {
  info: 'bg-sky-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  success: 'bg-green-500',
};

const formattedTimestamp = computed(() =>
  new Date(timestamp).toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }),
);
</script>

<template>
  <Html lang="en">
    <Tailwind :config="{ presets: [pixelBasedPreset] }">
      <Head />
      <Body class="bg-gray-100 font-mono">
        <Preview>{{ title }} - {{ severity }}</Preview>
        <Container
          class="mx-auto max-w-xl bg-white border border-solid border-gray-200 rounded overflow-hidden"
        >
          <Section :class="['h-1 w-full', severityColors[severity]]" />

          <Heading class="text-2xl font-bold text-gray-800 mx-6 mt-6 mb-4">
            {{ title }}
          </Heading>

          <Text
            :class="[
              'inline-block px-3 py-1 text-xs font-bold text-white rounded-full mx-6 mb-4',
              severityColors[severity],
            ]"
          >
            {{ severity.toUpperCase() }}
          </Text>

          <Text class="text-base leading-6 text-gray-800 mx-6 mb-4">
            {{ message }}
          </Text>

          <Text class="text-sm text-gray-500 mx-6 mb-6">
            {{ formattedTimestamp }}
          </Text>

          <template v-if="logData">
            <Hr class="border-solid border-gray-200 my-6" />
            <Heading as="h2" class="text-lg font-bold text-gray-800 mx-6 my-4">
              Log Details
            </Heading>
            <div class="overflow-auto mx-6">
              <CodeBlock :code="logData" language="json" :theme="dracula" />
            </div>
          </template>

          <template v-if="actionUrl">
            <Hr class="border-solid border-gray-200 my-6" />
            <Link
              :href="actionUrl"
              :class="[
                'inline-block px-6 py-3 text-base font-bold text-white rounded no-underline mx-6 mb-6',
                severityColors[severity],
              ]"
            >
              {{ actionLabel }}
            </Link>
          </template>

          <Hr class="border-solid border-gray-200 my-6" />
          <Text class="text-xs text-gray-500 mx-6 mb-6">
            This is an automated notification. Please do not reply to this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

Tailwind classes are compiled while the email renders, so classes picked at runtime, like the ones in `severityColors`, work.

## Multi-Column Newsletter

```vue
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
  pixelBasedPreset,
} from 'vuemail';

interface Article {
  title: string;
  excerpt: string;
  image: string;
  url: string;
  author: string;
  date: string;
}

interface NewsletterProps {
  articles: Article[];
  unsubscribeUrl: string;
}

const { articles, unsubscribeUrl } = defineProps<NewsletterProps>();

defineOptions({
  PreviewProps: {
    articles: [
      {
        title: 'The Future of Web Development in 2026',
        excerpt:
          'Exploring the latest trends and technologies shaping modern web development.',
        image: 'https://via.placeholder.com/600x300',
        url: 'https://example.com/article-1',
        author: 'Jane Doe',
        date: 'Jan 15, 2026',
      },
      {
        title: 'Vue Composables Explained',
        excerpt: 'A deep dive into composables and their benefits.',
        image: 'https://via.placeholder.com/280x140',
        url: 'https://example.com/article-2',
        author: 'John Smith',
        date: 'Jan 14, 2026',
      },
      {
        title: 'Building Accessible Web Apps',
        excerpt: 'Best practices for creating inclusive digital experiences.',
        image: 'https://via.placeholder.com/280x140',
        url: 'https://example.com/article-3',
        author: 'Sarah Johnson',
        date: 'Jan 13, 2026',
      },
    ],
    unsubscribeUrl: 'https://example.com/unsubscribe',
  } satisfies NewsletterProps,
});

const featuredArticle = computed(() => articles[0]);

// The next four articles, two per row
const articleRows = computed(() => {
  const moreArticles = articles.slice(1, 5);
  const rows: Article[][] = [];
  for (let index = 0; index < moreArticles.length; index += 2) {
    rows.push(moreArticles.slice(index, index + 2));
  }
  return rows;
});
</script>

<template>
  <Html lang="en">
    <Tailwind :config="{ presets: [pixelBasedPreset] }">
      <Head />
      <Body class="bg-white font-sans">
        <Preview>Your weekly roundup of the latest articles</Preview>
        <Container class="mx-auto max-w-xl">
          <!-- Header -->
          <Section class="pt-10 px-5 pb-5 text-center">
            <Img
              src="https://via.placeholder.com/150x50?text=Logo"
              alt="Company Logo"
              width="150"
              height="50"
            />
          </Section>

          <Heading class="text-3xl font-bold text-gray-900 mx-5 mb-4 text-center">
            This Week's Highlights
          </Heading>
          <Text class="text-base leading-6 text-gray-500 mx-5 mb-6 text-center">
            Here are the top articles from this week. Enjoy your reading!
          </Text>

          <Hr class="border-solid border-gray-200 mx-5 my-8" />

          <!-- Featured Article -->
          <Section v-if="featuredArticle" class="px-5">
            <Img
              :src="featuredArticle.image"
              :alt="featuredArticle.title"
              width="600"
              class="w-full rounded-lg mb-4"
            />
            <Heading as="h2" class="text-2xl font-bold text-gray-900 my-4">
              {{ featuredArticle.title }}
            </Heading>
            <Text class="text-base leading-6 text-gray-500 my-4">
              {{ featuredArticle.excerpt }}
            </Text>
            <Text class="text-sm text-gray-400 my-2">
              By {{ featuredArticle.author }} • {{ featuredArticle.date }}
            </Text>
            <Button
              :href="featuredArticle.url"
              class="bg-blue-600 text-white px-6 py-3 rounded font-bold inline-block no-underline box-border"
            >
              Read More
            </Button>
          </Section>

          <Hr class="border-solid border-gray-200 mx-5 my-8" />

          <!-- Two-Column Articles -->
          <template v-if="articleRows.length > 0">
            <Heading as="h2" class="text-2xl font-bold text-gray-900 mx-5 my-4">
              More From This Week
            </Heading>
            <Section
              v-for="(row, rowIndex) in articleRows"
              :key="rowIndex"
              class="px-5 mb-6"
            >
              <Row>
                <Column
                  v-for="article in row"
                  :key="article.url"
                  class="w-1/2 align-top px-1"
                >
                  <Img
                    :src="article.image"
                    :alt="article.title"
                    width="280"
                    class="w-full rounded mb-3"
                  />
                  <Heading as="h3" class="text-lg font-bold text-gray-900 my-3">
                    {{ article.title }}
                  </Heading>
                  <Text class="text-sm leading-5 text-gray-500 my-2">
                    {{ article.excerpt }}
                  </Text>
                  <Link
                    :href="article.url"
                    class="text-sm text-blue-600 no-underline font-semibold"
                  >
                    Read article →
                  </Link>
                </Column>
              </Row>
            </Section>
          </template>

          <Hr class="border-solid border-gray-200 mx-5 my-8" />

          <!-- Footer -->
          <Section class="bg-gray-50 p-8 mt-8 text-center">
            <Text class="text-sm text-gray-500 my-2">
              You're receiving this because you subscribed to our newsletter.
            </Text>
            <Link
              :href="unsubscribeUrl"
              class="text-sm text-blue-600 underline block my-2"
            >
              Unsubscribe from this list
            </Link>
            <Text class="text-sm text-gray-500 my-2">
              © 2026 Company Name. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

## Team Invitation Email

```vue
<script setup lang="ts">
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from 'vuemail';

interface TeamInvitationProps {
  inviterName: string;
  inviterEmail: string;
  teamName: string;
  role: string;
  inviteUrl: string;
  expiryDays: number;
}

const { inviterName, inviterEmail, teamName, role, inviteUrl, expiryDays } =
  defineProps<TeamInvitationProps>();

defineOptions({
  PreviewProps: {
    inviterName: 'John Doe',
    inviterEmail: 'john@example.com',
    teamName: 'Acme Corp Engineering',
    role: 'Developer',
    inviteUrl: 'https://example.com/invite/abc123',
    expiryDays: 7,
  } satisfies TeamInvitationProps,
});
</script>

<template>
  <Html lang="en">
    <Tailwind :config="{ presets: [pixelBasedPreset] }">
      <Head />
      <Body class="bg-gray-100 font-sans">
        <Preview>You've been invited to join {{ teamName }}</Preview>
        <Container class="mx-auto py-10 px-5 max-w-xl bg-white">
          <Heading class="text-3xl font-bold text-gray-800 text-center mb-6">
            You're Invited!
          </Heading>

          <Text class="text-base leading-7 text-gray-800 my-4">
            <strong>{{ inviterName }}</strong> ({{ inviterEmail }}) has invited you to join the
            <strong>{{ teamName }}</strong> team.
          </Text>

          <Section class="bg-gray-50 p-5 rounded border border-solid border-gray-200 my-6">
            <Text class="text-xs text-gray-500 uppercase font-bold mb-2">Role</Text>
            <Text class="text-lg font-bold text-gray-800 m-0">{{ role }}</Text>
          </Section>

          <Text class="text-base leading-7 text-gray-800 my-4">
            Click the button below to accept the invitation and get started.
          </Text>

          <Button
            :href="inviteUrl"
            class="bg-green-600 text-white px-7 py-3.5 rounded block text-center font-bold text-base my-6 no-underline box-border"
          >
            Accept Invitation
          </Button>

          <Hr class="border-solid border-gray-200 my-6" />

          <Text class="text-sm text-gray-500 leading-5 my-2">
            This invitation will expire in {{ expiryDays }} day{{ expiryDays > 1 ? 's' : '' }}.
          </Text>
          <Text class="text-sm text-gray-500 leading-5 my-2">
            If you weren't expecting this invitation, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
```

These patterns demonstrate:
- Tailwind CSS utility classes for styling
- Proper component usage with `pixelBasedPreset`
- TypeScript typing with `defineProps<Props>()`
- Preview props for testing with `defineOptions({ PreviewProps })`
- Responsive layouts
- Common email scenarios
