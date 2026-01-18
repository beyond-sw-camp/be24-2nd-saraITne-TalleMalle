<script setup>
/**
 * [파일 설명]
 * 이 파일은 '실시간 채팅 페이지'의 메인 컴포넌트입니다.
 * * 주요 역할:
 * 1. WebSocket을 연결하여 실시간으로 서버와 통신합니다.
 * 2. 채팅 메시지 목록(messages)과 사용자 정보(usersData)를 관리합니다.
 * 3. 하위 컴포넌트(패널, 사이드바, 모달)들을 조립하여 화면을 구성합니다.
 */

import { ref, reactive, onMounted, onUnmounted, provide } from 'vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'   // 채팅 메시지가 표시되는 중앙 패널
import RideSidebar from '@/components/chat/RideSidebar.vue' // 우측 참여자 목록 사이드바
import ProfileModal from '@/components/chat/ProfileModal.vue' // 프로필 클릭 시 뜨는 팝업
import api from '@/api/user' 
import { useAuthStore } from '@/stores/auth' // 로그인 정보를 담고 있는 저장소(Pinia)
import { storeToRefs } from 'pinia'

// =========================================
// 1. 상태(State) 변수 선언 구역
// =========================================

/**
 * WebSocket 연결 상태와 객체
 * - isConnected: 현재 서버와 연결되어 있는지 여부 (UI에서 초록불/빨간불 표시용)
 * - socket: 실제 WebSocket 통신을 담당하는 객체
 */
const isConnected = ref(false)
let socket = null

/**
 * 내 정보 (로그인한 사용자)
 * - 초기값은 랜덤하게 설정되지만, onMounted에서 실제 로그인 정보로 덮어씌워집니다.
 */
const myUserId = ref(`user_${Math.floor(Math.random() * 1000)}`)
const myUserName = ref('익명')
const myUserImg = ref('')

/**
 * 채팅 메시지 목록 (화면에 뿌려질 데이터)
 * - type: 'date'(날짜선), 'system'(안내문구), 'me'(나), 'other'(상대방)
 */
const messages = ref([
    { id: 1, type: 'date', text: 'Today' },
    { id: 2, type: 'system', text: "✨ 실시간 채팅방에 입장했습니다." }
])

/**
 * 사용자 데이터베이스 (Mock Data)
 * - 실제로는 API로 가져와야 할 수도 있지만, 여기서는 프론트엔드에서
 * 임시로 가지고 있는 사용자들의 프로필 정보입니다.
 * - key(ID)를 통해 이름, 레벨, 이미지 등을 빠르게 찾기 위해 객체(reactive)로 만들었습니다.
 */
const usersData = reactive({
    "Ji-su": {
        name: "지수", lv: "LV. 8", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ji-su",
        meta: "가입 124일째 · 동승 48회", bio: '"주로 평일 아침 출근 시간에 판교역 근처에서 활동해요! 😊"',
        score: 88, rank: "상위 5%", stats: { time: 24, silent: 18 },
        reviews: [{ author: "에이든", date: "3일 전", content: "정말 친절하시고 시간도 딱 맞춰서 와주셨어요!" }]
    },
    "Aiden": {
        name: "에이든", lv: "LV. 5", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aiden",
        meta: "가입 42일째 · 동승 12회", bio: '"매너 있는 동승을 추구합니다. 조용히 가는 걸 선호해요!"',
        score: 72, rank: "상위 15%", stats: { time: 8, silent: 10 },
        reviews: [{ author: "지수", date: "1일 전", content: "대화가 정말 즐거웠습니다! 좋은 분이에요." }]
    },
    "Unknown": {
        name: "알수없음", lv: "LV. 1", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown",
        meta: "정보 없음", bio: "", score: 50, rank: "-", stats: { time: 0, silent: 0 }, reviews: []
    }
})

/**
 * 프로필 모달 관련 상태
 * - isProfileModalOpen: 모달이 현재 열려있는지 여부
 * - currentProfile: 모달에 표시할 특정 유저의 상세 정보
 */
const isProfileModalOpen = ref(false)
const currentProfile = reactive({
    id: '', name: '', lv: '', img: '', meta: '', bio: '',
    score: 0, rank: '', stats: { time: 0, silent: 0 },
    reviews: [], isBlocked: false
})

/**
 * 로그인 정보 가져오기 (Pinia Store)
 * - storeToRefs를 사용해야 반응성(값이 바뀌면 화면도 바뀜)이 유지된 채로 가져올 수 있습니다.
 */
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)


