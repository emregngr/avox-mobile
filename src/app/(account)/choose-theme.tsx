import 'dayjs/locale/en'
import 'dayjs/locale/tr'

import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import React, { useCallback, useMemo } from 'react'
import { Platform, ScrollView, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Header, SafeLayout, ThemedText } from '@/components/common'
import { getLocale } from '@/locales/i18next'
import useThemeStore, { changeTheme } from '@/store/theme'
import { themeColors } from '@/themes'
import { cn } from '@/utils/common/cn'
import { responsive } from '@/utils/common/responsive'

interface ThemeItemType {
  icon: string
  id: string
  name: string
  value: 'dark' | 'light'
}

interface ChooseThemeProps {
  hapticFeedback?: boolean
}

const HEIGHT = responsive.deviceWidth / 2 - 24

export default function ChooseTheme({ hapticFeedback = true }: ChooseThemeProps) {
  const { bottom, top } = useSafeAreaInsets()

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const themes = useMemo(
    (): ThemeItemType[] => [
      {
        icon: '☀️',
        id: '1',
        name: getLocale('light'),
        value: 'light',
      },
      {
        icon: '🌙',
        id: '2',
        name: getLocale('dark'),
        value: 'dark',
      },
    ],
    [],
  )

  const handleChangeTheme = useCallback(
    (theme: 'light' | 'dark') => {
      if (hapticFeedback && selectedTheme !== theme) {
        Haptics.selectionAsync()
      }
      changeTheme(theme)
      router.back()
    },
    [hapticFeedback, selectedTheme],
  )

  const handleBackPress = useCallback(() => {
    router.back()
  }, [])

  const getRadioButtonProps = useCallback(
    (
      themeValue: 'dark' | 'light',
    ): { color: string; name: keyof typeof MaterialCommunityIcons.glyphMap } => {
      const isSelected = selectedTheme === themeValue

      return {
        color: isSelected ? colors?.success : colors?.onPrimary100,
        name: isSelected ? 'radiobox-marked' : 'radiobox-blank',
      }
    },
    [selectedTheme, colors],
  )

  const renderThemeItem = useCallback(
    (themeItem: ThemeItemType) => {
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
          testID={`theme-item-${value}`}
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

            <MaterialCommunityIcons color={radioProps.color} name={radioProps.name} size={24} />
          </View>
        </TouchableOpacity>
      )
    },
    [handleChangeTheme, getRadioButtonProps],
  )

  return (
    <SafeLayout testID="choose-theme-screen">
      <Header
        backIconOnPress={handleBackPress}
        containerClassName="absolute left-0 right-0 bg-transparent z-50"
        style={{ top }}
        title={getLocale('chooseTheme')}
      />

      <ScrollView
        contentContainerClassName="px-4"
        contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top + 64 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText className="my-8" color="text-100" type="h3">
          {getLocale('modeSelection')}
        </ThemedText>
        <View className="flex-row justify-between gap-4">{themes?.map(renderThemeItem)}</View>
      </ScrollView>
    </SafeLayout>
  )
}
