import { Stack } from 'expo-router'

export default function AirlineLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    >
      <Stack.Screen name="airport-detail" />
      <Stack.Screen name="all-popular-airports" />
    </Stack>
  )
}
