import 'dayjs/locale/en'
import 'dayjs/locale/tr'
import '../global.css'

import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import { useMMKVDevTools } from '@rozenite/mmkv-plugin'
import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin'
import { usePerformanceMonitorDevTools } from '@rozenite/performance-monitor-plugin'
import { useTanStackQueryDevTools } from '@rozenite/tanstack-query-plugin'
import * as Sentry from '@sentry/react-native'
import { QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useFonts } from 'expo-font'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from 'react'
import { LogBox, View } from 'react-native'
import { SystemBars } from 'react-native-edge-to-edge'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { MMKV } from 'react-native-mmkv'
import { Notifications } from 'react-native-notifications'
import performance from 'react-native-performance'
import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { useToastConfig } from '@/components/common'
import { AppNavigator } from '@/components/feature'
import { queryClient } from '@/config/app/queryClient'
import config from '@/config/env/environment'
import { ENUMS } from '@/enums'
import { useAppSetup } from '@/hooks/app/useAppSetup'
import { useAppUpdate } from '@/hooks/app/useAppUpdate'
import { useConnectionAlert } from '@/hooks/network/useConnectionAlert'
import { useNotificationSetup } from '@/hooks/notifications/useNotificationSetup'
import { useSystemUI } from '@/hooks/systemUI/useSystemUI'
import useThemeStore from '@/store/theme'
import { themes } from '@/themes'
import { Logger } from '@/utils/common/logger'
import { maintenanceControl } from '@/utils/common/maintenanceControl'
import { versionControl } from '@/utils/common/versionControl'

LogBox.ignoreAllLogs(true)

configureReanimatedLogger({
  level: __DEV__ ? ReanimatedLogLevel.warn : ReanimatedLogLevel.error,
  strict: false,
})

Sentry.init({
  dsn: config.sentryDsn,
  enabled: !__DEV__,
})

dayjs.extend(customParseFormat)
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
})

SplashScreen.preventAutoHideAsync()

const storage = new MMKV()

const RootLayout = () => {
  const { selectedTheme } = useThemeStore()

  useNetworkActivityDevTools()
  usePerformanceMonitorDevTools()
  useTanStackQueryDevTools(queryClient)
  useMMKVDevTools({
    storages: [storage],
  })

  performance.mark('app-start')

  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
  })

  const { isConnected, setIsConnected } = useAppSetup()
  const toastConfig = useToastConfig()

  useSystemUI()
  useConnectionAlert({
    isConnected,
    onConnectionChange: connected => {
      setIsConnected(connected)
    },
  })
  useAppUpdate()
  useNotificationSetup()

  useEffect(() => {
    const checkAppStateAndNavigate = async () => {
      try {
        const [maintenance, versionInvalid] = await Promise.all([
          maintenanceControl(),
          versionControl(),
        ])
        const seenOnboarding = storage.getString(ENUMS.IS_ONBOARDING_SEEN)

        if (maintenance) return router.replace('/maintenance')
        if (versionInvalid) return router.replace('/force-update')
        if (!seenOnboarding) return router.replace('/onboarding')

        const initialUrl = await Linking.getInitialURL()
        if (initialUrl) {
          try {
            const parsedUrl = Linking.parse(initialUrl)
            const { hostname, queryParams } = parsedUrl as {
              hostname: string
              queryParams: Linking.QueryParams
            }
            const id = queryParams?.id?.toString()

            if (hostname === 'airline' && id) {
              return router.replace({
                params: { airlineId: id },
                pathname: '/airline-detail',
              })
            }

            if (hostname === 'airport' && id) {
              return router.replace({
                params: { airportId: id },
                pathname: '/airport-detail',
              })
            }
          } catch (error) {
            Logger.breadcrumb('initialUrlError', 'error', error as Error)
          }
        }

        const initialNotification = await Notifications?.getInitialNotification()
        if (initialNotification) {
          const type = initialNotification?.payload?.type as string
          const id = initialNotification?.payload?.id?.toString()

          if (type === 'airline' && id) {
            return router.replace({
              params: { airlineId: id },
              pathname: '/airline-detail',
            })
          }

          if (type === 'airport' && id) {
            return router.replace({
              params: { airportId: id },
              pathname: '/airport-detail',
            })
          }
        }

        const shouldGoHome =
          !initialUrl || (__DEV__ && initialUrl?.includes('expo-development-client'))

        if (shouldGoHome && !initialNotification) {
          return router.replace('/home')
        }
      } catch (error) {
        Logger.breadcrumb('checkAppStateAndNavigateError', 'error', error as Error)
      }
    }

    checkAppStateAndNavigate()
  }, [])

  const isAppReady = fontsLoaded && isConnected

  performance.mark('fonts-loaded')

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync()
      performance.measure('app-initialization', 'app-start', 'fonts-loaded')
    }
  }, [isAppReady])

  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <SafeAreaProvider>
          <SystemBars hidden={false} style={selectedTheme === 'dark' ? 'light' : 'dark'} />
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
