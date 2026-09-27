<template>
  <div
    class="group-hover:-skew-x-6 relative flex w-[40%] translate-y-3 flex-col gap-4 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 p-4 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]"
  >
    <div class="h-1 w-[84%] rounded-xs bg-slate-8" />
    <div
      class="flex w-[66%] items-start gap-2 transition-transform duration-100 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-0.5"
    >
      <div class="h-2 w-2 rounded-full bg-[#42B883]" />
      <div class="flex shrink grow basis-0 flex-col gap-1">
        <div class="h-1 w-full rounded-xs bg-slate-7" />
        <div class="h-1 w-3/4 rounded-xs bg-slate-5" />
      </div>
    </div>
    <div
      class="flex w-[66%] items-start gap-2 transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] group-hover:translate-x-1"
    >
      <div class="h-2 w-2 rounded-full bg-[#42B883]" />
      <div class="flex shrink grow basis-0 flex-col gap-1">
        <div class="h-1 w-full rounded-xs bg-slate-7" />
        <div class="h-1 w-3/4 rounded-xs bg-slate-5" />
      </div>
    </div>
  </div>
</template>
