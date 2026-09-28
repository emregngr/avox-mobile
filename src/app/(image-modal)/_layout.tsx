import { Stack } from 'expo-router'

export default function ImageModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="image-modal" />
    </Stack>
  )
}
