import { getLocales } from 'expo-localization'
import i18next from 'i18next'
import { getI18n, initReactI18next } from 'react-i18next'

import en from '@/locales/en.json'
import tr from '@/locales/tr.json'

const locales = getLocales()
i18next.language = locales[0]?.languageTag ?? 'en'

export const languageResources = i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
})

export const getLocale = (key: string, params?: Record<string, any>) => {
  const i18n = getI18n()
  let translatedText = i18n?.t(key)

  if (params) {
    Object.keys(params).forEach(paramKey => {
      translatedText = translatedText.replace(`{${paramKey}}`, params[paramKey])
    })
  }

  return translatedText
}

export const i18nChangeLocale = async (lng: string) => {
  const i18n = getI18n()
  await i18n?.changeLanguage(lng)
}

export default i18next
