import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useMemo } from 'react'

import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { Logger } from '@/utils/common/logger'

export const useSystemUI = () => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const updateSystemColors = useCallback(async () => {
    try {
      await SystemUI.setBackgroundColorAsync(colors?.background?.primary)
    } catch (error) {
      Logger.breadcrumb('Failed to update system colors', 'error', error as Error)
    }
  }, [colors?.background?.primary])

  useEffect(() => {
    updateSystemColors()
  }, [updateSystemColors])
}
