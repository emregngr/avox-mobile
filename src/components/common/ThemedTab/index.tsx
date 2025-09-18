import { MaterialCommunityIcons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import * as Haptics from 'expo-haptics'
import { router, usePathname } from 'expo-router'
import type { ReactNode } from 'react'
import React, { memo, useMemo } from 'react'
import { Platform, TouchableNativeFeedback, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/common/ThemedText'
import { getLocale } from '@/locales/i18next'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

const Touchable = Platform.OS === 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback

type IconProps = {
  activeIcon: keyof typeof MaterialCommunityIcons.glyphMap
  inactiveIcon: keyof typeof MaterialCommunityIcons.glyphMap
  isActive: boolean
}

type TabButtonProps = {
  badge?: null | string
  hapticFeedback?: boolean
  icon: ReactNode
  isActive: boolean
  label: string
  onPress: () => void
  testID?: string
}

const IconComponent = ({ activeIcon, inactiveIcon, isActive }: IconProps) => {
  const { selectedTheme } = useThemeStore()
  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  return (
    <MaterialCommunityIcons
      color={isActive ? colors?.onPrimary100 : colors?.onPrimary70}
      name={isActive ? activeIcon : inactiveIcon}
      size={24}
    />
  )
}

export const ThemedTab = memo(() => {
  const { bottom } = useSafeAreaInsets()

  const pathname = usePathname()

  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const getCurrentIndex = () => {
    if (pathname.includes('/home')) return 0
    if (pathname.includes('/discover')) return 1
    if (pathname.includes('/favorites')) return 2
    if (pathname.includes('/profile')) return 3
    return 0
  }

  const currentIndex = getCurrentIndex()

  const handleTabPress = (route: string, index: number) => {
    if (currentIndex !== index) {
      Haptics.selectionAsync()
    }
    router.navigate(route)
  }

  return (
    <>
      <BlurView
        style={{
          backgroundColor: colors?.background?.blur,
          height: bottom + 60,
        }}
        className="absolute bottom-0 left-0 right-0 z-10"
        intensity={Platform.OS === 'ios' ? 30 : 50}
        tint={selectedTheme}
      />

      <View
        className="absolute bottom-0 left-0 right-0 bg-transparent z-50"
        style={{ paddingBottom: bottom }}
      >
        <View className="flex-row justify-around">
          <TabButton
            icon={(
              <IconComponent
                activeIcon="home"
                inactiveIcon="home-outline"
                isActive={currentIndex === 0}
              />
            )}
            isActive={currentIndex === 0}
            label={getLocale('home')}
            onPress={() => handleTabPress('/home', 0)}
            testID="home-tab"
          />
          <TabButton
            icon={(
              <IconComponent
                activeIcon="magnify"
                inactiveIcon="magnify"
                isActive={currentIndex === 1}
              />
            )}
            isActive={currentIndex === 1}
            label={getLocale('discover')}
            onPress={() => handleTabPress('/discover', 1)}
            testID="discover-tab"
          />
          <TabButton
            icon={(
              <IconComponent
                activeIcon="star"
                inactiveIcon="star-outline"
                isActive={currentIndex === 2}
              />
            )}
            isActive={currentIndex === 2}
            label={getLocale('favorites')}
            onPress={() => handleTabPress('/favorites', 2)}
            testID="favorites-tab"
          />
          <TabButton
            icon={(
              <IconComponent
                activeIcon="account"
                inactiveIcon="account-outline"
                isActive={currentIndex === 3}
              />
            )}
            isActive={currentIndex === 3}
            label={getLocale('profile')}
            onPress={() => handleTabPress('/profile', 3)}
            testID="profile-tab"
          />
        </View>
      </View>
    </>
  )
})

const TabButton = memo(
  ({ badge, hapticFeedback = true, icon, isActive, label, onPress, testID }: TabButtonProps) => {
    const { selectedTheme } = useThemeStore()

    const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

    const handlePress = () => {
      if (hapticFeedback) {
        Haptics.selectionAsync()
      }
      onPress()
    }

    return (
      <Touchable
        background={TouchableNativeFeedback.Ripple(colors?.onPrimary50, false)}
        onPress={handlePress}
        testID={testID}
      >
        <View className="w-[75px] py-2 justify-center items-center">
          {icon}
          <ThemedText className="mt-1" color={isActive ? 'text-100' : 'text-70'} type="tabBar">
            {label}
          </ThemedText>
          {badge ? (
            <View className="absolute -top-1 right-5 w-4 h-4 justify-center items-center rounded-full overflow-hidden bg-error">
              <ThemedText color="text-100" type="body3">
                {badge}
              </ThemedText>
            </View>
          ) : null}
        </View>
      </Touchable>
    )
  },
)
