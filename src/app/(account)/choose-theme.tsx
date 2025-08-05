import 'dayjs/locale/en'
import 'dayjs/locale/tr'

import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'

import { Header, SafeLayout, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useThemeStore, { changeTheme } from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

interface ThemeItem {
  icon: string
  id: number
  name: string
  value: 'dark' | 'light'
}

const HEIGHT = responsive.deviceWidth / 2 - 24

export default function ChooseTheme() {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const themes = useMemo(
    (): ThemeItem[] => [
      {
        icon: '☀️',
        id: 1,
        name: getLocale('light'),
        value: 'light',
      },
      {
        icon: '🌙',
        id: 2,
        name: getLocale('dark'),
        value: 'dark',
      },
    ],
    [],
  )

  const handleChangeTheme = useCallback((theme: 'light' | 'dark') => {
    changeTheme(theme)
    router.back()
  }, [])

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const getRadioButtonProps = useCallback(
    (themeValue: 'dark' | 'light'): { color: string; name: any } => {
      const isSelected = selectedTheme === themeValue
      return {
        color: isSelected ? colors?.success : colors?.onPrimary100,
        name: isSelected ? 'radio-button-on' : 'radio-button-off',
      }
    },
    [selectedTheme, colors],
  )

  const renderThemeItem = useCallback(
    (themeItem: { icon: string; id: number; name: string; value: 'dark' | 'light' }) => {
      const { icon, id, name, value } = themeItem
      const radioProps = getRadioButtonProps(value)

      return (
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 rounded-xl border border-background-quaternary bg-background-secondary shadow shadow-background-quaternary"
          hitSlop={10}
          key={id}
          onPress={() => handleChangeTheme(value)}
          style={{ height: HEIGHT }}
        >
          <View
            className={cn(
              'flex-1 justify-between items-center',
              Platform.OS === 'ios' ? 'p-6' : 'p-4',
            )}
          >
            <ThemedText color="text-100" type="bigTitle">
              {icon}
            </ThemedText>

            <ThemedText color="text-100" type="body1">
              {name}
            </ThemedText>

            <View>
              <Ionicons color={radioProps.color} name={radioProps.name} size={24} />
            </View>
          </View>
        </TouchableOpacity>
      )
    },
    [handleChangeTheme, getRadioButtonProps],
  )

  return (
    <SafeLayout>
      <Header backIconOnPress={handleBackPress} title={getLocale('chooseTheme')} />

      <ScrollView contentContainerClassName="px-4 py-5" showsVerticalScrollIndicator={false}>
        <ThemedText className="my-8" color="text-100" type="h3">
          {getLocale('modeSelection')}
        </ThemedText>
        <View className="flex-row justify-between gap-4">{themes?.map(renderThemeItem)}</View>
      </ScrollView>
    </SafeLayout>
  )
}
