import 'dayjs/locale/en'
import 'dayjs/locale/tr'
import 'react-native-reanimated'
import '../global.css'

import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCrashlytics, recordError } from '@react-native-firebase/crashlytics'
import * as Sentry from '@sentry/react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { router, useFocusEffect } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useCallback, useEffect, useMemo } from 'react'
import { InteractionManager, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { Notifications } from 'react-native-notifications'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useToastConfig } from '@/components/common'
import { AppNavigator } from '@/components/feature'
import { queryClient } from '@/config/app/queryClient'
import { ENUMS } from '@/enums'
import { useAppSetup } from '@/hooks/app/useAppSetup'
import { useAppUpdate } from '@/hooks/app/useAppUpdate'
import { useConnectionAlert } from '@/hooks/network/useConnectionAlert'
import { useNotificationSetup } from '@/hooks/notifications/useNotificationSetup'
import { useSystemUI } from '@/hooks/ui/useSystemUI'
import useThemeStore from '@/store/theme'
import { themeColors, themes } from '@/themes'
import { versionControl } from '@/utils/common/useCompareVersion'
import { maintenanceControl } from '@/utils/common/useIsMaintenance'

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_DSN || '',
  enabled: !__DEV__,
})

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

SplashScreen.preventAutoHideAsync()

const crashlytics = getCrashlytics()

const RootLayout = () => {
  const { selectedTheme } = useThemeStore()

  const colors = useMemo(() => themeColors?.[selectedTheme], [selectedTheme])

  useReactQueryDevTools(queryClient)

  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
  })

  const { appState, setAppState } = useAppSetup()
  const toastConfig = useToastConfig()

  useSystemUI()
  useConnectionAlert({
    isConnected: appState.isConnected,
    onConnectionChange: connected => {
      setAppState(prev => ({
        ...prev,
        isConnected: connected,
      }))
    },
  })
  useAppUpdate()
  useNotificationSetup()

  useFocusEffect(
    useCallback(() => {
      let isActive = true

      const checkAppState = async () => {
        try {
          const [maintenance, versionInvalid] = await Promise.all([
            maintenanceControl(),
            versionControl(),
          ])
          const seenOnboarding = await AsyncStorage.getItem(ENUMS.IS_ONBOARDING_SEEN)

          if (!isActive) return

          if (maintenance) return router.replace('/maintenance')
          if (versionInvalid) return router.replace('/force-update')
          if (!seenOnboarding) return router.replace('/onboarding')

          const initialUrl = await Linking.getInitialURL()
          if (initialUrl) {
            try {
              const parsedUrl = Linking.parse(initialUrl)
              const { hostname, queryParams } = parsedUrl

              if (hostname === 'airline') {
                return router.replace({
                  params: { airlineId: queryParams?.id },
                  pathname: '/airline-detail',
                })
              }

              if (hostname === 'airport') {
                return router.replace({
                  params: { airportId: queryParams?.id },
                  pathname: '/airport-detail',
                })
              }
            } catch (urlError) {}
          }

          const initialNotification = await Notifications?.getInitialNotification()
          if (initialNotification) {
            const type = initialNotification?.payload?.type
            const id = initialNotification?.payload?.id?.toString()

            if (type === 'airline') {
              return router.replace({
                params: { airlineId: id },
                pathname: '/airline-detail',
              })
            }

            if (type === 'airport') {
              return router.replace({
                params: { airportId: id },
                pathname: '/airport-detail',
              })
            }
          }

          if (!initialUrl && !initialNotification) {
            return router.replace('/home')
          }
        } catch (error) {
          if (!__DEV__) {
            recordError(crashlytics, error as Error)
          }
        } finally {
          setAppState(prev => ({ ...prev, isReady: true }))
        }
      }

      InteractionManager.runAfterInteractions(checkAppState)

      return () => {
        isActive = false
      }
    }, [setAppState]),
  )

  const isAppReady =
    fontsLoaded && appState.isConnected && appState.isReady && appState.splashDelayComplete

  useEffect(() => {
    if (isAppReady) {
      InteractionManager.runAfterInteractions(() => {
        SplashScreen.hideAsync()
      })
    }
  }, [isAppReady])

  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <SafeAreaProvider>
          <StatusBar
            backgroundColor={colors?.background?.primary}
            style={selectedTheme === 'dark' ? 'light' : 'dark'}
            translucent={false}
          />
          <GestureHandlerRootView className="flex-1">
            <KeyboardProvider>
              <View className="flex-1" style={themes?.[selectedTheme]}>
                <AppNavigator isAppReady={isAppReady} />
                <Toast config={toastConfig} />
              </View>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ActionSheetProvider>
    </QueryClientProvider>
  )
}

export default Sentry.wrap(RootLayout)
