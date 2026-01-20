/**
 * ==============================================================================
 * 1. IMPORTS
 * ==============================================================================
 */
import api from '@/plugins/axiosinterceptor'

/**
 * ==============================================================================
 * 2. API DEFINITIONS
 * ==============================================================================
 */

/**
 * 주행 경로 데이터 가져오기
 * method: GET
 * url: /json/driverNavigation
 */
const getNavigationPath = () => {
  return api.get('/json/driverNavigation')
}

export default {
  getNavigationPath,
}