// =========================================
// 2. 생명주기(Lifecycle) & 초기화
// =========================================

/**
 * onMounted: 컴포넌트가 화면에 나타날 때 실행됩니다.
 * 1. 웹소켓 연결을 시작합니다.
 * 2. Pinia Store에 저장된 내 정보를 가져와 변수에 세팅합니다.
 */
onMounted(() => {
  connectWebSocket()

  // 로그인 정보가 있으면 내 정보 변수 업데이트
  if (user.value) {
    myUserId.value = user.value.id || user.value.userId
    myUserName.value = user.value.name || user.value.nickname || user.value.userName || '익명'
    myUserImg.value = user.value.img || user.value.profileImage || user.value.userImg || ''
  } else {
    // 로그인 정보가 없을 때 경고 로그
    console.warn('[auth] 로그인 사용자 정보가 없습니다. localStorage USERINFO 확인 필요')
    console.log('[auth] localStorage USERINFO raw:', localStorage.getItem('USERINFO'))
  }
})

/**
 * onUnmounted: 컴포넌트가 화면에서 사라질 때 실행됩니다.
 * - 열려있는 소켓 연결을 끊어줘야 리소스 낭비를 막을 수 있습니다.
 */
onUnmounted(() => {
    if (socket) {
        socket.close()
    }
})


// =========================================
// 3. WebSocket 관련 로직 (핵심 기능)
// =========================================

/**
 * 웹소켓 연결 함수
 * - 서버 주소(ws://...)로 연결을 시도하고, 각 이벤트(연결, 메시지수신, 종료, 에러)별 동작을 정의합니다.
 */
const connectWebSocket = () => {
    const wsUri = "ws://localhost:8080/ws/chat"
    socket = new WebSocket(wsUri)

    // 1. 연결 성공 시
    socket.addEventListener('open', () => {
        console.log('WEBSOCKET CONNECTED')
        isConnected.value = true
    })

    // 2. 메시지 수신 시 (가장 중요!)
    socket.addEventListener('message', (e) => {
        try {
            // 서버에서 온 데이터는 문자열(JSON String)이므로 객체로 변환(parse)해야 합니다.
            const parsedData = JSON.parse(e.data)
            
            // 데이터 구조에 따라 payload를 쓸지, 데이터 자체를 쓸지 결정
            const payload = parsedData.payload !== undefined ? parsedData.payload : parsedData
            
            // 화면에 표시하기 위해 처리 함수 호출
            handleIncomingMessage(payload)
        } catch (err) {
            // JSON 변환 실패 시 그냥 문자열로 처리
            handleIncomingMessage(e.data)
        }
    })

    // 3. 연결 종료 시
    socket.addEventListener('close', () => {
        console.log('WEBSOCKET CLOSED')
        isConnected.value = false
    })

    // 4. 에러 발생 시
    socket.addEventListener('error', (err) => {
        console.error('WEBSOCKET ERROR', err)
        isConnected.value = false
    })
}

/**
 * 수신된 메시지 처리 함수
 * - 서버에서 온 데이터를 분석해서 'messages' 배열에 예쁘게 담아주는 역할입니다.
 */
const handleIncomingMessage = (data) => {
    // [예외 처리] 가끔 서버에서 JSON을 문자열로 두 번 감싸서 보내는 경우를 대비한 로직
    if (typeof data === 'string') {
        try {
            if (data.trim().startsWith('{') || data.trim().startsWith('[')) {
                const doubleParsed = JSON.parse(data)
                if (typeof doubleParsed === 'object' && doubleParsed !== null) {
                    data = doubleParsed
                }
            }
        } catch (e) { /* 무시 */ }
    }

    // 시간 포맷 (예: 14:05)
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    // 변수 초기화
    let textContent = ''
    let userId = 'Unknown'
    let userName = null
    let userImg = null

    // 데이터가 객체라면(정상적인 JSON) 내부 필드 추출
    if (typeof data === 'object' && data !== null) {
        textContent = data.text || data.msg || data.message || data.content
        if (!textContent) textContent = JSON.stringify(data) // 내용 없으면 전체 덤프
        userId = data.userId || data.sender || data.id || data.user || 'Unknown'
        userName = data.userName || data.name
        userImg = data.userImg || data.img
    } else {
        // 데이터가 그냥 문자열이면 그대로 내용으로 사용
        textContent = String(data)
    }

    // 내가 보낸 메시지가 다시 돌아온 경우 무시 (이미 sendMessage에서 화면에 그렸으므로)
    if (userId === myUserId.value) return

    // 보낸 사람의 상세 정보 찾기 (usersData에서 조회)
    const senderInfo = usersData[userId] || usersData['Unknown']
    
    // 화면에 표시할 최종 유저 객체 조립
    const displayUser = {
        ...senderInfo,
        name: userName || senderInfo.name, // 메시지에 이름이 있으면 그거 쓰고, 없으면 DB값 사용
        img: userImg || senderInfo.img
    }

    // 메시지 목록에 추가 (화면 갱신됨)
    messages.value.push({
        id: Date.now() + Math.random(), // 고유 ID 생성
        type: 'other',                  // 타인이 보낸 메시지 타입
        userId: userId,
        text: textContent,
        time: timeStr,
        user: displayUser               // 프로필 사진 등을 띄우기 위해 전달
    })
}

