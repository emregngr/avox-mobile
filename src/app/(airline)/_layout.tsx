import { Stack } from 'expo-router'
import React from 'react'

export default function AirlineLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="airline-detail" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="all-popular-airlines" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  )
}
