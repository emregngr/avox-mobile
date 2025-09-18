import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import CheckMark from '@/assets/icons/checkmark.svg'
import { Header, SafeLayout, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useLocaleStore, { changeLocale } from '@/store/locale'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'
import { Logger } from '@/utils/common/logger'

type LanguageItem = {
  code: string
  flag: string
  id: string
  text: string
}

interface ChooseLanguageProps {
  hapticFeedback?: boolean
}

export default function ChooseLanguage({ hapticFeedback = true }: ChooseLanguageProps) {
  const { bottom, top } = useSafeAreaInsets()

  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const languages = useMemo(
    (): LanguageItem[] => [
      { code: 'tr', flag: '🇹🇷', id: '1', text: 'Türkçe' },
      { code: 'en', flag: '🇬🇧', id: '2', text: 'English' },
    ],
    [],
  )

  const handleChangeLanguage = useCallback(
    async (lang: string) => {
      try {
        if (hapticFeedback && selectedLocale !== lang) {
          Haptics.selectionAsync()
        }
        await changeLocale(lang)
        router.back()
      } catch (error) {
        Logger.breadcrumb('changeLocaleError', 'error', error as Error)
      }
    },
    [hapticFeedback, selectedLocale],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

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
            testID={`language-item-${code}`}
          >
            <View className="flex-row justify-center item-center">
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
    <SafeLayout testID="choose-language-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={getLocale('chooseLanguage')}
      />
      <ScrollView
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-xl overflow-hidden bg-background-secondary">
          {languages?.map(renderLanguageItem)}
        </View>
      </ScrollView>
    </SafeLayout>
  )
}
