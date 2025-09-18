import { Stack } from 'expo-router'
import React from 'react'

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ animation: 'slide_from_bottom', headerShown: false }}>
      <Stack.Screen name="settings" />
      <Stack.Screen name="settings-privacy-policy" />
      <Stack.Screen name="settings-terms-of-use" />
      <Stack.Screen name="faq" />
    </Stack>
  )
}
