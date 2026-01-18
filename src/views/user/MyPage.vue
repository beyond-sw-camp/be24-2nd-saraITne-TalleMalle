<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Camera,
  UserMinus,
  CreditCard,
  Quote,
  Star,
  X,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next'
import EditPayment from '@/views/payment/EditPayment.vue'
import RoundBox from '@/components/layout/RoundBox.vue'
import CardSummary from '@/components/payment/CardSummary.vue'
import HistoryEntry from '@/components/entry/HistoryEntry.vue'

// --- 상태 ---
const activeTab = ref('history')
const isRideHistoryModalOpen = ref(false)
const isEditPaymentModalOpen = ref(false)
const isReviewModalOpen = ref(false)

// [통합] 하나의 스크롤 컨테이너로 관리
const scrollContainer = ref(null)
// [수정] 스크롤 방향별 상태 분리
const canScrollUp = ref(false)
const canScrollDown = ref(false)

const currentHistory = ref({})
const currentReview = ref({})
const profileImage = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix')

// --- 데이터 (Mock) ---
const rideHistoryList = [
  {
    id: 1,
    start: '강남역 2번 출구',
    dest: '판교역',
    date: '2024.03.24 (일)',
    cost: '4,500원',
    people: 4,
    isDone: true,
    time: '어제',
  },
  {
    id: 2,
    start: '합정역 7번 출구',
    dest: '서울역',
    date: '2024.03.21 (목)',
    cost: '3,200원',
    people: 2,
    isDone: true,
    time: '3일 전',
  },
  {
    id: 3,
    start: '판교역 1번 출구',
    dest: '강남역',
    date: '2024.03.18 (월)',
    cost: '4,500원',
    people: 4,
    isDone: true,
    time: '1주 전',
  },
  {
    id: 4,
    start: '건대입구역 2번 출구',
    dest: '성수역 3번 출구',
    date: '2024.03.15 (금)',
    cost: '3,000원',
    people: 3,
    isDone: true,
    time: '1주 전',
  },
  {
    id: 5,
    start: '잠실역 8번 출구',
    dest: '천호역',
    date: '2024.03.10 (일)',
    cost: '3,800원',
    people: 2,
    isDone: true,
    time: '2주 전',
  },
  {
    id: 6,
    start: '홍대입구역 9번 출구',
    dest: '합정역',
    date: '2024.03.05 (화)',
    cost: '3,000원',
    people: 2,
    isDone: true,
    time: '3주 전',
  },
  {
    id: 7,
    start: '신도림역 1번 출구',
    dest: '구로디지털단지역',
    date: '2024.03.01 (금)',
    cost: '3,500원',
    people: 3,
    isDone: true,
    time: '1달 전',
  },
  {
    id: 8,
    start: '여의도역 5번 출구',
    dest: '국회의사당역',
    date: '2024.02.28 (수)',
    cost: '3,000원',
    people: 2,
    isDone: true,
    time: '1달 전',
  },
  {
    id: 9,
    start: '사당역 4번 출구',
    dest: '이수역',
    date: '2024.02.25 (일)',
    cost: '3,200원',
    people: 4,
    isDone: true,
    time: '1달 전',
  },
  {
    id: 10,
    start: '서울대입구역 2번 출구',
    dest: '낙성대역',
    date: '2024.02.20 (화)',
    cost: '3,000원',
    people: 3,
    isDone: true,
    time: '1달 전',
  },
]

// --- 메소드 ---

// [수정] 현재 스크롤 위치에 따라 위/아래 상태 업데이트
const handleScroll = () => {
  const el = scrollContainer.value
  if (!el) return
  // scrollTop > 0 이면 위로 스크롤 가능
  canScrollUp.value = el.scrollTop > 0
  // 현재 스크롤 위치 + 화면 높이가 전체 높이보다 작으면 아래로 스크롤 가능 (오차범위 1px)
  canScrollDown.value = el.scrollTop + el.clientHeight < el.scrollHeight - 1
}

// [수정] 데이터 변경 시 체크 (nextTick 후 handleScroll 호출)
const checkScroll = async () => {
  await nextTick()
  handleScroll()
}

// 탭 변경 시 스크롤 초기화 및 체크
const switchTab = (tab) => {
  activeTab.value = tab
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = 0
  }
  checkScroll()
}

const openRideDetail = (id) => {
  currentHistory.value = rideHistoryList.find((item) => item.id === id) || rideHistoryList[0]
  isRideHistoryModalOpen.value = true
}

