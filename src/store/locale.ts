import 'dayjs/locale/en'
import 'dayjs/locale/tr'

import AsyncStorage from '@react-native-async-storage/async-storage'
import dayjs from 'dayjs'
import { getLocales } from 'expo-localization'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { i18nChangeLocale } from '@/locales/i18next'

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
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const { changeLocale } = useLocaleStore.getState()

export default useLocaleStore
