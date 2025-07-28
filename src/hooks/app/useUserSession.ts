import { getApp } from '@react-native-firebase/app'
import { getAuth, getIdToken } from '@react-native-firebase/auth'
import { getCrashlytics, recordError } from '@react-native-firebase/crashlytics'

const app = getApp()
const auth = getAuth(app)
const crashlytics = getCrashlytics()

export const useUserSession = async (): Promise<boolean> => {
  const user = auth?.currentUser
  if (!user) return false

  try {
    await getIdToken(user, true)
    return true
  } catch (error) {
    recordError(crashlytics, error as Error)
    return false
  }
}
