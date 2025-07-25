import * as NavigationBar from 'expo-navigation-bar'
import * as SystemUI from 'expo-system-ui'
import { useCallback, useEffect } from 'react'
import { Platform } from 'react-native'

export const useSystemUI = (colors: any, selectedTheme: string) => {
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
