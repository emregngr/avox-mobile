import { router, Tabs, useFocusEffect, useSegments } from 'expo-router'
import React, { useCallback } from 'react'

import { ThemedTab } from '@/components/common'
import useAuthStore from '@/store/auth'

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore()
  const segments: string[] = useSegments()

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
