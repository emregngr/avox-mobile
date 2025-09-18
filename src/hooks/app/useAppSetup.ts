import { getApp } from '@react-native-firebase/app'
import { getAuth, signOut } from '@react-native-firebase/auth'
import { getMessaging, requestPermission } from '@react-native-firebase/messaging'
import * as Network from 'expo-network'
import {
  getTrackingPermissionsAsync,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency'
import { useCallback, useEffect, useState } from 'react'
import { AppState, PermissionsAndroid, Platform } from 'react-native'
import mobileAds from 'react-native-google-mobile-ads'
import { MMKV } from 'react-native-mmkv'
import { Notifications } from 'react-native-notifications'

import { isProduction } from '@/config/env/environment'
import { ENUMS } from '@/enums'
import { useUserSession } from '@/hooks/app/useUserSession'
import { setIsAuthenticated } from '@/store/auth'
import { Logger } from '@/utils/common/logger'

const BADGE_CLEAR_DELAY = {
  BACKGROUND_TO_FOREGROUND: 500,
  INITIAL: 2000,
} as const

const app = getApp()
const messaging = getMessaging(app)
const auth = getAuth(app)

const storage = new MMKV()

export const useAppSetup = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  const clearBadge = useCallback(() => {
    try {
      if (Platform.OS === 'ios') {
        Notifications.ios.setBadgeCount(0)
      } else {
        Notifications.removeAllDeliveredNotifications()
      }
    } catch (error) {
      Logger.breadcrumb('Failed to clear badge', 'error', error as Error)
    }
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

      if (Platform.OS !== 'ios') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
      }
    } catch (error) {
      Logger.breadcrumb('Failed to setup notification permissions', 'error', error as Error)
    }
  }, [])

  const setupAuthentication = useCallback(async () => {
    try {
      const [token, hasValidSession] = await Promise.all([
        storage.getString(ENUMS.API_TOKEN),
        useUserSession(),
      ])

      if (token && hasValidSession) {
        setIsAuthenticated(true)
      } else {
        await signOut(auth)
        setIsAuthenticated(false)
      }
    } catch (error) {
      Logger.breadcrumb('Failed to setup authentication', 'error', error as Error)
      setIsAuthenticated(false)
    }
  }, [])

  const setupApp = useCallback(async () => {
    try {
      if (!__DEV__ && isProduction()) {
        await mobileAds().initialize()
      }

      await Promise.all([
        setupIOSTrackingListener(),
        setupNotificationPermissions(),
        setupAuthentication(),
      ])
    } catch (error) {
      Logger.breadcrumb('Failed to setup app', 'error', error as Error)
      setIsAuthenticated(false)
    }
  }, [setupIOSTrackingListener, setupNotificationPermissions, setupAuthentication])

  const setupNetworkListener = useCallback(() => {
    const subscription = Network.addNetworkStateListener(state => {
      setIsConnected(state.isConnected ?? null)
    })
    return subscription
  }, [])

  const setupClearBadgeListener = useCallback(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        setTimeout(clearBadge, BADGE_CLEAR_DELAY.BACKGROUND_TO_FOREGROUND)
      }
    }

    return AppState?.addEventListener('change', handleAppStateChange)
  }, [clearBadge])

  useEffect(() => {
    const networkUnsubscribe = setupNetworkListener()
    const clearBadgeUnsubscribe = setupClearBadgeListener()

    setupApp()

    return () => {
      networkUnsubscribe?.remove()
      clearBadgeUnsubscribe?.remove()
    }
  }, [setupApp, setupNetworkListener, setupClearBadgeListener])

  useEffect(() => {
    const badgeTimer = setTimeout(clearBadge, BADGE_CLEAR_DELAY.INITIAL)

    return () => clearTimeout(badgeTimer)
  }, [clearBadge])

  return { isConnected, setIsConnected }
}
