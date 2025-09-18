import 'dayjs/locale/en'
import 'dayjs/locale/tr'

import dayjs from 'dayjs'
import { getLocales } from 'expo-localization'
import { MMKV } from 'react-native-mmkv'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { i18nChangeLocale } from '@/locales/i18next'

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

const locales = getLocales()

export type LocaleStateType = {
  selectedLocale: string
}

export type LocaleActions = {
  changeLocale: (selectedLang: string) => Promise<void>
}

const useLocaleStore = create<LocaleStateType & LocaleActions>()(
  devtools(
    persist(
      set => ({
        changeLocale: async selectedLang => {
          set({ selectedLocale: selectedLang })
          dayjs.locale(selectedLang)
          await i18nChangeLocale(selectedLang)
        },
        selectedLocale: locales[0]?.languageCode ?? 'en',
      }),
      {
        name: 'locale',
        onRehydrateStorage: () => state => {
          if (state) {
            dayjs.locale(state.selectedLocale)
            i18nChangeLocale(state.selectedLocale)
          }
        },
        storage: createJSONStorage(() => mmkvStorage),
      },
    ),
  ),
)

export const { changeLocale } = useLocaleStore.getState()

export default useLocaleStore
