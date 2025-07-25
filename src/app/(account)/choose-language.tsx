import 'dayjs/locale/en'
import 'dayjs/locale/tr'

import crashlytics from '@react-native-firebase/crashlytics'
import dayjs from 'dayjs'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native'

import CheckMark from '@/assets/icons/checkmark.svg'
import { Header, SafeLayout, ThemedText } from '@/components/common'
import { getLocale, i18nChangeLocale } from '@/locales/i18next'
import useLocaleStore, { changeLocale } from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

type LanguageItem = {
  code: string
  flag: string
  id: number
  text: string
}

export default function ChooseLanguage() {
  const { selectedTheme } = useThemeStore()
  const { selectedLocale } = useLocaleStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const languages = useMemo(
    (): LanguageItem[] => [
      { code: 'tr', flag: '🇹🇷', id: 1, text: 'Türkçe' },
      { code: 'en', flag: '🇬🇧', id: 2, text: 'English' },
    ],
    [],
  )

  const handleChangeLanguage = useCallback(async (lang: string) => {
    try {
      dayjs.locale(lang)
      await i18nChangeLocale(lang)
      await changeLocale(lang)
      router.back()
    } catch (error: any) {
      Alert.alert(getLocale('error'), error?.message, [{ text: getLocale('ok') }])
      crashlytics().recordError(error)
    }
  }, [])

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const headerTitle = useMemo(() => getLocale('chooseLanguage'), [])

  const checkMarkColor = useMemo(() => colors?.onPrimary100, [colors])

  const renderLanguageItem = useCallback(
    (lang: LanguageItem, index: number) => {
      const { code, flag, id, text } = lang
      const isSelected = selectedLocale === code
      const isLastItem = languages?.length <= index + 1

      return (
        <View key={id}>
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row justify-between items-center p-4 h-14"
            hitSlop={10}
            onPress={() => handleChangeLanguage(code)}
          >
            <View className="flex flex-row justify-center item-center">
              <ThemedText color="text-100" type="h2">
                {flag}
              </ThemedText>
              <ThemedText className="ml-4" color="text-100" type="body1">
                {text}
              </ThemedText>
            </View>
            {isSelected ? <CheckMark color={checkMarkColor} height={20} width={20} /> : null}
          </TouchableOpacity>
          {!isLastItem ? <View className="border-b border-onPrimary-30 ml-4" /> : null}
        </View>
      )
    },
    [selectedLocale, languages, handleChangeLanguage, checkMarkColor],
  )

  return (
    <SafeLayout>
      <Header leftIconOnPress={handleBackPress} title={headerTitle} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-5"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-xl overflow-hidden bg-background-secondary">
          {languages?.map(renderLanguageItem)}
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