// =========================================
// 4. 사용자 액션 (메시지 전송, 프로필 보기)
// =========================================

/**
 * 메시지 전송 함수
 * @param {string} textToSend - 입력창에 적은 텍스트
 */
const sendMessage = (textToSend) => {
    const now = new Date()
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`

    // 1. Optimistic Update (낙관적 업데이트)
    // 서버 응답을 기다리지 않고, 내 화면에 먼저 말풍선을 띄워서 '빠르다'고 느끼게 함
    messages.value.push({
        id: Date.now(),
        type: 'me',
        text: textToSend,
        time: timeStr
    })

    // 2. 실제 서버 전송
    if (socket && isConnected.value) {
        const payload = {
            userId: myUserId.value,
            userName: myUserName.value,
            userImg: myUserImg.value,
            text: textToSend,
            timestamp: now.toISOString()
        }
        // 객체를 문자열로 바꿔서 전송
        socket.send(JSON.stringify(payload))
    } else {
        // 연결이 끊겨있으면 시스템 메시지로 알림
        messages.value.push({
            id: Date.now() + 1,
            type: 'system',
            text: '⚠️ 메시지를 전송할 수 없습니다 (연결 끊김)'
        })
    }
}

/**
 * 프로필 모달 열기
 * @param {string} userId - 클릭한 사용자의 ID
 */
const openProfile = (userId) => {
    // usersData에서 정보 찾기
    const data = usersData[userId] || usersData['Unknown']
    
    // currentProfile 반응형 객체에 데이터 덮어쓰기
    Object.assign(currentProfile, {
        id: userId,
        ...data,
        isBlocked: false // 모달 열 때는 차단 상태 초기화 등 로직 필요 시 추가
    })
    
    // 모달 표시
    isProfileModalOpen.value = true
}

// 하위 컴포넌트(Header 등)에서 내 이름을 쓸 수 있도록 전달
provide('myUserName', myUserName)
</script>

<template>
    <!-- 전체 레이아웃 컨테이너 -->
    <div class="h-full flex gap-4 p-4 overflow-hidden relative">

        <!-- 왼쪽 여백 (데스크탑에서만 보임, 균형 맞추기용) -->
        <div class="hidden md:block w-20 shrink-0"></div>

        <!-- 메인 콘텐츠 영역 (채팅창 + 사이드바) -->
        <main class="flex-1 flex gap-6 overflow-hidden h-[calc(100vh-2rem)]">
            
            <!-- 1. 채팅 패널 컴포넌트 -->
            <!-- :messages -> 메시지 배열을 props로 전달 -->
            <!-- @send-message -> 자식이 '전송' 이벤트를 올리면 sendMessage 함수 실행 -->
            <ChatPanel 
                :messages="messages" 
                :is-connected="isConnected" 
                @send-message="sendMessage"
                @open-profile="openProfile" 
            />

            <!-- 2. 우측 사이드바 컴포넌트 (참여자 목록 등) -->
            <RideSidebar 
                :user-profiles="usersData" 
                @open-profile="openProfile" 
            />
        </main>

        <!-- 3. 프로필 모달 (팝업) -->
        <!-- 조건부 렌더링이 아니라 v-show나 내부 로직으로 제어 (is-open prop 전달) -->
        <ProfileModal 
            :is-open="isProfileModalOpen" 
            :profile="currentProfile" 
            @close="isProfileModalOpen = false" 
        />

    </div>
</template>