import AsyncStorage from '@react-native-async-storage/async-storage'
import analytics from '@react-native-firebase/analytics'

import type { UserProfile } from '@/types/feature/user'
import type { LogData } from '@/utils/common/logger'
import { Logger } from '@/utils/common/logger'

const AnalyticsService = {
  async sendEvent(tag: string, values: any) {
    try {
      const analyticObject = values
      const userId = await AsyncStorage.getItem('user-id')

      if (analyticObject) {
        Object.keys(analyticObject).forEach(key => {
          if (analyticObject[key]) {
            analyticObject[key] = `${analyticObject[key]}`
          }
        })
      }

      await analytics().logEvent(tag, {
        ...analyticObject,
        userId: `${userId}`,
      })
    } catch (e) {
      Logger.breadcrumb('[sendEvent] error', 'error', e as LogData)
    }
  },
  async setUser(user: UserProfile) {
    try {
      await analytics().setUserId(user?.uid)
      await analytics().setUserProperties({
        email: user?.email,
        firstName: user?.firstName,
      })
    } catch (e) {
      Logger.breadcrumb('[setUser] error', 'error', e as LogData)
    }
  },
}

export default AnalyticsService
