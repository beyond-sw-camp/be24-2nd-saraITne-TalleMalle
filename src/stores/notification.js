/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import { defineStore } from 'pinia'

/**
 * ==============================================================================
 * 2. STORE DEFINITION
 * ==============================================================================
 */
export const useNotificationStore = defineStore('notification', {
  /**
   * ----------------------------------------------------------------------------
   * STATE (상태 변수 정의)
   * ----------------------------------------------------------------------------
   */
  state: () => ({
    notifications: [],
  }),

  /**
   * ----------------------------------------------------------------------------
   * ACTIONS (상태 변경 함수)
   * ----------------------------------------------------------------------------
   */
  actions: {
    /**
     * [SETTER] 알림 리스트 저장
     * - View에서 API 호출 성공 후, 받은 데이터를 이 함수를 통해 저장합니다.
     */
    setNotifications(data) {
      this.notifications = data
    },

    // 모든 알림 읽음 처리
    markAllAsRead() {
      this.notifications.forEach((n) => (n.isRead = true))
    },

    //특정 알림 읽음 처리
    markAsRead(id) {
      const item = this.notifications.find((n) => n.id === id)
      if (item) item.isRead = true
    },

    // 알림 삭제
    removeNotification(id) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },

  // Pinia Persist 플러그인 설정 (새로고침 해도 데이터 유지)
  persist: true,
})
