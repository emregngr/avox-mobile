import * as NavigationBar from 'expo-navigation-bar'
import { setStatusBarBackgroundColor } from 'expo-status-bar'
import * as SystemUI from 'expo-system-ui'
import { Platform } from 'react-native'

export const setSystemColors = async (bgColor: string, theme: 'light' | 'dark') => {
  if (!bgColor) return

  try {
    await SystemUI.setBackgroundColorAsync(bgColor)
    if (Platform.OS === 'android') {
      await NavigationBar.setBackgroundColorAsync(bgColor)
      await NavigationBar.setButtonStyleAsync(theme === 'dark' ? 'light' : 'dark')
      await NavigationBar.setBehaviorAsync('overlay-swipe')
      await setStatusBarBackgroundColor(bgColor, true)
    }
  } catch (error) {}
}