const handleEditPaymentModal = () => {
  isEditPaymentModalOpen.value = !isEditPaymentModalOpen.value
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => (profileImage.value = e.target.result)
    reader.readAsDataURL(file)
  }
}

// 데이터나 탭이 변경되면 스크롤 체크
watch([activeTab, rideHistoryList], checkScroll)

onMounted(() => {
  window.addEventListener('resize', checkScroll)
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>

<template>
  <div class="h-screen flex gap-4 p-4 relative overflow-hidden">
    <div class="hidden md:block w-20 shrink-0"></div>

    <RoundBox class="flex flex-col h-full">
      <div
        class="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 shrink-0"
      >
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">마이페이지</h1>
          <p class="text-sm text-slate-400 font-medium mt-1">
            나의 동승 기록과 프로필 정보를 관리하세요.
          </p>
        </div>
        <div class="flex gap-4">
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase">누적 동승</p>
            <p class="text-lg font-black text-indigo-600">128회</p>
          </div>
          <div class="w-px h-8 bg-slate-200 self-center"></div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase">절약 금액</p>
            <p class="text-lg font-black text-emerald-600">24.5만</p>
          </div>
        </div>
      </div>

      <div class="flex-1 p-8 min-h-0 overflow-hidden">
        <div class="max-w-6xl mx-auto grid grid-cols-12 gap-8 h-full">
          <!-- 좌측 프로필 -->
          <div
            class="col-span-12 lg:col-span-4 flex flex-col h-full justify-between overflow-y-auto"
          >
            <div class="space-y-6">
              <RoundBox>
                <div class="relative w-28 h-28 mx-auto mb-4 mt-4">
                  <img
                    :src="profileImage"
                    class="w-full h-full rounded-full bg-white border-4 border-white shadow-xl object-cover"
                  />
                  <label
                    class="absolute bottom-1 right-1 p-2.5 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white cursor-pointer hover:bg-indigo-700 transition-colors"
                  >
                    <Camera class="w-4 h-4" />
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleImageUpload"
                    />
                  </label>
                </div>
                <h2 class="text-xl font-bold text-slate-900">판교동승왕님</h2>
                <p class="text-xs text-slate-400 mb-6">pangyo_king@gmail.com</p>
                <RouterLink to="/editprofile">
                  <button
                    class="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                  >
                    개인정보 수정
                  </button>
                </RouterLink>
              </RoundBox>

              <RoundBox>
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <span
                      class="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1"
                      >나의 매너 등급</span
                    >
                    <div class="flex items-baseline gap-1">
                      <span class="text-4xl font-black text-indigo-600 tracking-tighter">85</span>
                      <span class="text-sm font-bold text-slate-300">/ 100</span>
                    </div>
                  </div>
                </div>
                <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div
                    class="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full"
                    style="width: 85%"
                  ></div>
                </div>
                <p class="text-[11px] text-slate-400 mt-4 leading-relaxed text-center font-medium">
                  평점 4.8/5.0 <span class="text-indigo-600">상위 5%</span>의 매너를 가진
                  이용자입니다!
                </p>
              </RoundBox>
            </div>

            <div class="mt-5 flex justify-center pb-4 shrink-0">
              <button
                class="flex items-center gap-1.5 text-slate-300 hover:text-rose-500 transition-all font-bold text-[11px]"
              >
                <UserMinus class="w-3.5 h-3.5" />
                탈래말래 탈퇴하기
              </button>
            </div>
          </div>

          <!-- 우측 컨텐츠 -->
          <div class="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
            <RoundBox class="shrink-0">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard class="w-5 h-5 text-indigo-600" /> 나의 결제 수단
                </h3>
                <button
                  @click="handleEditPaymentModal"
                  class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all"
                >
                  카드 추가
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardSummary />
                <CardSummary />
              </div>
            </RoundBox>

            <!-- 하단 탭 영역 -->
            <RoundBox
              :padding="0"
              class="flex flex-col transition-all duration-300 ease-in-out flex-1 min-h-0"
            >
              <!-- 탭 헤더 -->
              <div class="flex border-b border-slate-50 shrink-0 h-[70px]">
                <button
                  @click="switchTab('history')"
                  class="flex-1 h-full flex items-center justify-center text-sm font-bold border-b-2 transition-all"
                  :class="
                    activeTab === 'history'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  "
                >
                  최근 탑승 기록
                </button>
                <button
                  @click="switchTab('reviews')"
                  class="flex-1 h-full flex items-center justify-center text-sm font-bold border-b-2 transition-all"
                  :class="
                    activeTab === 'reviews'
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  "
                >
                  받은 리뷰
                  <span class="ml-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-md">2</span>
                </button>
              </div>

              <!-- [통합] 공통 스크롤 영역 컨테이너 -->
              <div class="w-full flex-1 min-h-0 relative group">
                <!-- 
                  [수정] 상단 그라데이션 (위로 스크롤 가능할 때 표시)
                  bg-gradient-to-b: from-slate-100 (진한 회색) -> via-slate-50 (연한 회색) -> to-transparent
                  Transition name="fade" 추가하여 등장/퇴장 시 애니메이션 적용
                  h-20 -> h-10 (절반으로 축소)
                -->
                <Transition name="fade">
                  <div
                    v-if="canScrollUp"
                    class="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-slate-100 via-slate-50 to-transparent pointer-events-none z-10"
                  ></div>
                </Transition>

                <!-- 1. 스크롤 박스 (하나만 존재) -->
                <div
                  ref="scrollContainer"
                  class="h-full overflow-y-auto no-scrollbar pb-10"
                  @scroll="handleScroll"
                >
                  <!-- (A) History 탭 내용 -->
                  <template v-if="activeTab === 'history'">
                    <div v-if="rideHistoryList.length > 0" class="p-6 space-y-4">
                      <HistoryEntry
                        v-for="ride in rideHistoryList"
                        :key="ride.id"
                        v-bind="ride"
                        @click="openRideDetail(ride.id)"
                      />
                    </div>
                    <div
                      v-else
                      class="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]"
                    >
                      <MapPin class="w-10 h-10 mb-3 text-slate-200" />
                      <p class="font-bold text-sm text-slate-500">최근 탑승 기록이 없습니다.</p>
                    </div>
                  </template>

                  <!-- (B) Reviews 탭 내용 -->
                  <template v-if="activeTab === 'reviews'">
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- 스크롤 테스트를 위해 더미데이터 6개 반복 -->
                      <div
                        v-for="i in 6"
                        :key="i"
                        class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative hover:bg-white hover:shadow-xl transition-all"
                      >
                        <div class="flex items-center gap-3 mb-4">
                          <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Luna"
                            class="w-10 h-10 rounded-full bg-white border"
                          />
                          <div>
                            <p class="text-xs font-bold text-slate-800">루나님</p>
                            <p class="text-[10px] text-slate-400">강남역 → 판교역</p>
                          </div>
                        </div>
                        <Quote class="absolute top-6 right-6 w-4 h-4 text-slate-200" />
                        <p class="text-sm text-slate-600 leading-relaxed italic">
                          "시간 약속을 정말 칼같이 지키셔서 너무 좋았어요! 운전도 편안했습니다."
                        </p>
                        <div class="mt-4 flex gap-1">
                          <Star
                            v-for="s in 5"
                            :key="s"
                            class="w-3 h-3 text-amber-400 fill-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- 하단 여백 (공통) -->
                  <div
                    v-if="rideHistoryList.length > 0 || activeTab === 'reviews'"
                    class="h-10 w-full"
                  ></div>
                </div>

                <!-- 
                  2. [수정] 하단 그라데이션 (아래로 스크롤 가능할 때 표시)
                  bg-gradient-to-t: from-slate-100 (진한 회색) -> via-slate-50 (연한 회색) -> to-transparent
                  Transition name="fade" 추가하여 등장/퇴장 시 애니메이션 적용
                  h-20 -> h-10 (절반으로 축소)
                -->
                <Transition name="fade">
                  <div
                    v-if="canScrollDown"
                    class="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-slate-100 via-slate-50 to-transparent pointer-events-none z-10"
                  ></div>
                </Transition>
              </div>
            </RoundBox>
          </div>
        </div>
      </div>
    </RoundBox>

    <div
      v-if="isRideHistoryModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6"
      @click="isRideHistoryModalOpen = false"
    >
      <div class="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">탑승 상세 정보</h2>
          <button @click="isRideHistoryModalOpen = false">
            <X class="w-6 h-6 text-slate-400" />
          </button>
        </div>
        <p class="text-slate-600 mb-8">
          {{ currentHistory.start }}에서 {{ currentHistory.dest }}까지의 여정입니다.
        </p>
        <button
          @click="isRideHistoryModalOpen = false"
          class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold"
        >
          닫기
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isEditPaymentModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
        @click="isEditPaymentModalOpen = false"
      >
        <div class="w-full max-w-md animate-in fade-in zoom-in duration-300" @click.stop>
          <EditPayment @close="handleEditPaymentModal" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 그라데이션 등장/퇴장 애니메이션 (0.2초) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
