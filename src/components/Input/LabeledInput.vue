<script setup>
const props = defineProps({
  id: String,
  label: String,
  modelValue: String,
  placeholder: String,
  clearOnFocus: {
    type: Boolean,
    default: true,
  },
  length: {
    type: Object,
    default: () => ({
      min: 0,
      max: 20,
    }),
  },
  type: {
    type: String,
    default: 'text',
  },
  filterType: {
    type: String,
    default: 'none',
  },
})

const emits = defineEmits(['update:modelValue', 'input'])

const handleInput = (event) => {
  let val = event.target.value

  switch (props.filterType) {
    case 'numeric':
      val = val.replace(/\D/g, '').slice(0, props.length.max)
      break
    case 'text-only':
      val = val.replace(/[^a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, '').slice(0, props.length.max)
      break
    default:
      val = val.slice(0, props.length.max)
      break
  }

  event.target.value = val

  emits('update:modelValue', event.target.value)
  emits('input', event)
}
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="text-[11px] font-bold text-slate-500 ml-1">
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      @input="handleInput"
      :type="type"
      :placeholder="placeholder"
      :length="length"
      class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs text-center"
    />
  </div>
</template>
