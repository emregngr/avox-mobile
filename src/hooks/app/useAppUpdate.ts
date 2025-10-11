import * as Updates from 'expo-updates'
import { useCallback, useEffect } from 'react'

import { Logger } from '@/utils/common/logger'

export const checkForAppUpdate = async (): Promise<void> => {
  try {
    if (__DEV__) return

    const update = await Updates.checkForUpdateAsync()
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync({
        reloadScreenOptions: {
          backgroundColor: '#A2CAE5',
          image: {
            url: require('@/assets/images/splash-ios.png'),
            width: 200,
            height: 200,
          },
          imageResizeMode: 'contain',
          imageFullScreen: false,
          fade: true,
        },
      })
    }
  } catch (error) {
    Logger.breadcrumb('Failed to check for app update', 'error', error as Error)
  }
}

export const useAppUpdate = () => {
  const checkUpdate = useCallback(async () => {
    await checkForAppUpdate()
  }, [])

  useEffect(() => {
    checkUpdate()
  }, [checkUpdate])
}
