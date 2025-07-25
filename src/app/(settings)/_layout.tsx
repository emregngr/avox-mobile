import { Stack } from 'expo-router'
import React from 'react'

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings" />
      <Stack.Screen name="settings-privacy-policy" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="settings-terms-of-use" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="faq" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  )
}
