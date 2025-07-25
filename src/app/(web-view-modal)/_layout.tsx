import { Stack } from 'expo-router'
import React from 'react'

export default function WebViewModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="web-view-modal" />
    </Stack>
  )
}
