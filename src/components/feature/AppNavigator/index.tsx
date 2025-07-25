import { Stack } from 'expo-router'
import { useMemo } from 'react'

interface AppNavigatorProps {
  backgroundColor: string
  isAppReady: boolean | null
}

export const AppNavigator = ({ backgroundColor, isAppReady }: AppNavigatorProps) => {
  const stackScreenOptions = useMemo(
    () => ({
      animation: 'slide_from_bottom' as const,
      contentStyle: { backgroundColor },
      headerShown: false,
    }),
    [backgroundColor],
  )

  if (!isAppReady) {
    return (
      <Stack initialRouteName="index" screenOptions={stackScreenOptions}>
        <Stack.Screen name="index" />
      </Stack>
    )
  }

  return (
    <Stack initialRouteName="index" screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(maintenance)" />
      <Stack.Screen name="(force-update)" />
      <Stack.Screen name="(account)" />
      <Stack.Screen name="(settings)" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(airline)" />
      <Stack.Screen name="(airport)" />
      <Stack.Screen name="(breaking-new)" />
      <Stack.Screen name="(destination)" />
      <Stack.Screen name="(airplane)" />
      <Stack.Screen name="token-expire" />
      <Stack.Screen name="(web-view-modal)" options={{ presentation: 'modal' }} />
      <Stack.Screen name="(image-modal)" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
