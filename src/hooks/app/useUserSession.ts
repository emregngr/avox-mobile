import { getApp } from '@react-native-firebase/app'
import { getAuth, getIdToken } from '@react-native-firebase/auth'

import { Logger } from '@/utils/common/logger'

const app = getApp()
const auth = getAuth(app)

export const useUserSession = async (): Promise<boolean> => {
  const user = auth?.currentUser
  if (!user) return false

  try {
    await getIdToken(user, true)
    return true
  } catch (error) {
    Logger.breadcrumb('Failed to check user session', 'error', error as Error)
    return false
  }
}
