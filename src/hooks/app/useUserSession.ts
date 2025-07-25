import firebase from '@react-native-firebase/app'
import { getAuth } from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'

const auth = getAuth(firebase.app())

export const useUserSession = async (): Promise<boolean> => {
  const user = auth?.currentUser
  if (!user) return false

  try {
    await user.getIdToken(true)
    return true
  } catch (error) {
    crashlytics().recordError(error as Error)
    return false
  }
}
