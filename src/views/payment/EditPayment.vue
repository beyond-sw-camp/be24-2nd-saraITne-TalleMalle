<script setup>
import { ref, reactive, computed } from 'vue'
import { CreditCard, X, ShieldCheck, Check } from 'lucide-vue-next'
import LabeledInput from '@/components/Input/LabeledInput.vue'

// 카드 정보
const cardNum = ref({ p1: '', p2: '', p3: '', p4: '' })
const expiry = reactive({
  month: '',
  year: '',
})
const cvc = ref('')
const ownerName = ref('')

const emits = defineEmits(['close'])

// 화면 표시용 (Computed)
const displayCardNum = computed(() => {
  const n = cardNum.value
  return `${n.p1.padEnd(4, '•')} ${n.p2 ? '••••' : '••••'} ${n.p3 ? '••••' : '••••'} ${n.p4.padEnd(4, '•')}`
})

const handleCardNum = (part, event, next) => {
  let val = event.target.value
  cardNum.value[part] = val
  if (val.length === 4 && next) {
    document.getElementById(next)?.focus()
  }
}

const handleExpiry = (event, next) => {
  let val = event.target.value

  if (val.length === 2 && next) {
    document.getElementById(next)?.focus()
  }
}

const handleCvc = (event, next) => {
  let val = event.target.value
  if (val.length === 3 && next) {
    document.getElementById(next)?.focus()
  }
}

const handleSubmit = () => {
  if (
    cardNum.value.p1.length < 4 ||
    expiry.month.length < 2 ||
    expiry.year.length < 2 ||
    cvc.value.length < 3 ||
    !ownerName.value
  ) {
    alert('모든 정보를 입력해주세요.')
    return
  }
  alert('카드가 등록되었습니다!')
  handleClose()
}

const handleClose = () => {
  emits('close')
}
</script>

<template>
  <div
    class="bg-white/90 backdrop-blur w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col h-[85vh] md:h-auto"
  >
    <div
      class="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white/50 sticky top-0 z-20"
    >
      <div class="flex items-center gap-2.5">
        <div class="p-1.5 bg-indigo-50 rounded-lg">
          <CreditCard class="w-4 h-4 text-indigo-600" />
        </div>
        <h1 class="text-lg font-bold text-slate-900 tracking-tight">결제 수단 추가</h1>
      </div>
      <button @click="handleClose" class="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
        <X class="w-4 h-4 text-slate-400" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto custom-scroll p-6 space-y-6">
      <div class="flex justify-center">
        <div
          class="w-full max-w-[280px] aspect-[1.58/1] rounded-[1rem] p-5 text-white shadow-lg relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600"
        >
          <div class="flex flex-col h-full justify-between relative z-10">
            <div class="flex justify-between items-start">
              <div class="w-8 h-6 bg-yellow-400/80 rounded-sm shadow-inner"></div>
              <span class="text-[10px] font-black italic opacity-70">CARD</span>
            </div>
            <div class="space-y-2">
              <div class="text-base font-mono tracking-[0.15em] drop-shadow-md">
                {{ displayCardNum }}
              </div>
              <div class="flex justify-between items-end">
                <div>
                  <p class="text-[7px] uppercase tracking-wider opacity-60">Holder</p>
                  <p class="text-[10px] font-bold truncate max-w-[100px]">
                    {{ ownerName.toUpperCase() || 'NAME HERE' }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-[7px] uppercase tracking-wider opacity-60">Expires</p>
                  <p class="text-[10px] font-bold">
                    {{ `${expiry.month}/${expiry.year}` || 'MM/YY' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          ></div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="space-y-1.5">
          <div class="grid grid-cols-4 gap-2 items-end">
            <LabeledInput
              id="p1"
              v-model="cardNum.p1"
              label="카드 번호"
              placeholder="0000"
              filterType="numeric"
              :length="{ max: 4 }"
              @input="handleCardNum('p1', $event, 'p2')"
            />
            <LabeledInput
              id="p2"
              v-model="cardNum.p2"
              label=""
              placeholder="***"
              filterType="numeric"
              :length="{ max: 4 }"
              @input="handleCardNum('p2', $event, 'p3')"
            />
            <LabeledInput
              id="p3"
              v-model="cardNum.p3"
              label=""
              placeholder="****"
              filterType="numeric"
              :length="{ max: 4 }"
              @input="handleCardNum('p3', $event, 'p4')"
            />
            <LabeledInput
              id="p4"
              v-model="cardNum.p4"
              label=""
              placeholder="0000"
              filterType="numeric"
              :length="{ max: 4 }"
              @input="handleCardNum('p4', $event, 'expiryMonth')"
            />
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 items-end">
          <LabeledInput
            id="expiryMonth"
            v-model="expiry.month"
            label="유효 기간"
            placeholder="MM"
            filterType="numeric"
            :length="{ max: 2 }"
            @input="handleExpiry($event, 'expiryYear')"
          />
          <LabeledInput
            id="expiryYear"
            v-model="expiry.year"
            label=""
            placeholder="YY"
            filterType="numeric"
            :length="{ max: 2 }"
            @input="handleExpiry($event, 'cvc')"
          />
          <LabeledInput
            class="col-span-2"
            id="cvc"
            v-model="cvc"
            label="CVC"
            placeholder="3자리"
            filterType="numeric"
            :length="{ max: 3 }"
            @input="handleCvc($event, 'ownerName')"
          />
        </div>

        <LabeledInput
          id="ownerName"
          v-model="ownerName"
          label="카드 소유주 성명"
          placeholder="이름을 입력하세요"
          filterType="text-only"
        />

        <div class="p-3 bg-slate-50 rounded-xl flex items-start gap-2">
          <ShieldCheck class="w-3.5 h-3.5 text-slate-400 mt-0.5" />
          <p class="text-[10px] text-slate-400 leading-relaxed">
            정보는 보안 정책에 따라 암호화되어 안전하게 처리됩니다.
          </p>
        </div>
      </form>
    </div>

    <div class="px-6 py-6 bg-white border-t border-slate-50 flex gap-2.5">
      <button
        @click="handleClose"
        class="flex-1 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
      >
        취소
      </button>
      <button
        @click="handleSubmit"
        class="flex-[2] py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
      >
        카드 등록
      </button>
    </div>
  </div>
</template>
