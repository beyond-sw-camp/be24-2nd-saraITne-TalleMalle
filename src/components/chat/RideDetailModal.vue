<script setup>
import { X, Car } from 'lucide-vue-next'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const close = () => {
    emit('close')
}
</script>

<template>
    <div v-if="isOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        @click="close">
        <div class="bg-white w-full max-w-[580px] max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
            @click.stop>
            <!-- 헤더 -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white/90 sticky top-0 z-10">
                <h3 class="text-lg font-bold text-slate-900">탑승 상세 정보</h3>
                <button @click="close"
                    class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <X class="w-5 h-5" />
                </button>
            </div>

            <!-- 본문 -->
            <div class="overflow-y-auto custom-scroll p-6 space-y-6 bg-slate-50/50 flex-1">
                <!-- 기사 정보 -->
                <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div class="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Driver"
                            class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <div>
                                <span
                                    class="text-[10px] font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">개인택시</span>
                                <h4 class="text-lg font-bold text-slate-900 mt-1">김운전 기사님</h4>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-bold text-slate-600">소나타 (신형)</p>
                                <p class="text-lg font-black text-indigo-600">34바 1234</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 경로 정보 -->
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 class="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">이동 경로</h4>
                    <div class="relative pl-2 space-y-8">
                        <div class="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                        <!-- 출발지 -->
                        <div class="relative flex gap-4">
                            <div class="w-5 h-5 rounded-full bg-white border-4 border-emerald-500 z-10 shrink-0"></div>
                            <div>
                                <p class="text-xs font-bold text-slate-400">18:30 출발 예정</p>
                                <p class="text-sm font-bold text-slate-900">강남역 2번 출구</p>
                            </div>
                        </div>

                        <!-- 현재 위치 -->
                        <div class="relative flex gap-4">
                            <div
                                class="w-5 h-5 rounded-full bg-indigo-600 z-10 shrink-0 flex items-center justify-center shadow-lg shadow-indigo-300">
                                <Car class="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <p class="text-xs font-bold text-indigo-600 animate-pulse">현재 이동 중</p>
                                <p class="text-sm font-bold text-slate-900">뱅뱅사거리 부근</p>
                            </div>
                        </div>

                        <!-- 도착지 -->
                        <div class="relative flex gap-4">
                            <div class="w-5 h-5 rounded-full bg-white border-4 border-rose-500 z-10 shrink-0"></div>
                            <div>
                                <p class="text-xs font-bold text-slate-400">19:05 도착 예정</p>
                                <p class="text-sm font-bold text-slate-900">판교역 지하철 입구</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 결제 정보 -->
                <div class="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-sm font-bold text-indigo-900">예상 결제 금액</h4>
                        <span
                            class="text-xs bg-white border border-indigo-100 text-indigo-600 px-2 py-1 rounded-lg font-bold">선결제
                            완료</span>
                    </div>
                    <div class="flex justify-between items-end border-b border-indigo-100/50 pb-4 mb-4">
                        <span class="text-slate-500 text-sm">총 택시 요금 (예상)</span>
                        <span class="text-slate-900 font-bold">18,000원</span>
                    </div>
                    <div class="flex justify-between items-end">
                        <span class="text-slate-500 text-sm">나의 부담금 (1/4)</span>
                        <span class="text-2xl font-black text-indigo-600">4,500원</span>
                    </div>
                </div>
            </div>

            <!-- 하단 버튼 -->
            <div class="p-6 bg-white border-t border-slate-100">
                <button @click="close"
                    class="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg">
                    확인
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 20px;
}

@keyframes slide-up {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-up {
    animation: slide-up 0.3s ease-out forwards;
}
</style>