import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocales } from 'expo-localization'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

import { ENUMS } from '@/enums'

const locales = getLocales()

export type LocaleStateType = {
  loading: boolean
  selectedLocale: string
}

export type LocaleActions = {
  changeLocale: (lang: string) => Promise<void>
}

const useLocaleStore = create<LocaleStateType & LocaleActions>()(
  devtools(
    persist(
      set => ({
        changeLocale: async params => {
          set({ selectedLocale: params })
          await AsyncStorage.setItem(ENUMS.SELECTED_LANGUAGE, params)
        },
        loading: false,
        selectedLocale: locales[0]?.languageCode ?? 'en',
      }),
      {
        name: 'locale',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
)

export const { changeLocale } = useLocaleStore.getState()

export default useLocaleStore
