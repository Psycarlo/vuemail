<script setup lang="ts">
import { h } from 'vue';

document.title = 'Vuemail';

// The same page Next.js shows for paths with nothing to show, with its own
// styles, which a template can't hold as a <style> tag
const NotFoundStyles = () =>
  h('style', {
    innerHTML:
      'body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}',
  });
</script>

<template>
  <div
    style="
      font-family:
        system-ui,
        &quot;Segoe UI&quot;,
        Roboto,
        Helvetica,
        Arial,
        sans-serif,
        &quot;Apple Color Emoji&quot;,
        &quot;Segoe UI Emoji&quot;;
      height: 100vh;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <div>
      <NotFoundStyles />
      <h1
        class="next-error-h1"
        style="
          display: inline-block;
          margin: 0 20px 0 0;
          padding: 0 23px 0 0;
          font-size: 24px;
          font-weight: 500;
          vertical-align: top;
          line-height: 49px;
        "
      >
        404
      </h1>
      <div style="display: inline-block">
        <h2 style="font-size: 14px; font-weight: 400; line-height: 49px; margin: 0">
          This page could not be found.
        </h2>
      </div>
    </div>
  </div>
</template>
