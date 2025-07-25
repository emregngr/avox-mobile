import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import React, { useCallback } from 'react'

import useAuthStore from '@/store/auth'

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore()
  const { tab } = useLocalSearchParams()

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        router.replace(tab as string)
      }
    }, [isAuthenticated]),
  )

  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="auth" options={{ animation: 'slide_from_left' }} />
      <Stack.Screen name="login" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="register" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="forgot-password" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="privacy-policy" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="terms-of-use" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  )
}
