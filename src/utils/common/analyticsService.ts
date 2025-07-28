import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics'
import { getApp } from '@react-native-firebase/app'

import type { UserProfile } from '@/types/feature/user'
import type { LogData } from '@/utils/common/logger'
import { Logger } from '@/utils/common/logger'

const app = getApp()
const analytics = getAnalytics(app)

export const AnalyticsService = {
  async sendEvent(tag: string, values: any) {
    try {
      const analyticObject = values || {}
      const userId = await AsyncStorage.getItem('user-id')

      if (analyticObject && typeof analyticObject === 'object') {
        Object.keys(analyticObject).forEach(key => {
          analyticObject[key] = analyticObject[key] != null ? String(analyticObject[key]) : ''
        })
      }

      await logEvent(analytics, tag, {
        ...analyticObject,
        userId: userId || 'anonymous',
      })
    } catch (e) {
      Logger.breadcrumb('[sendEvent] error', 'error', e as LogData)
    }
  },

  async setUser(user: UserProfile) {
    try {
      if (!user?.uid) {
        Logger.breadcrumb('[setUser] Invalid user data', 'warning', { user })
        return
      }

      await setUserId(analytics, user.uid)
      await setUserProperties(analytics, {
        email: user?.email || '',
        firstName: user?.firstName || '',
      })
    } catch (e) {
      Logger.breadcrumb('[setUser] error', 'error', e as LogData)
    }
  },
}
