import * as NavigationBar from 'expo-navigation-bar'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect, useMemo } from 'react'
import { Platform } from 'react-native'

import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

export const useSystemUI = () => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const updateSystemColors = useCallback(async () => {
    try {
      await SystemUI.setBackgroundColorAsync(colors?.background?.primary)

      if (Platform.OS === 'android') {
        await NavigationBar.setBackgroundColorAsync(colors?.background?.primary)
        await NavigationBar.setButtonStyleAsync(selectedTheme === 'dark' ? 'light' : 'dark')
        await NavigationBar.setBehaviorAsync('overlay-swipe')
      }
    } catch (error) {}
  }, [colors?.background?.primary, selectedTheme])

  useEffect(() => {
    updateSystemColors()
  }, [updateSystemColors])
}
