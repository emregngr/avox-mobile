import AsyncStorage from '@react-native-async-storage/async-storage'
import { Appearance } from 'react-native'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

export type ThemeStateType = {
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
        selectedTheme: Appearance.getColorScheme() ?? 'dark',
      }),
      {
        name: 'theme',
        onRehydrateStorage: () => state => {
          if (state) {
            Appearance.setColorScheme(state.selectedTheme)
          }
        },
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const { changeTheme } = useThemeStore.getState()

export default useThemeStore
