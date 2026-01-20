<script setup>
/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import { Navigation2 } from 'lucide-vue-next'

/**
 * ==============================================================================
 * 2. CONFIG & STORES
 * ==============================================================================
 */
defineProps({
  isDriving: Boolean,
  title: String,
  subTitle: String,
  eta: String,
  fare: Number,
})
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 bg-[#1e293b]/95 backdrop-blur-xl p-4 flex justify-between items-center shadow-2xl z-40 border-b border-white/5 transition-all duration-500 pt-safe"
    :class="isDriving ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
        <Navigation2 class="w-5 h-5 text-white rotate-45" />
      </div>
      <div>
        <h2 class="text-lg font-black text-white leading-tight">{{ title }}</h2>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-emerald-400 font-bold">{{ subTitle }}</span>
          <span class="text-slate-500">|</span>
          <span class="text-indigo-300 font-bold">{{ eta }}</span>
        </div>
      </div>
    </div>

    <div class="text-right">
      <div class="text-2xl font-black text-white font-mono tracking-tight">{{ fare.toLocaleString() }}</div>
      <div class="text-[10px] text-slate-400 font-bold">EXPECTED FARE</div>
    </div>
  </header>
</template>

<style scoped>
.pt-safe {
  padding-top: max(1rem, env(safe-area-inset-top));
}
</style>