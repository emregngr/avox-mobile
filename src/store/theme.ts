import { Appearance } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

const storage = new MMKV()

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ? JSON.parse(value) : null
  },
  removeItem: (name: string) => {
    storage.delete(name)
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value)
  },
}

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
        storage: createJSONStorage(() => mmkvStorage),
      },
    ),
  ),
)

export const { changeTheme } = useThemeStore.getState()

export default useThemeStore
