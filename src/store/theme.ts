import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

export type ThemeStateType = {
  loading: boolean
  selectedTheme: 'light' | 'dark'
}

export type ThemeActions = {
  changeTheme: (selectedThemeValue: 'light' | 'dark') => void
}

const useThemeStore = create<ThemeStateType & ThemeActions>()(
  devtools(
    persist(
      set => ({
        changeTheme: selectedThemeValue => {
          set({ selectedTheme: selectedThemeValue })
          Appearance.setColorScheme(selectedThemeValue)
        },
        loading: false,
        selectedTheme: Appearance.getColorScheme() as 'light' | 'dark',
      }),
      {
        name: 'theme',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const { changeTheme } = useThemeStore.getState()

export default useThemeStore
