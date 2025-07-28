import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { getApp } from '@react-native-firebase/app'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { getCrashlytics, recordError } from '@react-native-firebase/crashlytics'
import { getMessaging, requestPermission } from '@react-native-firebase/messaging'
import dayjs from 'dayjs'
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency'
import { useCallback, useEffect, useState } from 'react'
import {
  Appearance,
  AppState,
  InteractionManager,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import mobileAds from 'react-native-google-mobile-ads'
import { Notifications } from 'react-native-notifications'

import { ENUMS } from '@/enums'
import { useUserSession } from '@/hooks/app/useUserSession'
import { i18nChangeLocale } from '@/locales/i18next'
import { setIsAuthenticated } from '@/store/auth'
import useLocaleStore from '@/store/locale'
import useThemeStore from '@/store/theme'

interface AppStateType {
  isConnected: boolean | null
  isReady: boolean
  splashDelayComplete: boolean
}

const BADGE_CLEAR_DELAY = {
  BACKGROUND_TO_FOREGROUND: 500,
  INITIAL: 2000,
} as const

const app = getApp()
const messaging = getMessaging(app)
const auth = getAuth()
const crashlytics = getCrashlytics()

export const useAppSetup = () => {
  const { selectedLocale } = useLocaleStore()
  const { selectedTheme } = useThemeStore()

  const [appState, setAppState] = useState<AppStateType>({
    isConnected: true,
    isReady: false,
    splashDelayComplete: false,
  })

  const clearBadge = useCallback(() => {
    try {
      if (Platform.OS === 'ios') {
        Notifications.ios.setBadgeCount(0)
      } else if (Platform.OS === 'android') {
        Notifications.removeAllDeliveredNotifications()
      }
    } catch (error) {}
  }, [])

  const setupIOSTrackingListener = useCallback(async () => {
    if (Platform.OS !== 'ios') return

    const { status } = await getTrackingPermissionsAsync()
    if (status === 'undetermined') {
      const handleTrackingPermission = async (nextAppState: string) => {
        if (nextAppState === 'active') {
          await requestTrackingPermissionsAsync()
          appStateSub?.remove()
        }
      }

      const appStateSub = AppState?.addEventListener('change', handleTrackingPermission)
    }
  }, [])

  const setupNotificationPermissions = useCallback(async () => {
    try {
      await requestPermission(messaging)

      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error)
    }
  }, [])

  const setupAuthentication = useCallback(async () => {
    try {
      const [token, hasValidSession] = await Promise.all([
        AsyncStorage.getItem(ENUMS.API_TOKEN),
        useUserSession(),
      ])

      if (token && hasValidSession) {
        setIsAuthenticated(true)
      } else {
        await signOut(auth)
        setIsAuthenticated(false)
      }
    } catch (error) {
      await signOut(auth)
      setIsAuthenticated(false)
    }
  }, [])

  const setupApp = useCallback(async () => {
    try {
      Appearance.setColorScheme(selectedTheme)
      dayjs.locale(selectedLocale)
      await i18nChangeLocale(selectedLocale)
      await mobileAds().initialize()

      await Promise.all([
        setupIOSTrackingListener(),
        setupNotificationPermissions(),
        setupAuthentication(),
      ])
    } catch (error) {
      setIsAuthenticated(false)
      if (!__DEV__) {
        recordError(crashlytics, error as Error)
      }
    }
  }, [
    selectedLocale,
    selectedTheme,
    setupIOSTrackingListener,
    setupNotificationPermissions,
    setupAuthentication,
  ])

  const setupNetworkListener = useCallback(
    () =>
      NetInfo?.addEventListener(state => {
        setAppState(prev => ({ ...prev, isConnected: state?.isConnected }))
      }),
    [],
  )

  const setupAppStateListener = useCallback(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setTimeout(clearBadge, BADGE_CLEAR_DELAY.BACKGROUND_TO_FOREGROUND)
      }
    }

    return AppState?.addEventListener('change', handleAppStateChange)
  }, [clearBadge])

  useEffect(() => {
    const networkUnsubscribe = setupNetworkListener()
    const appStateUnsubscribe = setupAppStateListener()

    InteractionManager.runAfterInteractions(() => {
      setupApp()
    })

    return () => {
      networkUnsubscribe?.()
      appStateUnsubscribe?.remove()
    }
  }, [setupApp, setupNetworkListener, setupAppStateListener])

  useEffect(() => {
    const badgeTimer = setTimeout(clearBadge, BADGE_CLEAR_DELAY.INITIAL)

    return () => clearTimeout(badgeTimer)
  }, [clearBadge])

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setAppState(prev => ({ ...prev, splashDelayComplete: true }))
    }, BADGE_CLEAR_DELAY.INITIAL)

    return () => clearTimeout(splashTimer)
  }, [])

  return { appState, setAppState }
}
