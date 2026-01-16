<script setup>
import { ref } from 'vue'
import { X, UserCheck, Ban, BarChart3, MessageSquare } from 'lucide-vue-next'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    profile: {
        type: Object,
        default: () => ({
            name: '',
            lv: '',
            meta: '',
            bio: '',
            img: '',
            score: 0,
            rank: '',
            isBlocked: false,
            stats: { time: 0, silent: 0 },
            reviews: []
        })
    }
})

const emit = defineEmits(['close', 'toggle-block'])

// 리뷰 펼치기 상태 관리
const reviewsExpanded = ref(false)

const close = () => {
    emit('close')
}

const toggleBlock = () => {
    emit('toggle-block')
}
</script>

<template>
    <div v-if="isOpen"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity"
        @click="close">
        <div class="bg-white w-full max-w-[580px] max-h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
            @click.stop>
            
            <!-- 모달 헤더 -->
            <div class="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 class="font-bold text-slate-900">프로필 정보</h3>
                <div class="flex items-center gap-2">
                    <!-- 차단 버튼 -->
                    <button @click="toggleBlock" class="p-2.5 border rounded-xl transition-all"
                        :class="profile.isBlocked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50'">
                        <component :is="profile.isBlocked ? UserCheck : Ban" class="w-5 h-5" />
                    </button>
                    <!-- 닫기 버튼 -->
                    <button @click="close" class="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400">
                        <X class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- 모달 본문 -->
            <div class="flex-1 overflow-y-auto custom-scroll p-8 space-y-8">
                <!-- 기본 정보 -->
                <div class="flex flex-col items-center text-center">
                    <div
                        class="w-24 h-24 rounded-[2.2rem] bg-indigo-50 border-4 border-white shadow-xl overflow-hidden mb-5">
                        <img :src="profile.img" class="w-full h-full object-cover" />
                    </div>
                    <div class="space-y-1">
                        <div class="flex items-center justify-center gap-2">
                            <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ profile.name }}</h2>
                            <span class="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-lg font-bold">{{
                                profile.lv }}</span>
                        </div>
                        <p class="text-xs text-slate-400 font-medium">{{ profile.meta }}</p>
                    </div>
                    <div
                        class="mt-6 w-full max-w-xs p-4 bg-slate-50/80 rounded-2xl text-xs text-slate-600 leading-relaxed font-medium">
                        {{ profile.bio }}
                    </div>
                </div>

                <!-- 매너 점수 -->
                <div class="space-y-4">
                    <div class="flex justify-between items-end px-1">
                        <div class="flex items-center gap-1">
                            <span class="text-3xl font-black text-indigo-600 italic">{{ profile.score }}</span>
                            <span class="text-sm font-bold text-slate-300">점</span>
                        </div>
                        <span class="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">{{
                            profile.rank }}</span>
                    </div>
                    <div class="h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
                        <div class="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-rose-500 transition-all duration-1000 ease-out rounded-full"
                            :style="{ width: `${profile.score}%` }"></div>
                    </div>
                </div>

                <!-- 통계 -->
                <div class="space-y-4">
                    <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 class="w-4 h-4 text-indigo-600" />주요 특징
                    </h4>
                    <div class="grid grid-cols-2 gap-3">
                        <div
                            class="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-600">⏰ 시간 약속</span>
                            <span class="text-xs font-black text-indigo-600">{{ profile.stats?.time || 0 }}회</span>
                        </div>
                        <div
                            class="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex justify-between items-center">
                            <span class="text-xs font-bold text-slate-600">🤫 정숙한 이동</span>
                            <span class="text-xs font-black text-indigo-600">{{ profile.stats?.silent || 0 }}회</span>
                        </div>
                    </div>
                </div>

                <!-- 리뷰 -->
                <div class="space-y-4" v-if="profile.reviews && profile.reviews.length > 0">
                    <div class="flex justify-between items-center">
                        <h4 class="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare class="w-4 h-4 text-indigo-600" />동승자 후기
                        </h4>
                        <button v-if="profile.reviews.length > 3" @click="reviewsExpanded = !reviewsExpanded"
                            class="text-[10px] font-bold text-indigo-600 underline">
                            {{ reviewsExpanded ? '접기' : '전체보기' }}
                        </button>
                    </div>
                    <div class="space-y-3">
                        <div v-for="(review, idx) in profile.reviews" :key="idx"
                            class="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2"
                            :class="{ 'hidden': idx >= 3 && !reviewsExpanded }">
                            <div class="flex justify-between items-center">
                                <span class="text-[10px] font-bold text-slate-700">{{ review.author }}</span>
                                <span class="text-[9px] text-slate-300">{{ review.date }}</span>
                            </div>
                            <p class="text-xs text-slate-600 leading-relaxed">{{ review.content }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 하단 버튼 -->
            <div class="p-6 bg-white border-t border-slate-50">
                <button @click="close"
                    class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">
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