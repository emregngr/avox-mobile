import { Stack } from 'expo-router'
import React from 'react'

export default function AirlineLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="airline-detail" />
      <Stack.Screen name="all-popular-airlines" />
    </Stack>
  )
}
