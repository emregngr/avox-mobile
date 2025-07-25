import { Stack } from 'expo-router'
import React from 'react'

export default function ImageModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="image-modal" />
    </Stack>
  )
}
