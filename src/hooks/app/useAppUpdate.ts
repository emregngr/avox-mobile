import crashlytics from '@react-native-firebase/crashlytics'
import * as Updates from 'expo-updates'
import { useCallback, useEffect } from 'react'
import { InteractionManager } from 'react-native'

export const checkForAppUpdate = async (): Promise<void> => {
  try {
    const update = await Updates.checkForUpdateAsync()
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
    }
  } catch (error) {
    if (!__DEV__) crashlytics().recordError(error as Error)
  }
}

export const useAppUpdate = () => {
  const checkUpdate = useCallback(() => {
    InteractionManager.runAfterInteractions(checkForAppUpdate)
  }, [])

  useEffect(() => {
    checkUpdate()
  }, [checkUpdate])
}
