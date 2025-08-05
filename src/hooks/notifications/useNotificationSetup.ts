import { getApp } from '@react-native-firebase/app'
import type {
  FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging'
import { router } from 'expo-router'
import { useCallback, useEffect } from 'react'

import { Logger } from '@/utils/common/logger'

const app = getApp()
const messaging = getMessaging(app)

export const useNotificationSetup = () => {
  const handleNotificationNavigation = useCallback((type: string, id: string) => {
    if (type === 'airline') {
      router.replace({
        params: { airlineId: id },
        pathname: '/airline-detail',
      })
    } else if (type === 'airport') {
      router.replace({
        params: { airportId: id },
        pathname: '/airport-detail',
      })
    }
  }, [])

  const setupNotifications = useCallback(() => {
    try {
      setBackgroundMessageHandler(
        messaging,
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          Logger.breadcrumb('Message handled in the background!', 'info', remoteMessage as any)
        },
      )

      const unsubscribeMessage = onMessage(
        messaging,
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          Logger.breadcrumb('Message handled in the foreground!', 'info', remoteMessage as any)
        },
      )

      const unsubscribeNotificationOpened = onNotificationOpenedApp(
        messaging,
        (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          Logger.breadcrumb('App opened from background!', 'info', remoteMessage as any)
          const type = remoteMessage?.data?.type as string
          const id = remoteMessage?.data?.id?.toString()

          if (type && id) {
            handleNotificationNavigation(type, id)
          }
        },
      )

      return () => {
        unsubscribeMessage?.()
        unsubscribeNotificationOpened?.()
      }
    } catch (error) {
      return () => {
        Logger.breadcrumb('Failed to setup notifications', 'error', error as Error)
      }
    }
  }, [handleNotificationNavigation])

  useEffect(() => setupNotifications(), [setupNotifications])
}
