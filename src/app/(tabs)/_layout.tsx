import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useFocusEffect, useSegments } from 'expo-router'
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs'
import React, { useCallback, useMemo } from 'react'

import { getLocale } from '@/locales/i18next'
import useAuthStore from '@/store/auth'
import useThemeStore from '@/store/theme'
import { themeColors } from '@/themes'

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore()
  const { selectedTheme } = useThemeStore()
  const segments: string[] = useSegments()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  useFocusEffect(
    useCallback(() => {
      const currentTab = segments?.[1] as string
      const protectedTabs = ['favorites']

      if (protectedTabs.includes(currentTab) && !isAuthenticated) {
        setTimeout(() => {
          router.replace({ params: { tab: currentTab }, pathname: '/auth' })
        }, 16)
      }
    }, [isAuthenticated, segments]),
  )

  return (
    <NativeTabs
      labelStyle={{
        color: colors?.text100,
        fontFamily: 'Inter-Medium',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '700',
      }}
      backgroundColor={colors?.background?.primary}
      blurEffect={selectedTheme}
      iconColor={colors?.onPrimary100}
      indicatorColor={colors?.primary100}
      labelVisibilityMode="labeled"
      minimizeBehavior="onScrollDown"
      rippleColor={colors?.onPrimary50}
      shadowColor={colors?.onPrimary100}
    >
      <NativeTabs.Trigger name="home">
        <Icon src={<VectorIcon family={MaterialCommunityIcons} name="home" />} />
        <Label>{getLocale('home')}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="discover">
        <Icon src={<VectorIcon family={MaterialCommunityIcons} name="magnify" />} />
        <Label>{getLocale('discover')}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="favorites">
        <Icon src={<VectorIcon family={MaterialCommunityIcons} name="star" />} />
        <Label>{getLocale('favorites')}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon src={<VectorIcon family={MaterialCommunityIcons} name="account" />} />
        <Label>{getLocale('profile')}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
