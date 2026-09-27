<template>
  <section class="relative z-4 pt-20 pb-10 my-24 bg-background">
    <div
      class="relative overflow-hidden rounded-t-3xl border-t border-zinc-800 pt-16 sm:mask-[linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 max-w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-linear-to-l from-transparent via-green-12/50 via-50% to-transparent"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute z-1 -top-1 left-1/2 h-[600px] w-full max-w-[200px] -translate-x-1/2 -translate-y-1/2 md:max-w-[500px]"
        :style="{
          background:
            'conic-gradient(from 90deg at 50% 50%, #00000000 50%, #0a0a0a 50%),radial-gradient(rgba(37, 99, 235, 0.1) 0%, transparent 80%)',
        }"
      />
      <div class="flex flex-col items-center justify-center gap-14">
        <!--
          React Email's page quotes a person about React Email. Here it credits
          the project Vuemail ports instead, so that no one appears to endorse
          Vuemail who didn't.
        -->
        <figure class="relative flex w-full max-w-xl flex-col gap-10">
          <p
            class="text-center text-xl md:text-2xl font-medium leading-[1.4] tracking-[-0.01em] text-gradient text-balance"
          >
            Everything React Email does for React, from the components to the
            preview server and the editor, ported one to one to Vue.
          </p>
          <figcaption class="flex items-center justify-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-full bg-linear-to-tr from-transparent via-transparent to-neutral-300 p-px"
            >
              <span
                class="flex size-full items-center justify-center rounded-full bg-black"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="22"
                  viewBox="0 0 32 32"
                  width="22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 8h5.2L16 18.6 21.8 8H27L16 26.5 5 8Z" fill="#42D392" />
                  <path
                    d="M10.2 8h4l1.8 3.3L17.8 8h4L16 18.6 10.2 8Z"
                    fill="#0B6E4F"
                  />
                </svg>
              </span>
            </div>
            <div class="flex flex-col gap-1">
              <a
                class="text-lg font-medium leading-none text-neutral-300 transition-colors hover:text-white"
                href="https://github.com/resend/react-email"
                rel="noopener noreferrer"
                target="_blank"
              >
                A port of React Email
              </a>
              <span class="text-neutral-500 dark:text-neutral-400">
                By Resend, MIT licensed
              </span>
            </div>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
