<script setup>
defineProps({
    modelValue: { type: String, required: true }
})
defineEmits(['update:modelValue'])

const tabs = [
    { key: 'all', label: '전체' },
    { key: 'matching', label: '매칭' },
    { key: 'payment', label: '결제' },
    { key: 'event', label: '이벤트' }
]
</script>

<template>
    <div class="px-10 py-4 bg-white/50 border-b border-slate-50">
        <div class="max-w-4xl mx-auto flex gap-6">
            <button v-for="tab in tabs" :key="tab.key" @click="$emit('update:modelValue', tab.key)"
                class="text-sm pb-2 transition-all capitalize relative" :class="modelValue === tab.key
                    ? 'font-bold text-indigo-600 border-b-2 border-indigo-600'
                    : 'font-medium text-slate-400 hover:text-slate-600'">
                {{ tab.label }}
            </button>
        </div>
    </div>
</template>