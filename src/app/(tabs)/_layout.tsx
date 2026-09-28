import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router, useFocusEffect, useSegments } from 'expo-router'
import { NativeTabs } from 'expo-router/unstable-native-tabs'
import { useCallback, useMemo } from 'react'

import { getLocale } from '@/locales/i18next'
import useAuthStore from '@/store/auth'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore()
  const { selectedTheme } = useThemeStore()
  const segments: string[] = useSegments()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  const currentTab = segments?.[1] as string

  useFocusEffect(
    useCallback(() => {
      const protectedTabs = ['favorites']

      if (protectedTabs.includes(currentTab) && !isAuthenticated) {
        setTimeout(() => {
          router.replace({ params: { tab: currentTab }, pathname: '/auth' })
        }, 16)
      }
    }, [isAuthenticated, currentTab]),
  )

  return (
    <NativeTabs
      labelStyle={{
        default: {
          color: colors?.text100,
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: '700',
        },
        selected: {
          color: colors?.primary100,
        },
      }}
      backgroundColor={colors?.background?.primary}
      blurEffect={selectedTheme}
      iconColor={{
        default: colors?.onPrimary100,
        selected: colors?.primary100,
      }}
      indicatorColor={colors?.primary100}
      labelVisibilityMode="labeled"
      minimizeBehavior="onScrollDown"
      rippleColor={colors?.onPrimary50}
      shadowColor={colors?.onPrimary100}
    >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon family={MaterialCommunityIcons} name="home-outline" />
            ),
            selected: <NativeTabs.Trigger.VectorIcon family={MaterialCommunityIcons} name="home" />,
          }}
        />
        <NativeTabs.Trigger.Label>{getLocale('home')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="discover">
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={MaterialCommunityIcons}
                name="magnify-plus-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon family={MaterialCommunityIcons} name="magnify" />
            ),
          }}
        />
        <NativeTabs.Trigger.Label>{getLocale('discover')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon family={MaterialCommunityIcons} name="star-outline" />
            ),
            selected: <NativeTabs.Trigger.VectorIcon family={MaterialCommunityIcons} name="star" />,
          }}
        />
        <NativeTabs.Trigger.Label>{getLocale('favorites')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          src={{
            default: (
              <NativeTabs.Trigger.VectorIcon
                family={MaterialCommunityIcons}
                name="account-outline"
              />
            ),
            selected: (
              <NativeTabs.Trigger.VectorIcon family={MaterialCommunityIcons} name="account" />
            ),
          }}
        />
        <NativeTabs.Trigger.Label>{getLocale('profile')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
