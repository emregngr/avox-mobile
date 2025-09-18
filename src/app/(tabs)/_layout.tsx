import { router, Tabs, useFocusEffect, useSegments } from 'expo-router'
import React, { useCallback } from 'react'

import { ThemedTab } from '@/components/common'
import useAuthStore from '@/store/auth'

export default function TabsLayout() {
  const { isAuthenticated } = useAuthStore()
  const segments: string[] = useSegments()

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
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="discover" />
        <Tabs.Screen name="favorites" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <ThemedTab />
    </>
  )
}
