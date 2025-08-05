import * as SystemUI from 'expo-system-ui'

import { Logger } from '@/utils/common/logger'

export const setSystemColors = async (bgColor: string): Promise<void> => {
  try {
    await SystemUI.setBackgroundColorAsync(bgColor)
  } catch (error) {
    Logger.breadcrumb('setSystemColorsError', 'error', error as Error)
  }
}
