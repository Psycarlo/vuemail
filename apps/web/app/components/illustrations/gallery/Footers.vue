<template>
  <div
    class="md:group-hover:-skew-x-2 relative flex aspect-video w-[72%] translate-y-6 items-center gap-5 rounded-md bg-[#0F0F10] bg-linear-to-b from-transparent via-black/20 to-black/20 px-6 pt-2 pb-4 shadow-xs transition-transform duration-150 ease-[cubic-bezier(.42,0,.58,1.8)]"
  >
    <div class="flex w-[30%] flex-col gap-1">
      <div
        class="h-3 w-3 rounded-full border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)]"
      />
      <div class="mt-1 h-2 w-[90%] rounded-xs bg-slate-5" />
      <div class="h-3 w-[72%] rounded-xs bg-slate-5" />
    </div>
    <div class="flex shrink grow basis-0 flex-col gap-1">
      <div
        class="mt-1 h-2 w-[24%] rounded-xs border border-[#42D392] bg-[#42B883] shadow-[0px_0px_9px_4px_rgba(66,184,131,0.10)]"
      />
      <div class="mt-1 h-2 w-[72%] rounded-xs bg-slate-5" />
      <div class="w-[66%] rounded-xs bg-slate-5 p-1 pb-2">
        <div
          class="h-1 w-[80%] rounded-xs bg-black/30 transition-colors duration-150 ease-[cubic-bezier(.42,0,.58,1.8)] md:group-hover:bg-white/10"
        />
      </div>
    </div>
  </div>
</template>
