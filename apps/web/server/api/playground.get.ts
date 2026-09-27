import { render } from 'vuemail';
import WelcomeEmail from '../../app/components/home/playground/CodeExample.vue';

// The email never changes, so it's rendered once
let html: Promise<string> | undefined;

/** The HTML of the example email the playground of the home page previews */
export default defineEventHandler(async (event) => {
  html ??= render(WelcomeEmail).catch((error: unknown) => {
    html = undefined;
    throw error;
  });

  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8');
  return await html;
});
