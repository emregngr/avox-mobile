import * as Updates from 'expo-updates'
import { useCallback, useEffect } from 'react'

import { Logger } from '@/utils/common/logger'

export const checkForAppUpdate = async (): Promise<void> => {
  try {
    const update = await Updates.checkForUpdateAsync()
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
    }
  } catch (error) {
    Logger.breadcrumb('Failed to check for app update', 'error', error as Error)
  }
}

export const useAppUpdate = () => {
  const checkUpdate = useCallback(() => {
    checkForAppUpdate
  }, [])

  useEffect(() => {
    checkUpdate()
  }, [checkUpdate])
}
