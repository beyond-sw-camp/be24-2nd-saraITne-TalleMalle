<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { KeyRound, Lock, CheckCircle2, Check } from 'lucide-vue-next'
import AuthBaseInput from '@/components/auth/AuthBaseInput.vue'

const router = useRouter()

// --- 상태 관리 ---
const password = ref('')
const passwordConfirm = ref('')
const isModalOpen = ref(false)

// --- 에러 메시지 상태 ---
const inputError = reactive({
    password: { errorMessage: null },
    confirm: { errorMessage: null }
})

// --- 실시간 유효성 검사 (버튼 활성화용) ---
const isFormValid = computed(() => {
    const hasLower = /[a-z]/.test(password.value)
    const hasNumber = /[0-9]/.test(password.value)
    const hasSpecial = /[!@$]/.test(password.value)
    const isLenValid = password.value.length >= 8

    const isPasswordValid = hasLower && hasNumber && hasSpecial && isLenValid
    const isConfirmValid = password.value === passwordConfirm.value && passwordConfirm.value !== ''

    return isPasswordValid && isConfirmValid
})

// --- 검사 규칙 (Blur 시 호출) ---
const passwordRules = () => {
    const hasLower = /[a-z]/.test(password.value)
    const hasNumber = /[0-9]/.test(password.value)
    const hasSpecial = /[!@$]/.test(password.value)

    if (!password.value) {
        inputError.password.errorMessage = '새 비밀번호를 입력해주세요.'
    } else if (password.value.length < 8) {
        inputError.password.errorMessage = '비밀번호는 8자 이상이어야 합니다.'
    } else if (!(hasLower && hasNumber && hasSpecial)) {
        inputError.password.errorMessage = '영문 소문자, 숫자, 특수문자(!@$)를 포함해야 합니다.'
    } else {
        inputError.password.errorMessage = null
    }
}

const confirmRules = () => {
    if (!passwordConfirm.value) {
        inputError.confirm.errorMessage = '비밀번호 확인을 입력해주세요.'
    } else if (password.value !== passwordConfirm.value) {
        inputError.confirm.errorMessage = '비밀번호가 일치하지 않습니다.'
    } else {
        inputError.confirm.errorMessage = null
    }
}

// --- 비밀번호 재설정 요청 ---
const handleReset = async () => {
    if (!isFormValid.value) return

    try {
        // 실제 API 호출 로직이 들어갈 자리 (예: await api.resetPassword(...))
        console.log('비밀번호 변경 요청:', password.value)
        
        // 성공 시 모달 오픈
        isModalOpen.value = true
    } catch (error) {
        console.error('비밀번호 변경 실패:', error)
        alert('변경 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
}
</script>

<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 font-sans">
        <div
            class="bg-white w-full max-w-md rounded-[24px] shadow-xl overflow-hidden relative border border-white/50 p-8">

            <div class="mt-4 flex flex-col items-center text-center">
                <div
                    class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600 ring-8 ring-indigo-50/50">
                    <KeyRound class="w-8 h-8" />
                </div>
                <h2 class="text-2xl font-bold text-slate-900">비밀번호 재설정</h2>
                <p class="text-slate-500 mt-2 text-sm">새로운 비밀번호를 입력해주세요.</p>
            </div>

            <form @submit.prevent="handleReset" class="mt-8 space-y-5">
                <AuthBaseInput 
                    v-model="password"
                    label="새 비밀번호"
                    label-class="text-xs text-slate-400 uppercase"
                    type="password"
                    placeholder="8자 이상, 소문자/숫자/특수문자 포함"
                    :icon="Lock"
                    :error="inputError.password.errorMessage"
                    @blur="passwordRules"
                />

                <AuthBaseInput 
                    v-model="passwordConfirm"
                    label="비밀번호 확인"
                    label-class="text-xs text-slate-400 uppercase"
                    type="password"
                    placeholder="비밀번호 재입력"
                    :icon="Check"
                    :error="inputError.confirm.errorMessage"
                    @blur="confirmRules"
                />

                <button 
                    type="submit"
                    :disabled="!isFormValid"
                    class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                >
                    변경 완료
                </button>
            </form>
        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div class="bg-white rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl">
                <div
                    class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                    <CheckCircle2 class="w-8 h-8" />
                </div>
                <h3 class="text-xl font-bold text-slate-900 mb-2">변경 완료</h3>
                <p class="text-sm text-slate-500 mb-8">비밀번호가 성공적으로 변경되었습니다.<br />새 비밀번호로 로그인해주세요.</p>
                <button @click="router.push('/login')"
                    class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl active:scale-95">
                    로그인하러 가기
                </button>
            </div>
        </div>
    </div>
</template>