<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui';
import { ref } from 'vue';
import { toolsDemoEmailHtml } from '~/utils/home/tools-demo';
import { vSrcdoc } from '~/utils/srcdoc';

type Tool = {
  title: string;
  value: string;
  description: string;
  status?: 'warning' | 'error';
};

const tools: Tool[] = [
  {
    title: 'Linter',
    value: 'linter',
    description:
      "Analyze every link in your email to check that they're valid.",
    status: 'warning',
  },
  {
    title: 'Compatibility Checker',
    value: 'compatibility',
    description:
      'See how well your HTML/CSS is supported across popular mail clients.',
    status: 'error',
  },
  {
    title: 'Spam Score',
    value: 'spam',
    description:
      'Analyze your email content using a robust scoring framework to determine if the email is likely to be marked as spam.',
  },
];

const activeTool = ref('linter');
</script>

<template>
  <div
    class="flex max-md:flex-col max-md:items-center max-md:justify-center justify-between gap-y-8 md:gap-x-16 lg:gap-x-32"
  >
    <div class="flex flex-col shrink-0 text-start space-y-2 md:space-y-5">
      <button
        v-for="tool in tools"
        :key="tool.title"
        type="button"
        class="group relative px-4 py-3 md:p-6 max-w-md cursor-pointer text-start outline-hidden rounded-[20px] focus-visible:ring-slate-8 focus-visible:ring-1"
        :data-active="tool.value === activeTool"
        @click="activeTool = tool.value"
      >
        <AnimatePresence :initial="false">
          <Motion
            v-if="tool.value === activeTool"
            layout-id="background"
            :class="[
              'absolute inset-0 -z-10 bg-[#17171799] rounded-[20px]',
              'shadow-[0px_32px_64px_-16px_transparent,0px_16px_32px_-8px_transparent,0px_8px_16px_-4px_transparent,0px_4px_8px_-2px_transparent,0px_-8px_16px_-1px_transparent,0px_2px_4px_-1px_transparent,0px_0px_0px_1px_transparent,inset_0px_0px_0px_1px_#ffffff1a,inset_0px_1px_0px_#ffffff26]',
            ]"
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ type: 'spring', duration: 0.3, bounce: 0 }"
            @focus="activeTool = tool.value"
          />
        </AnimatePresence>

        <div class="relative flex flex-col gap-1.5">
          <UiHeading
            as="h3"
            size="5"
            weight="medium"
            class="text-white/80 group-data-[active='true']:text-white group-hover:text-white transition-colors"
          >
            {{ tool.title }}
          </UiHeading>
          <UiText
            size="4"
            class="text-balance group-data-[active='true']:text-white/80 group-hover:text-white/80 transition-colors"
          >
            {{ tool.description }}
          </UiText>
        </div>
      </button>
    </div>

    <div
      data-tool-scroll-target
      class="w-full relative border border-slate-4 grow rounded-2xl sm:rounded-3xl overflow-hidden [overflow-anchor:none] -order-1 md:order-0"
    >
      <div
        class="relative z-2 flex items-center justify-between bg-black border-b border-slate-6 h-14 px-4"
      >
        <div class="flex items-center gap-1.5 sm:gap-2 h-full">
          <div
            v-for="index in 3"
            :key="index"
            class="size-2.5 sm:size-3 rounded-full bg-zinc-800"
          />
        </div>
        <div
          aria-hidden="true"
          class="absolute top-0 right-0 h-px w-96 bg-linear-to-l from-transparent via-green-12/30 via-50% to-transparent"
        />
      </div>

      <div>
        <div
          class="md:absolute bottom-0 z-1 min-w-full left-6 md:border-l border-slate-6 overflow-hidden [overflow-anchor:none]"
        >
          <div
            class="flex p-4 bg-gray-200 h-[260px] overflow-hidden [overflow-anchor:none]"
          >
            <div
              class="relative mx-auto my-auto -translate-y-[76%] sm:translate-x-[10%] [overflow-anchor:none]"
            >
              <div
                class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-2 cursor-w-resize p-2"
              >
                <div class="h-8 w-1 rounded-md bg-black/30" />
              </div>
              <div
                class="-translate-x-full -translate-y-1/2 absolute top-1/2 left-full cursor-e-resize p-2"
              >
                <div class="h-8 w-1 rounded-md bg-black/30" />
              </div>
              <div
                class="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 cursor-n-resize p-2"
              >
                <div class="h-1 w-8 rounded-md bg-black/30" />
              </div>
              <div
                class="-translate-x-1/2 -translate-y-1/2 absolute top-full left-1/2 cursor-s-resize p-2"
              >
                <div class="h-1 w-8 rounded-md bg-black/30" />
              </div>
              <iframe
                class="max-h-full rounded-xl bg-white [color-scheme:auto]"
                v-srcdoc="toolsDemoEmailHtml"
                title="aws-verify-email.vue"
                style="width: 600px; height: 740px"
                tabindex="-1"
              />
            </div>
          </div>
          <TabsRoot v-model="activeTool">
            <TabsList
              class="relative z-1 bg-black px-4 flex gap-4 border-b border-slate-6 h-10 w-full shrink-0"
            >
              <TabsTrigger
                v-for="tool in tools"
                :key="tool.title"
                :value="tool.value"
                :class="[
                  'relative capitalize px-1 text-sm font-normal transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-slate-7',
                  tool.value === activeTool
                    ? 'text-green-11'
                    : 'text-slate-10 hover:text-slate-12',
                ]"
              >
                {{ tool.value }}
                <AnimatePresence :initial="false">
                  <Motion
                    v-if="tool.value === activeTool"
                    layout-id="active-tab-tool"
                    class="-bottom-px absolute rounded-xs left-0 w-full bg-green-11 h-px"
                    :transition="{
                      type: 'spring',
                      duration: 0.3,
                      bounce: 0,
                    }"
                  />
                </AnimatePresence>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              v-for="tool in tools"
              :key="tool.title"
              :value="tool.value"
              class="relative z-10 bg-black pl-4 pr-9 pt-3 h-32 max-md:overflow-x-auto outline-hidden"
            >
              <div
                v-if="tool.value === 'spam'"
                class="flex flex-col items-center justify-center pt-6"
              >
                <div class="relative mb-7 flex items-center justify-center">
                  <HomeToolsSuccessIcon />
                </div>
                <h3 class="text-slate-12 font-medium text-base mb-1">10/10</h3>
                <p
                  class="text-slate-11 text-sm text-center max-w-[320px] min-w-[320px]"
                >
                  Your email is clean of abuse indicators.
                </p>
              </div>
              <div
                v-else
                class="relative text-left text-slate-10 text-sm max-md:min-w-max"
              >
                <div
                  class="border-b border-slate-6 last:border-b-0 group/result flex items-center gap-5 max-sm:-ml-4 max-sm:-mr-9 max-sm:pl-4 max-sm:pr-4"
                  :data-status="tool.status"
                >
                  <div class="py-1.5 font-normal max-w-[160px] min-w-[160px]">
                    <span
                      class="flex uppercase gap-2 items-center group-data-[status=error]/result:text-red-400 group-data-[status=warning]/result:text-orange-300"
                    >
                      <HomeToolsWarningIcon />
                      {{
                        tool.value === 'linter' ? 'fetch attempt' : 'display:flex'
                      }}
                    </span>
                  </div>
                  <div class="py-1.5 font-normal grow min-w-0">
                    <div
                      v-if="tool.value === 'linter'"
                      class="flex items-center gap-2"
                    >
                      <span class="shrink-0">
                        There was a redirect, the content may have been moved
                      </span>
                      <span
                        class="text-ellipsis overflow-hidden whitespace-nowrap min-w-0 shrink"
                      >
                        https://amazon.com
                      </span>
                    </div>
                    <div v-else class="flex items-center gap-2">
                      <span class="shrink-0">Not supported in Outlook</span>
                      <span
                        class="text-ellipsis overflow-hidden whitespace-nowrap underline underline-offset-2 decoration-slate-9 min-w-0 shrink"
                      >
                        More ↗
                      </span>
                    </div>
                  </div>
                  <span
                    v-if="tool.value === 'compatibility'"
                    class="py-1.5 font-mono text-slate-11 appearance-none underline mx-2 max-sm:hidden"
                  >
                    L164
                  </span>
                </div>
                <div
                  class="border-b border-slate-6 last:border-b-0 group/result flex items-center gap-5 max-sm:-ml-4 max-sm:-mr-4 max-sm:pl-4 max-sm:pr-4"
                  :data-status="tool.status"
                >
                  <div class="py-1.5 font-normal max-w-[160px] min-w-[160px]">
                    <span
                      class="flex uppercase gap-2 items-center group-data-[status=error]/result:text-red-400 group-data-[status=warning]/result:text-orange-300"
                    >
                      <HomeToolsWarningIcon />
                      {{
                        tool.value === 'linter'
                          ? 'fetch attempt'
                          : 'target attribute'
                      }}
                    </span>
                  </div>
                  <div class="py-1.5 font-normal grow min-w-0">
                    <div
                      v-if="tool.value === 'linter'"
                      class="flex items-center gap-2"
                    >
                      <span class="shrink-0">
                        There was a redirect, the content may have been moved
                      </span>
                      <span
                        class="text-ellipsis overflow-hidden whitespace-nowrap min-w-0 shrink"
                      >
                        https://amazon.com
                      </span>
                    </div>
                    <div v-else class="flex items-center gap-2">
                      <span class="shrink-0">
                        Not supported in Gmail, Outlook, Yahoo! Mail
                      </span>
                      <span
                        class="text-ellipsis overflow-hidden whitespace-nowrap underline underline-offset-2 decoration-slate-9 min-w-0 shrink"
                      >
                        More ↗
                      </span>
                    </div>
                  </div>
                  <span
                    v-if="tool.value === 'compatibility'"
                    class="py-1.5 font-mono text-slate-11 appearance-none underline mx-2 max-sm:hidden"
                  >
                    L71
                  </span>
                </div>
              </div>
            </TabsContent>
          </TabsRoot>
        </div>
        <img
          src="/static/resend-wallpaper.jpg"
          alt="Linter"
          class="absolute inset-0 -z-1 w-full h-full object-cover object-bottom-left"
          width="1000"
          height="1000"
          decoding="async"
          loading="lazy"
          style="color: transparent"
        />
      </div>
    </div>
  </div>
</template>
