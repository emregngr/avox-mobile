import { router, Tabs, useFocusEffect, useSegments } from 'expo-router'
import React, { useCallback } from 'react'

import { ThemedTab } from '@/components/common'
import { i18nChangeLocale } from '@/locales/i18next'
import useAuthStore from '@/store/auth'
import useLocaleStore from '@/store/locale'

export default function TabLayout() {
  const { selectedLocale } = useLocaleStore()
  const { isAuthenticated } = useAuthStore()
  const segments: string[] = useSegments()

  useFocusEffect(
    useCallback(() => {
      const changeLanguage = async () => {
        await i18nChangeLocale(selectedLocale)
      }
      changeLanguage()
    }, [selectedLocale]),
  )

  useFocusEffect(
    useCallback(() => {
      const currentTab = segments?.[1] as string
      const protectedTabs = ['favorites']

      if (protectedTabs.includes(currentTab) && !isAuthenticated) {
        router.replace({ params: { tab: currentTab }, pathname: '/auth' })
      }
    }, [isAuthenticated, segments]),
  )

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={props => <ThemedTab {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
