<template>
  <div class="relative flex w-full flex-col items-center gap-2">
    <div class="h-2 w-[50%] rounded-xs bg-slate-7" />
    <div class="flex w-[50%] gap-2">
      <div class="h-2 w-[36%] rounded-xs bg-slate-7" />
      <div class="relative h-2 w-[24%]">
        <div
          class="h-full w-full rounded-xs border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)] transition-all ease-[cubic-bezier(.42,0,.58,1.8)]"
        />
        <div
          class="absolute left-1/2 top-[calc(100%+1rem)] w-[calc(100%+1rem)] -translate-x-1/2 -rotate-5 opacity-0 transition-all ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:rotate-0 group-hover:scale-125 group-hover:opacity-100"
        >
          <div
            class="absolute left-1/2 -top-0.75 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[.125rem] bg-[#353B42]"
          />
          <div
            class="relative flex h-4 w-full items-center justify-center gap-0.5 rounded-sm bg-[#353B42] p-1"
          >
            <div class="h-full w-2 rounded-xs bg-black/40" />
            <div class="h-full w-2 rounded-xs bg-black/40" />
            <div class="h-full shrink grow basis-0 rounded-xs bg-black/40" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
