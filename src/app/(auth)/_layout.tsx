import { router, Stack, useFocusEffect, useGlobalSearchParams } from 'expo-router'
import React, { useCallback } from 'react'

import useAuthStore from '@/store/auth'

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore()
  const { tab } = useGlobalSearchParams()

  const validTabs = ['home', 'discover', 'favorites', 'profile']

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        const target = typeof tab === 'string' && validTabs.includes(tab) ? `/${tab}` : '/home'
        router.replace(target)
      }
    }, [isAuthenticated, tab]),
  )

  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_bottom',
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms-of-use" />
    </Stack>
  )
}
